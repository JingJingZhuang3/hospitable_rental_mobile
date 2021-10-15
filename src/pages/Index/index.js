import React from 'react'
// import { Route } from 'react-router-dom'
import { Swiper, Grid, Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// navigation menu data
const navs = [
    {
        id: 1,
        img: Nav1,
        title: 'Entire Rent',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: 'Flat-Share',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: 'Map Search',
        path: '/map'
    },
    {
        id: 4,
        img: Nav4,
        title: 'Rent Out',
        path: '/rent'
    }
]

// get current location
navigator.geolocation.getCurrentPosition(position => {
    // console.log('current position: ', position)
})

export default class Index extends React.Component{
    state = {
        swipers: [],
        // rental group data
        groups: [],
        // news data
        news: []
    }
    // get swipers images
    async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        // console.log(res.data.body[0].imgSrc)
        // res.data.body.map(item => images.concat(item.imgSrc))
        this.setState({
            swipers: res.data.body
        })
    }
    // get rental groups data
    async getGroups() {
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            groups: res.data.body
        })
    }
    // get news data
    async getNews() {
        const res = await axios.get('http://localhost:8080/home/news', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            news: res.data.body
        })
        // console.log(res.data.body)
    }
    componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()
    }
    // construct render swipers
    renderSwipers() {
        return this.state.swipers.map(item => (
            <Swiper.Item key={item.id}>
                <div
                    className='content'
                    onClick={() => {
                        Toast.show(`This is Swiper image ${item.id}.`)
                    }}
                >
                    {/* <a> tag only use if you want to click image to a link */}
                    {/* <a key={item.id} href="http://www.google.com"> */}
                    <img
                        src={`http://localhost:8080${item.imgSrc}`}
                        alt=""
                        style={{ width: '100%', verticalAlign: 'top' }}
                    />
                    {/* </a> */}
                </div>
            </Swiper.Item>
        ))
    }
    // render navigation menu
    renderNavs() {
        return navs.map(
            item => <Grid.Item key={item.id}>
                <div onClick={() => this.props.history.push(item.path)}>
                    <img src={item.img} alt="" />
                    <h2>{item.title}</h2>
                </div>
            </Grid.Item>
        )
    }
    // render group item
    renderGroups() {
        return this.state.groups.map(
            item => <Grid.Item key={item.id}>
                <div
                    className="group-item"
                    onClick={() => this.props.history.push('/home/profile')}
                >
                    <div className="desc">
                        <p className="title">{item.title}</p>
                        <span className="info">{item.desc}</span>
                    </div>
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </div>
            </Grid.Item>
        )
    }
    // render news data
    renderNews() {
        return this.state.news.map(
            item => <Grid.Item key={item.id}>
                <div
                    className="news-item"
                    onClick={() => this.props.history.push('/home/news')}
                >
                    <div className="imgwrap">
                        <img
                            className="img"
                            src={`http://localhost:8080${item.imgSrc}`}
                            alt=""
                        />
                    </div>
                    <div className="news-content">
                        <h3 className="title">{item.title}</h3>
                        <div className="news-info">
                            <span className="info1">{item.from}</span>
                            <span className="info2">{item.date}</span>
                        </div>
                    </div>
                </div>
            </Grid.Item>
        )
    }

    render() {
        return ( 
            <div>
                {/* Images Swiper */}
                <div className="swiper">
                    <Swiper autoplay>{this.renderSwipers()}</Swiper>
                    <Grid columns={13} className="search-box">
                        <Grid.Item span={12}> 
                            {/* search bar Component */}
                            <div className="search">
                                {/* location */}
                                <div className="location"
                                    onClick={() => this.props.history.push('/citylist')}
                                >
                                    <span className="name">Shanghai</span>
                                    <i className="iconfont icon-arrow" />
                                </div>
                                {/* search form */}
                                <div className="form"
                                    onClick={() => this.props.history.push('/search')}
                                >
                                    <i className="iconfont icon-search" />
                                    <span className="text">Enter location or address...</span>
                                </div>
                            </div>
                        </Grid.Item>
                        <div className="map-icon"
                            onClick={() => this.props.history.push('/map')}
                        >
                            <i className="iconfont icon-map" />
                        </div>
                    </Grid>
                </div>
                {/* Navigation menu */}
                <Grid columns={4} gap={0} className="nav">
                    {this.renderNavs()}
                </Grid>
                {/* Rental Group */}
                <div className="group">
                    <h3 className="group-title">
                        Rental Group
                        <span className="more">More</span>
                    </h3>
                    <Grid columns={2} gap={8}>
                        {this.renderGroups()}
                    </Grid>
                </div>
                {/* News list */}
                <div className="news">
                    <h3 className="group-title">Latest News</h3>
                        <Grid columns={1} gap={8}>
                            {this.renderNews()}
                        </Grid>
                    </div>
                </div>
        )
    }
}