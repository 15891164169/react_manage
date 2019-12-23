import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const { Option } = Select
const { Item } = Form

class AddCategoryForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categorys: PropTypes.array.isRequired,
    parentId: PropTypes.string.isRequired,
  }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const { categorys, parentId } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        AddCategoryForm
        <br />
        <br />
        分类级别：
        <br />
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId,
            })(
              <Select>
                <Option value="0">一级分类</Option>
                {
                  categorys.map((item, idx) => {
                    return (
                      <Option value={item._id} key={item._id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            )
          }
        </Item>
        分类名称：
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                { required: true, message: '分类名称不能为空' },
              ]
            })(
              <Input type="text" placeholder="请输入分类名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create({
  name: 'add-category-form',
})(AddCategoryForm)
