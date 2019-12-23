import React, { Component } from 'react'

import { Card, Icon, List } from 'antd'

import { reqCategory } from '../../network/product'
import { BASE_IMAGE_URL } from '../../common/constants'

export default class ProductDetail extends Component {
  state = {
    pCategoryName: '',
    categoryName: '',
  }

  componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product
    this.reqCategoryId(pCategoryId, categoryId)
  }

  reqCategoryId = async (pCategoryId, categoryId) => {
    if (pCategoryId === '0') {
      const { data } = await reqCategory({ categoryId })
      this.setState({ categoryName: data.name })
    } else {
      Promise.all([reqCategory({ categoryId: pCategoryId }), reqCategory({ categoryId })]).then(res => {
        this.setState({
          pCategoryName: res[0].data.name,
          categoryName: res[1].data.name,
        })
      })
    }
  }

  render() {
    const { pCategoryName, categoryName } = this.state
    const { product } = this.props.location.state
    const cardTitle = (
      <span>
        <Icon type="arrow-left"
          style={{ margin: '0 10px 0 0', fontSize: 18, color: '#1DA57A', cursor: 'pointer' }}
          onClick={() => this.props.history.go(-1)}
        />
        商品详情
      </span>
    )

    return (
      <Card title={cardTitle} className="detail-card">
        <List>
          <List.Item className="list-item">
            <div className="item-title">商品名称：</div>
            <div className="item-content">{product.name}</div>
          </List.Item>

          <List.Item className="list-item">
            <div className="item-title">商品描述：</div>
            <div className="item-content">{product.desc}</div>
          </List.Item>

          <List.Item className="list-item">
            <div className="item-title">商品价格：</div>
            <div className="item-content">{product.price}元</div>
          </List.Item>

          <List.Item className="list-item">
            <div className="item-title">所属分类：</div>
            <div className="item-content">
              {pCategoryName} {pCategoryName === '' ? categoryName : ' --> ' + categoryName}
            </div>
          </List.Item>

          <List.Item className="list-item">
            <div className="item-title">商品图片：</div>
            <div className="item-content item-content-img">
              {
                product.imgs.map(item => {
                  return (
                    <img src={BASE_IMAGE_URL + item} alt={item} key={item} />
                  )
                })
              }
            </div>
          </List.Item>

          <List.Item className="list-item">
            <div className="item-title">商品详情：</div>
            <div className="item-content" dangerouslySetInnerHTML={{ __html: product.detail }}></div>
          </List.Item>
        </List>
      </Card>
    )
  }
}
