import React, { Component } from 'react'

import { Card, Button, Table, Modal, Form, Input, message } from 'antd'

import RightsForm from './RightsForm'


import moment from 'moment'

import Session from '../../common/session'
import { reqListRole, reqAddRole, reqUpdateRole } from '../../network/role'

const FormItem = Form.Item

class Role extends Component {
  RightsForm = React.createRef()
  state = {
    loading: false,
    pageSize: 2,
    roles: [
      {
        "menus": [
          "/role",
          "/charts/bar",
          "/home",
          "/category"
        ],
        "_id": "5ca9eaa1b49ef916541160d3",
        "name": "测试",
        "create_time": 1554639521749,
        "__v": 0,
        "auth_time": 1558679920395,
        "auth_name": "test007"
      },
    ],
    columns: [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => moment(create_time).format('YYYY-MM-DD hh:mm'),
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => moment(auth_time).format('YYYY-MM-DD hh:mm'),
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
      {
        title: '操作',
        render: (role) => <span style={{ color: '#1DA57A', cursor: 'pointer' }} onClick={() => this.addRights(role)}>设置权限</span>
      },
    ],
    roleModalVisible: false,

    rightModalVisible: false,
  }

  UNSAFE_componentWillMount() {
    this.reqListRole()
  }

  reqListRole = async () => {
    this.setState({ loading: true })
    const { data: roles } = await reqListRole()
    this.setState({ roles, loading: false })
  }


  addRole = () => { this.setState({ roleModalVisible: true }) }

  roleHandleOk = () => {
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const { roleName } = value
        await reqAddRole({ roleName })
        this.reqListRole()
        this.setState({ roleModalVisible: false })
        message.success('添加角色成功！', 2)
      }
    })
  }

  roleHandleCancel = () => {
    this.setState({ roleModalVisible: false })
    this.props.form.resetFields(['roleName'])
  }

  addRights = (role) => {
    this.role = role
    this.setState({ rightModalVisible: true })
  }

  rightHandleOk = async () => {
    const { _id } = this.role
    const menus = this.RightsForm.current.getCheckedKeys()
    const auth_time = Date.now()
    const auth_name = Session.user.getItem().username
    menus.splice(menus.findIndex(item => item === 'all'), 1)
    await reqUpdateRole({ _id, menus, auth_time, auth_name })
    this.reqListRole()
    this.setState({ rightModalVisible: false })
    message.success('设置权限成功！', 2)
  }

  rightHandleCancel = () => {
    this.setState({ rightModalVisible: false })
  }

  pageSizeChange = (pageNum, pageSize) => {
    this.setState({ pageSize })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { roles, columns, roleModalVisible, pageSize, loading, rightModalVisible } = this.state

    const roleTitle = (
      <Button type="primary" onClick={this.addRole}>创建角色</Button>
    )

    return (
      <Card title={roleTitle}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={roles}
          columns={columns}
          pagination={{
            pageSize,
            total: roles.length,
            showTotal: (total) => { return `Total ${total} items` },

            showSizeChanger: true, // 是否可以改变 pageSize
            pageSizeOptions: ['1', '2', '5', '10'], // 指定每页可以显示多少条

            onShowSizeChange: this.pageSizeChange, // pageSize 变化的回调
          }}
        />

        <Modal
          title="添加角色"
          visible={roleModalVisible}
          onOk={this.roleHandleOk}
          onCancel={this.roleHandleCancel}
        >
          <Form>
            <FormItem label="角色名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('roleName', {
                rules: [
                  { required: true, message: '请输入角色名称！' }
                ]
              })(
                <Input type="text" />
              )}
            </FormItem>
          </Form>
        </Modal>

        <Modal
          title="权限设置"
          visible={rightModalVisible}
          onOk={this.rightHandleOk}
          onCancel={this.rightHandleCancel}
        >
          <RightsForm role={this.role} ref={this.RightsForm} />
        </Modal>
      </Card>
    )
  }
}

export default Form.create({
  name: 'role'
})(Role)
