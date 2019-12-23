import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Login from './pages/login/Login'
import Admin from './pages/admin/Admin'

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Admin} />
          <Redirect to="/login"/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
