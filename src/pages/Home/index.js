import React from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import './index.css'
import News from "../News"
import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'
import Map from '../Map'
import Rent from '../Rent'

/**
 * UI version: Ant Design Mobile v5
 * UI ref: https://mobile.ant.design/zh/components/tab-bar
 */

 const tabs = [
    {
        key: 'home',
        title: 'Home',
        icon: <i className="iconfont icon-ind" />
    },
    {
      key: 'list',
      title: 'Search',
      icon: <i className="iconfont icon-findHouse" />,
    },
    {
      key: 'news',
      title: 'News',
      icon: <i className="iconfont icon-infom" />,
    },
    {
      key: 'profile',
      title: 'My',
      icon: <i className="iconfont icon-my" />,
    },
]
class Home extends React.Component {
    // const [activeKey, setActiveKey] = useState(props.location.pathname)
    render() {
        // console.log(this.props)
        return (
            <div className="home">
                {/* render child route */}
                <Route exact path="/hospitable_rental_mobile/home" component={Index} />
                <Route path="/hospitable_rental_mobile/home/list" component={HouseList} />
                <Route path="/hospitable_rental_mobile/home/news" component={News} />
                <Route path="/hospitable_rental_mobile/home/profile" component={Profile} />
                <Route path="/hospitable_rental_mobile/home/map" component={Map} />
                <Route path="/hospitable_rental_mobile/home/rent" component={Rent} />
                {/* TabBar */}
                {/* Highlight icon: activeKey = last segement of pathname */}
                <TabBar
                    activeKey={this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/') + 1)}
                    onChange={key => {
                        key === 'home' ? this.props.history.push('/hospitable_rental_mobile/home') : this.props.history.push('/hospitable_rental_mobile/home/' + key)
                    }}
                >
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
        )
    }
}

export default Home