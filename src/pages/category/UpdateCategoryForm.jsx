import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

class UpdateCategoryForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categoryName: PropTypes.object.isRequired,
  }

  handleSubmit = () => { }

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const Item = Form.Item
    const { getFieldDecorator } = this.props.form
    return (
      <Form>
        UpdateCategoryForm
        <br />
        <br />
        分类名称：
        <br />
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: this.props.categoryName.name,
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
  name: 'update-category-form',
})(UpdateCategoryForm)
