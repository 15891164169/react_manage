import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Form, Input, Tree } from 'antd'

import { menuList } from '../../config/menuConfig'

const FormItem = Form.Item
const { TreeNode } = Tree

class RightsForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  state = {
    checkedKeys: [],
  }

  UNSAFE_componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
    const { menus } = this.props.role
    this.setState({checkedKeys: menus})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { menus } = nextProps.role
    this.setState({checkedKeys: menus})
  }


  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key} >
          {!item.children ? null : this.getTreeNodes(item.children) }
        </TreeNode>
      )
      return pre
    }, [])
  }

  onRoleTreeCheck = (checkedKeys) => {
    this.setState({ checkedKeys })
  }

  getCheckedKeys = () => this.state.checkedKeys

  render() {
    const { role } = this.props
    const { checkedKeys } = this.state

    return (
      <div>
        <FormItem label="角色名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
          <Input disabled value={role.name} />
        </FormItem>
        <Tree
          checkable
          selectable={false}
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.onRoleTreeCheck}

          // treeData={menuList}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

export default RightsForm
