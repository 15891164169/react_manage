/*
  点击搜索的时候
    1、有搜索内容
      将isSearch设置为true
      发送 reqSearchProduct 请求
    2、无搜索内容
      将isSearch设置为false
      发送 reqProductList 请求
  pageNum和pageSize变化时，根据当前状态(输入框的值)判断发送 reqSearchProduct 或者 reqProductList
*/

import React, { Component } from 'react'

import { Card, Select, Input, Button, Icon, Table, message } from 'antd'

import { reqProductList, reqSearchProduct, reqUpdateStatus } from '../../network/product'

import './product.less'

const { Option } = Select

// 显示的第几页
const CURRENT_PAGE_NUM = 1
// 每页显示多少条
const SHOW_PAGE_SIZE = 1

export default class ProductHome extends Component {
  searchText = React.createRef()

  state = {
    searchType: 'productName',
    pageNum: CURRENT_PAGE_NUM,
    pageSize: SHOW_PAGE_SIZE,
    columns: [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        width: 120,
        render: (price) => `￥${price}`
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 120,
        align: 'center',
        render: (status, row) => {
          return (
            <div>
              <Button
                type="primary"
                onClick={() => this.reqUpdateStatus(row, status === 1 ? 0 : 1)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <br />
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        width: 120,
        render: (product) => {
          return (
            <span style={{ color: '#1DA57A' }}>
              <p style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => this.props.history.push('/product/detail', {product})}
              >
                详情
              </p>
              <p style={{ cursor: 'pointer' }}
                onClick={() => this.props.history.push('/product/addupdate', {product})}
              >修改</p>
            </span>
          )
        }
      },
    ],

    total: 0,
    products: [],
    loading: false,
  }

  componentDidMount() {
    const { pageNum, pageSize } = this.state
    this.reqProductList(pageNum, pageSize)
  }

  // 无   搜索条件的数据请求
  reqProductList = async (pageNum, pageSize) => {
    this.setState({ loading: true })
    let { data } = await reqProductList({ pageNum, pageSize })
    const { total, list } = data
    this.setState({
      total,
      products: list,
      loading: false,
    })
  }

  // 有   搜索条件的数据请求
  reqSearchProduct = async (pageNum, pageSize) => {
    const { searchType } = this.state
    this.setState({ loading: true })
    let { data } = await reqSearchProduct({
      pageNum,
      pageSize,
      searchName: this.searchText.current.input.value.trim(),
      searchType
    })
    const { total, list } = data
    this.setState({
      total,
      products: list,
      loading: false,
    })
  }

  // 对商品进行上架/下架处理
  reqUpdateStatus = async (product, status) => {
    await reqUpdateStatus({ productId: product._id, status })
    const { pageNum, pageSize } = this.state
    console.log(pageNum, pageSize)

    if (this.isSearch) {
      this.reqSearchProduct(pageNum, pageSize)
    } else {
      this.reqProductList(pageNum, pageSize)
    }
    message.success(`商品--${product.name}--状态更改为${status === 0 ? '在售' : '已下架'}`, 2)
  }

  // searchType下拉框change
  selectChange = (value) => {
    this.setState({ searchType: value })
  }

  // 搜索按钮点击
  serachProduct = () => {
    const { pageNum, pageSize } = this.state
    if (this.searchText.current.input.value.trim()) {
      this.isSearch = true
      this.setState({
        pageNum: 1,
        pageSize,
      }, () => {
        this.reqSearchProduct(1, pageSize)
      })
    } else {
      this.isSearch = false
      this.reqProductList(pageNum, pageSize)
    }
  }

  // 页码change
  pageNumChange = (pageNum, pageSize) => {
    this.setState({
      pageNum,
      pageSize,
    }, () => {
      if (this.isSearch) {
        this.reqSearchProduct(pageNum, pageSize)
      } else {
        this.reqProductList(pageNum, pageSize)
      }
    })
  }

  // 4条/每页change
  pageSizeChange = (pageNum, pageSize) => {
    this.setState({
      pageNum,
      pageSize
    }, () => {
      if (this.isSearch) {
        this.reqSearchProduct(pageNum, pageSize)
      } else {
        this.reqProductList(pageNum, pageSize)
      }
    })
  }


  // 添加商品
  addGoods = () => {
    this.props.history.push('/product/addupdate')
  }

  render() {
    const { pageNum, pageSize, columns, total, products, loading } = this.state

    const cardTitle = (
      <div>
        <Select defaultValue="productName" style={{ width: 150 }} onChange={this.selectChange}>
          <Option value="productName">按商品名称搜索</Option>
          <Option value="productDesc">按商品描述搜索</Option>
        </Select>
        <Input type="text" placeholder="关键字" style={{ width: 150, margin: '0 20px' }} ref={this.searchText} />
        <Button type="primary" onClick={this.serachProduct}>搜索</Button>
      </div>
    )

    const cardExtra = (
      <div>
        <Button type="primary" onClick={this.addGoods}>
          <Icon type="plus" />添加商品
        </Button>
      </div>
    )

    return (
      <Card title={cardTitle} extra={cardExtra}>
        <Table
          bordered
          rowKey="_id"
          dataSource={products}
          columns={columns}
          loading={loading}
          pagination={{
            current: pageNum, // 当前在第几页
            pageSize, // 每页显示多少条
            total,
            showTotal: () => { return `Total ${total} items` },
            showSizeChanger: true, // 是否可以改变 pageSize
            pageSizeOptions: ['1', '2', '5', '10'], // 指定每页可以显示多少条

            onShowSizeChange: this.pageSizeChange, // pageSize 变化的回调
            onChange: this.pageNumChange, // 页码改变的回调，参数是改变后的页码及每页条数
          }}
        />
      </Card>
    )
  }
}
