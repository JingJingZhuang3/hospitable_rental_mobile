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
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        {/* configure route */}
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  );
}
export default App;
