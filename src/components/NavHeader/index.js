import React from "react"
import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
// avoid classname collision
import styles from './index.module.css'

// only route render component can get route info.
// need to use withRouter to solve the problem.
function NavHeader({ children, history, onLeftClick }) {
    // handle click
    const defaultHandler = () => history.go(-1)
    return (
        <NavBar
            className={styles.navBar}
            backArrow={<i className="iconfont icon-back" />}
            onBack={ onLeftClick || defaultHandler }
        >{children}</NavBar>
    )
}

// Props inspection 
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

// withRouter(NavHeader) returns a component
export default withRouter(NavHeader)