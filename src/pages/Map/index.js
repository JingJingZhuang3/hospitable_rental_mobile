import React from "react"
import NavHeader from "../../components/NavHeader"
import styles from './index.module.css'

export default class CityMap extends React.Component{
    componentDidMount() {
        /**
         * Notes: 
         * In react scaffolding, global objects need to be accessed using Windows, 
         * otherwise will cuz ESLint error
         */
        const map = new window.BMapGL.Map('container')
        // set a center point
        const point = new window.BMapGL.Point(116.404, 39.915)
        // Initialize the Map
        map.centerAndZoom(point, 15)
    }
    render() {
        return (
            <div className={styles.map}>
                <NavHeader>
                    Map Search
                </NavHeader>
                <div id="container" className={styles.container}/>
            </div>
        )
    }
}