import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout } from 'antd'

import LeftNav from './left-nav/LeftNav'
import Head from './header/Header'
// 路由组件
import Home from '../home/Home'
import Category from '../category/Category'
import Product from '../product/Product'
import Role from '../role/Role'
import User from '../user/User'
import Bar from '../charts/Bar'
import Line from '../charts/Line'
import Pie from '../charts/Pie'

import TitleImg from '../../assets/images/smoke.jpg'
import './admin.less'

import Session from '../../common/session.js'

class Admin extends Component {

  state = {
    collapsed: Session.leftNav.getItem()
  }

  onCollapse = (collapsed) => {
    Session.leftNav.setItem(collapsed)
    this.setState({ collapsed })
  }

  render () {
    const { Header, Footer, Sider, Content } = Layout
    if(!Session.user.getItem('user_info')._id) {
      this.props.history.replace('/login')
    }

    return (
      <Layout className="layout">
        <Sider className="layout-left" collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}>
          <div className="title-box">
            <img src={TitleImg} alt="title"/>
            <p style={{display: !this.state.collapsed ? 'block' : 'none'}}>后台管理</p>
          </div>
          <LeftNav />
        </Sider>
        <Layout className="layout-right">
          <Header className="layout-right-header">
            <Head />
          </Header>
          <Content className="layout-right-content">
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Route path="/bar" component={Bar} />
              <Route path="/line" component={Line} />
              <Route path="/pie" component={Pie} />
              <Redirect to="/home"/>
            </Switch>
          </Content>
          <Footer className="layout-right-footer">Footer</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Admin
