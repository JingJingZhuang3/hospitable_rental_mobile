import React from "react"
import NavHeader from "../../components/NavHeader"
import styles from './index.module.css'

export default class CityMap extends React.Component{
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
        console.log(label, value)
        const map = new window.BMapGL.Map('container')
        // Created an address parsing variable
        var myGeo = new window.BMapGL.Geocoder();
        // parse city name to lng and lat
        myGeo.getPoint(label, function(point){
            if (point) {
                // Initialize the Map
                map.centerAndZoom(point, 11);
                // Added scale control
                map.addControl(new window.BMapGL.ScaleControl());
                // Added zoom control
                map.addControl(new window.BMapGL.ZoomControl());
            }else{
                alert('The address you selected was unable to parsed!');
            }
        }, label)
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