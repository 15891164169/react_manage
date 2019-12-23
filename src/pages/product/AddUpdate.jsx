import React, { Component } from 'react'
import { Card, Icon, Form, Input, Button, Cascader, message } from 'antd'

import RichTextEditor from './RichTextEditor'
import PicturesWall from './PicturesWall'

import { reqCategory, } from '../../network/category'
import { reqAddProduct, reqUpdateProduct } from '../../network/product'

const FormItem = Form.Item
const { TextArea } = Input

const formWrapperLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
}

class ProductAddUpdate extends Component {
  richTextEditor = React.createRef()
  picturesWall = React.createRef()

  state = {
    options: []
  }

  UNSAFE_componentWillMount() {
    const { state } = this.props.location
    this.isUpdate = !!state
    this.product = state ? state.product : {}
  }
  componentDidMount() {
    this.reqCategory('0')
  }

  reqCategory = async (parentId) => {
    const { data: categorys } = await reqCategory({ parentId })
    if (parentId === '0') {
      this.initOptions(categorys)
    } else {
      return categorys
    }
  }

  initOptions = async (categorys) => {
    const options = categorys.map(item => {
      return {
        value: item._id,
        label: item.name,
        isLeaf: false,
      }
    })
    const { isUpdate, product } = this
    const { pCategoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      const subCategorys = await this.reqCategory(pCategoryId)
      const subOptions = subCategorys.map(item => {
        return {
          value: item._id,
          label: item.name,
          isLeaf: true,
        }
      })
      const targetOption = options.find(option => option.value === pCategoryId)
      targetOption.children = subOptions
    }
    this.setState({ options })
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true
    const subCategorys = await this.reqCategory(targetOption.value)
    if (subCategorys && subCategorys.length > 0) {
      const subOptions = subCategorys.map(item => {
        return {
          value: item._id,
          label: item.name,
          isLeaf: true,
        }
      })
      targetOption.children = subOptions
      targetOption.loading = false
    } else {
      targetOption.loading = false
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options],
    })
  }

  validatorPrice = (rule, value, callback) => {
    if (value * 1 < 0) {
      callback('价格不能小于0')
    } else {
      callback()
    }
  }

  addProduct = () => {
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const { _id } = this.props.location.state.product
        const imgs = this.picturesWall.current.getImages()
        const detail = this.richTextEditor.current.getDetailHtml()
        const { name, desc, price, categoryIds } = value
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        if (this.isUpdate) {
          await reqUpdateProduct({ _id, categoryId, pCategoryId, name, desc, price, categoryIds, imgs, detail })
          message.success('修改商品成功！', 1)
        } else {
          await reqAddProduct({ categoryId, pCategoryId, name, desc, price, categoryIds, imgs, detail })

          message.success('添加商品成功！', 1)
        }
        setTimeout(() => {
          this.props.history.goBack()
        }, 1000)

      } else {
        message.error('请确认表单信息有效！', 1)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { isUpdate, product } = this
    const { name, desc, price, detail, imgs, pCategoryId, categoryId } = product
    let categoryIds = []
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const cardTitle = (
      <span>
        <Icon type="arrow-left"
          style={{ margin: '0 10px 0 0', fontSize: 18, color: '#1DA57A', cursor: 'pointer' }}
          onClick={() => this.props.history.go(-1)}
        />
        {isUpdate ? '修改商品' : ' 添加商品'}
      </span>
    )
    return (
      <Card title={cardTitle} className="addupdate-card">
        <Form {...formWrapperLayout}>
          <FormItem label="商品名称" >
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [
                { required: true, message: '请输入商品名称!' },
              ],
            })(
              <Input placeholder="请输入商品名称!" allowClear />,
            )}
          </FormItem>

          <FormItem label="商品描述">
            {getFieldDecorator('desc', {
              initialValue: desc,
              rules: [
                { required: true, message: '请输入商品描述!' },
              ],
            })(
              <TextArea placeholder="请输入商品描述!" autoSize={{ minRows: 2, maxRows: 8 }} />,
            )}
          </FormItem>

          <FormItem label="商品价格">
            {getFieldDecorator('price', {
              initialValue: price,
              rules: [
                { required: true, message: '请输入商品价格!' },
                { validator: this.validatorPrice }
              ],
            })(
              <Input type="number" placeholder="请输入商品价格!" addonAfter="元"
              />,
            )}
          </FormItem>

          <FormItem label="商品分类">
            {getFieldDecorator('categoryIds', {
              initialValue: categoryIds,
              rules: [
                { required: true, message: '请选择商品分类!' },
              ],
            })(
              <Cascader
                options={this.state.options}
                loadData={this.loadData}
                placeholder="未选择"
              />,
            )}
          </FormItem>

          <FormItem label="商品图片" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            {/* {getFieldDecorator('imgs', {
              rules: [
                { required: true, message: '请选择商品图片!' },
              ],
            })( */}
            <PicturesWall imgs={imgs} ref={this.picturesWall} />
            {/* )} */}
          </FormItem>

          <FormItem label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
            <RichTextEditor detail={detail} ref={this.richTextEditor} />
          </FormItem>

          <FormItem wrapperCol={{span: 24}} style={{textAlign:'center'}}>
            <Button type="primary" htmlType="submit" onClick={this.addProduct}>
              {isUpdate ? '修改商品' : '添加商品'}
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create({
  name: 'addupdate'
})(ProductAddUpdate)
