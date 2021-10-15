import React from "react"
// import { Route } from 'react-router-dom'
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'

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

class CityList extends React.Component{
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
    }
    componentDidMount() {
        this.getCityList()
    }
    render() {
        return (
            <div>
                <div className="navbar">
                    <NavBar
                        backArrow={<i className="iconfont icon-back" />}
                        onBack={this.handleBack}
                    >City List</NavBar>
                </div>
                <h1>Here will have the city list...</h1>
            </div>
        )
    }
}

export default CityList