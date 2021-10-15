import React from "react"
// import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <Router>
      <div className="App">
        {/* redirect the default root path to home */}
        <Route path="/hospitable_rental_mobile" exact render={() => <Redirect to="/hospitable_rental_mobile/home" />} />
        {/* configure route */}
        <Route path="/hospitable_rental_mobile/home" component={Home}></Route>
        <Route path="/hospitable_rental_mobile/citylist" component={CityList}></Route>
      </div>
    </Router>
  );
}
export default App;
