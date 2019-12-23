import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Modal, message } from 'antd'
import moment from 'moment'

import './header.less'

import Session from '../../../common/session.js'
import { menuList } from '../../../config/menuConfig.js'

// import { reqWeather } from '../../../network/login'

const { confirm } = Modal

class Header extends React.Component {

  state = {
    currentTime: moment().format('YYYY-MM-DD hh:mm:ss'),
    currentHour: '',
    weather: '',
    dayPictureUrl: '',
    nightPictureUrl: ''
  }

  componentDidMount () {
    this.intervalId = setInterval(() => {
      this.getTime()
    },1000)
    this.reqWeather('西安')
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  reqWeather = async (city) => {
    // const { weather, dayPictureUrl, nightPictureUrl } = await reqWeather(city)
    this.setState({
      // weather,
      // dayPictureUrl,
      // nightPictureUrl,
      weather: '晴',
      dayPictureUrl: '',
      nightPictureUrl: '',
    })
  }

  getTime = () => {
    let currentTime =  moment().format('YYYY-MM-DD hh:mm:ss')
    let currentHour = moment().format('hh')
    this.setState({
      currentTime,
      currentHour
    })
  }

  getTitle = (menuList) => {
    let title = ''
    const { pathname } = this.props.location
    menuList.forEach(item => {
      if(item.key === pathname) {
        title = item.title
      } else if (item.children) {
        let cItem = item.children.find(cItem => pathname.indexOf(cItem.key) === 0)
        if(cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  loginOut = () => {
    confirm({
      title: '确认退出吗?',
      // content: 'Some descriptions',
      maskClosable: true,
      onOk: () => {
        message.success('退出登录成功', 1, ()=>{
          Session.user.removeItem('user_info')
          this.props.history.replace('/login')
        })
      }
    })
  }

  render () {
    const { username } = Session.user.getItem()
    const { currentHour, weather, dayPictureUrl, nightPictureUrl }  = this.state
    return (
      <div className="header-wrapper">
        <div className="header-top">
          欢迎&nbsp;,&nbsp;{username}&nbsp;
          <Button type="primary" size="small" onClick={this.loginOut}>退出</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-title">{this.getTitle(menuList)}</div>
          <div className="header-bottom-weather">
            <span>{this.state.currentTime}</span>
            <span>{currentHour*1 < 6 || currentHour*1 > 18 ? '夜晚' : '白天'}</span>
            <span>
              <img src={currentHour*1 < 6 || currentHour*1 > 18 ? dayPictureUrl : nightPictureUrl} alt="weather" title="weather" />
            </span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
