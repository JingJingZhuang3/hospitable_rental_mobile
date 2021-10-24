import React from "react"
import NavHeader from "../../components/NavHeader"
import styles from './index.module.css'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'

const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class CityMap extends React.Component{
    state = {
        housesList: [],
        isShowList: false
    }

    componentDidMount() {
        this.initMap()
    }

    initMap() {
        /**
         * Notes: 
         * In react scaffolding, global objects need to be accessed using Windows, 
         * otherwise will cuz ESLint error
         */
        // get current located city
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        // console.log(label, value)
        const map = new window.BMapGL.Map('container')
        // for other method usage
        this.map = map
        // Created an address parsing variable
        var myGeo = new window.BMapGL.Geocoder()
        // parse city name to lng and lat
        myGeo.getPoint(label, async point=>{
            if (point) {
                // Initialize the Map
                map.centerAndZoom(point, 11)
                // Added scale control
                map.addControl(new window.BMapGL.ScaleControl())
                // Added zoom control
                map.addControl(new window.BMapGL.ZoomControl())
                this.renderOverlays(value)
            }else{
                alert('The address you selected was unable to parsed!');
            }
        }, label)

        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList:false
                })
            }
        })
    }

    async renderOverlays(id) {
        try {
            // loading 
            Toast.show({
                content: 'Loading Houses',
                icon: 'loading',
                duration: 0,
            })
            // get data
            const res = await API.get(`/area/map?id=${id}`)
            // close loading
            Toast.clear()
            const { nextZoom, type } = this.getTypeAndZoom()
            res.data.body.forEach(item => {
                this.creatOverlays(item, nextZoom, type)
            })
        } catch (e) {
            // close loading
            Toast.clear()
        }
    }
    // Calc label type and zoom levels
    // district -> 11, range: >=10 <12
    // town -> 13， range: >=12 <14
    // community -> 15, range: >=14 <16
    getTypeAndZoom() {
        const zoom = this.map.getZoom() // zoom level
        let nextZoom, type
        if (zoom >= 10 && zoom < 12) {
            // label type
            nextZoom = 13
            type='circle'
        } else if (zoom >= 12 && zoom < 14) {
            nextZoom = 15
            type='circle'
        } else if (zoom >= 14 && zoom < 16) {
            type='rect' // rectangle
        }

        return { nextZoom, type }
    }

    creatOverlays(data, zoom, type) {
        const { coord: { longitude, latitude }, label: areaName, count, value } = data
        const areaPoint = new window.BMapGL.Point(longitude, latitude)
        if (type === 'circle') {
            // district or town
            this.creatCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // community
            this.creatRect(areaPoint, areaName, count, value)
        }
    }

    creatCircle(point, name, count, id, zoom) {
        // create map labels
        const label = new window.BMapGL.Label('', {
            position: point, // label location
            offset: new window.BMapGL.Size(-35, -35) // label offset
        })
        // unique id for label
        label.id = id
        // label content
        label.setContent(`
            <div class="${styles.bubble}">
                <p class="${styles.name}">${name}</p>
                <p>${count} for rent</p>
            </div>
        `)
        // label style
        label.setStyle(labelStyle)
        // onclick event
        label.addEventListener('click', () => {
            this.renderOverlays(id)
            // zoom in map
            this.map.centerAndZoom(point, zoom)
            // clear all labels after zoom in
            this.map.clearOverlays()
        })
        // add label to map
        this.map.addOverlay(label)
    }

    creatRect(point, name, count, id) {
        // create map labels
        const label = new window.BMapGL.Label('', {
            position: point, // label location
            offset: new window.BMapGL.Size(-60, -28) // label offset
        })
        // unique id for label
        label.id = id
        // label content
        label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${name}</span>
                <span class="${styles.housenum}">${count} Apt</span>
                <i class="${styles.arrow}"></i>
            </div>
        `)
        // label style
        label.setStyle(labelStyle)
        // onclick event
        label.addEventListener('click', (e) => {
            this.getHousesList(id)
            // console.log(e)
            // adjust map focus 
            const target = e.domEvent.changedTouches[0]
            const x = window.innerWidth / 2 - target.clientX
            const y = (window.innerHeight-330) / 2 - target.clientY
            this.map.panBy(x, y)
            
        })
        // add label to map
        this.map.addOverlay(label)
    }

    async getHousesList(id) {
        try {
            // loading 
            Toast.show({
                content: 'Loading Housing List',
                icon: 'loading',
                duration: 0,
            })
            const res = await API.get(`/houses?cityId=${id}`)
            Toast.clear()
            // console.log(res.data.body.list)
            this.setState({
                housesList: res.data.body.list,
                // when click -> show list
                isShowList: true
            })
        } catch (e) {
            Toast.clear()
        }
    }

    renderHousesList() {
        /* house list construction */
        return this.state.housesList.map(item => (
            <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img
                        className={styles.img}
                        src={BASE_URL + item.houseImg}
                        alt=""
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                        {item.tags.map((tag, index) => {
                            const tagClass = 'tag'+ (index%3 + 1)
                            return(
                                <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
                                    {tag}
                                </span>)
                        })}
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>￥{item.price}</span> /month
                    </div>
                </div>
            </div>
        ))
    }

    render() {
        return (
            <div className={styles.map}>
                <NavHeader>Map Search</NavHeader>
                <div id="container" className={styles.container} />
                {/* house list */}
                <div
                    className={[
                        styles.houseList,
                        this.state.isShowList ? styles.show : ''
                    ].join(' ')}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>Housing List</h1>
                        <Link className={styles.titleMore} to="/hospitable_rental_mobile/home/list">
                            More Houses
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {this.renderHousesList()}
                    </div>
                </div>
            </div>
        )
    }
}