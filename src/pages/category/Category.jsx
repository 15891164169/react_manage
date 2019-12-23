import React, { Component } from 'react'
// import Highlighter from 'react-highlight-words'
import { Card, Breadcrumb, Table, Button, Icon, Modal, message } from 'antd'

import AddCategoryForm from './AddCategoryForm'
import UpdateCategoryForm from './UpdateCategoryForm'

import { reqCategory, reqAddCategory, reqUpdateCategory } from '../../network/category'

class Category extends Component {

  state = {
    parentId: '0',
    categorys: [],
    subCategorys: [],
    categoryItem: {},
    pageSize: 5,
    showStatus: 0, // 0:不显示Modal   1:显示添加Modal  2:显示修改Modal
    confirmLoading: false,
    loading: false,
  }

  componentDidMount() {
    const { parentId } = this.state
    this.initColumns()
    this.getCategory(parentId)
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (text, record, idx) => {
          return (
            <p>
              <span style={{ color: '#1DA57A', cursor: 'pointer' }} onClick={() => { this.updateCategory(text, record, idx) }}>
                修改分类
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {
                this.state.parentId === '0'
                  ? <span style={{ color: '#1DA57A', cursor: 'pointer' }} onClick={() => this.getSubCategory(text)}>
                    查看子分类
                    </span>
                  : null
              }
            </p>
          )
        }
      }
    ]
  }

  // 获取分类数据  默认获取一级分类
  getCategory = async (parentId) => {
    this.setState({ loading: true })
    const { data: categorys } = await reqCategory({ parentId })
    if (parentId === '0') {
      this.setState({
        loading: false,
        categorys,
      })
    } else {
      this.setState({
        loading: false,
        subCategorys: categorys,
      })
    }
  }

  // 获取二级分类
  getSubCategory = (text) => {
    this.setState({
      parentId: text._id
    }, () => {
      this.getCategory(text._id)
    })
  }

  // 添加分类
  addCategory = () => {
    this.setState({
      showStatus: 1,
    })
  }

  addCategoryOk = () => {
    this.form.validateFields(async (err, value) => {
      if (!err) {
        const { parentId, categoryName } = value
        this.setState({ showStatus: 0 })
        const { data } = await reqAddCategory({
          parentId,
          categoryName,
        })
        // debugger
        /*
          问题： 是否刷新当前页面
          1、选择的分类 parentId 和 this.state.parentId 相等  获取当前数据刷新
          2、选择的分类 parentId 和 this.state.parentId 不相等  获取当前数据不刷新

        */
        // console.log(parentId)
        // console.log(this.state.parentId)
        // if(parentId === '0' && parentId === this.state.parentId) {
        // }
        if (parentId === this.state.parentId) {
          console.log('获取当前数据刷新')
          this.getCategory(parentId)
        } else if (parentId === '0') {
          this.getCategory(parentId)
        }
        this.form.resetFields()
        const categoryType = parentId === '0' ? '一级' : '二级'
        message.success(`添加--${categoryType}--分类成功，分类名${data.name}`, 2)
      } else {
        message.error(`分类名称不能为空`, 2)
      }
    })
  }

  // 修改分类
  updateCategory = (text) => {
    this.setState({
      showStatus: 2,
      categoryItem: text
    })
  }

  updateCategoryOk = () => {
    this.form.validateFields(async (err, value) => {
      if (!err) {
        const { parentId, categoryItem } = this.state
        const { categoryName } = value
        const { status } = await reqUpdateCategory({
          categoryId: categoryItem._id,
          categoryName: categoryName,
        })
        this.form.resetFields()
        if (status === 0) {
          this.setState({
            showStatus: 0,
            categoryItem: {},
          })
          message.success(`修改分类名成功----${value.categoryName}`, 2)
          this.getCategory(parentId)
        }
      } else {
        message.error(`分类名称不能为空!`, 1)
      }
    })
  }

  handleCancel = () => {
    this.form.resetFields()
    this.setState({
      showStatus: 0,
      categoryItem: {},
    })
  }

  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize
    })
  }


  showCategorys = () => {
    this.setState({
      parentId: '0',
      subCategorys: [],
    })
  }
  render() {

    const { categorys, subCategorys, parentId, categoryItem, loading, pageSize, showStatus, confirmLoading } = this.state

    const cardTitle = () => {
      return (
        <Breadcrumb separator="">
          <Breadcrumb.Item onClick={this.showCategorys}>
            <Icon type="arrow-right" />
            一级分类
            </Breadcrumb.Item>
          <Breadcrumb.Separator>
            <Icon type="arrow-right" />
          </Breadcrumb.Separator>
          <Breadcrumb.Item>二级分类</Breadcrumb.Item>
          <Breadcrumb.Separator>
            <Icon type="arrow-right" />
          </Breadcrumb.Separator>
          <Breadcrumb.Item>三级分类</Breadcrumb.Item>
        </Breadcrumb>
      )
    }

    return (
      <Card title={cardTitle()} extra={<Button type="primary" onClick={this.addCategory}><Icon type="plus" />添加</Button>}>
        <Table bordered
          rowKey="_id"
          columns={this.columns}
          loading={loading}
          dataSource={parentId === '0' ? categorys : subCategorys}
          pagination={{
            pageSize,
            total: parentId === '0' ? categorys.length : subCategorys.length,
            showTotal: total => { return `Total ${total} items` },
            hideOnSinglePage: false, // 只有一页时是否隐藏分页器
            showQuickJumper: true, // 是否可以快速跳转至某页
            pageSizeOptions: ['1', '2', '5', '10'], // 指定每页可以显示多少条
            showSizeChanger: true, // 是否可以改变 pageSize
            onShowSizeChange: this.onShowSizeChange, // pageSize 变化的回调
          }}
        />

        {/* 添加分类 */}
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategoryOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <AddCategoryForm
            setForm={(form) => this.form = form}
            parentId={parentId}
            categorys={categorys}
          />
        </Modal>

        {/* 修改分类名称 */}
        <Modal
          title="修改分类名称"
          visible={showStatus === 2}
          onOk={this.updateCategoryOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          <UpdateCategoryForm setForm={(form) => this.form = form} categoryName={categoryItem} />
        </Modal>
      </Card>
    )
  }
}

export default Category
