import axios from 'axios'

// get current location city
export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    // check if localStorage contains located city
    if(!localCity) {
        return new Promise((resolve, reject) => {
            // get city name based on the IP
            var curCity = new window.BMapGL.LocalCity();
            try {
                // Get data only available for shanghai, beijing, guangzhou, shenzhen
                // other place will redirect to these 4
                curCity.get(async res => {
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                    // result.data.body => {label: 'shanghai', value: '...'}
        
                    // store to local storage
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body)
                })
            } catch (e) {
                // failed to get city location
                reject(e)
            }
        })
    }
    /** 
     * Note:
     * Above used Promise to handle asynchronization, 
     * to make the function return consist, here will also use Promise
     * 
     * Since this Promise won't fail, so here only need to return a success Promise
    */
    return Promise.resolve(localCity)
}