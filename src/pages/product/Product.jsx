import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import ProductHome from './Home'
import ProductDetail from './Detail'
import ProductAddUpdate from './AddUpdate'

class Product extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path="/product" component={ProductHome} />
        <Route exact path="/product/detail" component={ProductDetail} />
        <Route exact path="/product/addupdate" component={ProductAddUpdate} />
        <Redirect to="/product"/>
      </Switch>
    )
  }
}

export default Product
