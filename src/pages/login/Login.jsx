import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd'

import Smoke from '../../assets/images/smoke.jpg'
import './login.less'

import { reqLogin } from '../../network/login'

import Session from '../../common/session.js'

class Login extends Component {

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, {username, password}) => {
      if (!err) {
        if (username === 'admin' && password === 'admin') {
          const { data } = await reqLogin({username, password})
          message.success('登陆成功', 1)
          Session.user.setItem({
            username: data.username,
            _id: data._id
          })
          setTimeout(() => {
            this.props.history.replace('/admin')
          }, 1000)
        } else {
          message.error('用户名或密码不正确', 1)
        }
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const Item = Form.Item

    return (
      <div className="login">
        <div className="login-header">
          <img src={Smoke} alt="smoke"/>
          <h2>react 后台管理</h2>
        </div>
        <div className="login-content">
          <h1>用户登录</h1>
          {/* <div className="login-content-form"></div> */}
          <Form onSubmit={this.handleSubmit} className="login-content-form">
            <Item>
              {getFieldDecorator('username', {
                initialValue: 'admin',
                rules: [
                  { required: true, message: '请输入用户名!' },
                  { min: 4, message: '用户名最小4位' },
                  { max: 12, message: '用户名最大12位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能是数字、字母、下划线' }
                ],
              })(
                <Input
                  prefix={<Icon type="username" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                  allowClear
                />,
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                initialValue: 'admin',
                rules: [
                  { required: true, whitespace: true, message: '请输入密码!' },
                  { min: 4, message: '密码最小4位' },
                  { max: 12, message: '密码最大12位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '密码只能是数字、字母、下划线' }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" style={{width: "100%"}}>
                Log in
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create({
  name: 'login_comp'
})(Login)
