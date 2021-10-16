import React from "react"
// import { Route } from 'react-router-dom'
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import { getCurrentCity } from '../../utils'
import { List, AutoSizer } from 'react-virtualized';


// Title A,B,C,.. height
const TITLE_HEIGHT = 36
// City Name row height
const NAME_HEIGHT = 50
// Available open Source city list
const AVAILABLE_CITY = ['北京','上海','广州','深圳']
// data format organization
const formatCityData = (list) => {
    const cityList = {}
    // sorting list
    // {label: "北京", value: "AREA|88cff55c-aaa4-e2e0", pinyin: "beijing", short: "bj"}
    list.forEach(item => {
        // get initial letter of each city
        const first = item.short.substr(0, 1)
        if (cityList[first]) {
            // cityList[i] = [{...},{...},...]
            cityList[first].push(item)
        } else {
            // cityList[i] = [{new list}]
            cityList[first] = [item]
        }
    })
    // get sorted index
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}

const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return 'Current Location'
        case 'hot':
            return 'Popular Cities'
        default:
            return letter.toUpperCase()
    }
}

export default class CityList extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],
            activeIndex: 0
        }
        // create ref obj
        this.cityListComponent = React.createRef()
    }
    handleBack = () => {
        this.props.history.go(-1)
    }
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city', {
            params: {
                level: 1
            }
        })
        // {label: "北京", value: "AREA|88cff55c-aaa4-e2e0", pinyin: "beijing", short: "bj"}
        const { cityList, cityIndex } = formatCityData(res.data.body)
        // console.log(cityList, cityIndex)
        // get popular city list
        const res_hot = await axios.get('http://localhost:8080/area/hot')
        cityList['hot'] = res_hot.data.body 
        cityIndex.unshift('hot')    // prepend
        // get current city location
        const curCity = await getCurrentCity()
        // add data to cityList page
        cityList['#'] = [curCity]
        cityIndex.unshift('#')
        // console.log(cityList, cityIndex, curCity)
        this.setState({
            cityList,
            cityIndex
        })
    }
    changeCity({ label, value }) {
        // click on available city
        if (AVAILABLE_CITY.indexOf(label) > -1) {
            // store to local storage
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
        } else {
            Toast.show("No Data Provided. Please Try Popular Cities:)")
        }
    }
    // List render: able to display city list data on UI
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        // get index form CityIndex
        const { cityIndex, cityList } = this.state
        const initLetter = cityIndex[index]
        // get city list based on the inital letter
        return (
          <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(initLetter)}</div>
                {
                    cityList[initLetter].map(item =>
                        <div className="name" key={item.value} onClick={() => this.changeCity(item)}>
                            {item.label} {item.pinyin}
                        </div>)
                }
          </div>
        );
    }
    // Calculate List Row Height
    getRowHeight = ({ index }) => {
        // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }
    // render right side index
    renderCityIndex() {
        // deconstruct state
        const {cityIndex, activeIndex} = this.state
        return cityIndex.map((item, index) =>
            <li className="city-index-item" key={item} onClick={() => {
                /**
                 * prob 1: This only able to make index list appear on screen not to the top
                 * solu 1: Add {scrollToAlignment="start"} to <List> is able to fix this problem
                 * prob 2: scrollToRow() for not loaded row will have location accuracy problem
                 * solu 2: Use measureAllRows() to calc the height of each list row (wrote in componentDidMount())
                 */
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? "index-active" : ''}>
                    {item === 'hot' ? 'Hot' : item.toUpperCase()}
                </span>
            </li>
        )
    }
    // rows index render: get render info form list components
    onRowsRendered = ({ startIndex }) => {
        // avoid repeat getting startIndex
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }
    async componentDidMount() {
        await this.getCityList()
        // Use measureAllRows() to calc the height of each list row, in order to fix scrollToRow() problem 2
        // Must make sure List has data, if null -> ERROR
        // solu: use await to wait for List get the data then excute following
        this.cityListComponent.current.measureAllRows()
    }
    render() {
        return (
            <div className = "citylist">
                <div className="navbar">
                    <NavBar
                        backArrow={<i className="iconfont icon-back" />}
                        onBack={this.handleBack}
                    >City List</NavBar>
                </div>
                {/* City List */}
                <AutoSizer>
                    {   // adjust list w+h
                        ({ width, height }) => <List
                            ref={this.cityListComponent} // connect cityListComponent with <List> in order to get values
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}  // distance btw list data
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    }
                </AutoSizer>
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}