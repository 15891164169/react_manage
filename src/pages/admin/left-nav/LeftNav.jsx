import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import { menuList } from '../../../config/menuConfig'

const { Item, SubMenu } = Menu

class LeftNav extends Component {

  getLeftMenu = (menuList) => {
    return menuList.map(item => {
      if(!item.children) {
        return (
          <Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Item>
        )
      } else {
        let openKey = item.children.find(citem => this.props.location.pathname.indexOf(citem.key) !== -1)
        if(openKey) {
          this.openKey = item.key
        }
        return (
          <SubMenu key={item.key} title={<span><Icon type="mail" /><span>{item.title}</span></span>}>
            {
              this.getLeftMenu(item.children)
            }
          </SubMenu>
        )
      }
    })
  }
  
  render () {
    // const myMenu = this.getLeftMenu(menuList)
    const { pathname } = this.props.location
    return (
      <Menu mode="inline" theme="dark"
        onOpenChange={this.onOpenChange}
        selectedKeys={[pathname]}>
        { this.getLeftMenu(menuList) }
      </Menu>
    )
  }
}

export default withRouter(LeftNav)
