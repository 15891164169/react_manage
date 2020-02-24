import React, { Component } from 'react'

import { Row,Col } from 'antd'

import NotFoundImg from '../../assets/images/404.png'

import './notFound.less'

class NotFound extends Component {
  backHome = () => {
    this.props.history.replace('/home')
  }

  render() {
    return (
      <Row className="not-found">
        <Col span={10} className="not-found-left">
          <img src={NotFoundImg} alt="404"/>
        </Col>
        <Col span={14} className="not-found-right">
          <h2>404</h2>
          <p>抱歉，您访问的页面不存在。</p>
          <Button type="primary" onClick={this.backHome}>回到首页</Button>
        </Col>
      </Row>
    )
  }
}

export default NotFound