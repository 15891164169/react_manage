import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Upload, Icon, Modal, message } from 'antd'

import { reqDeleteImg } from '../../network/product'

import { BASE_IMAGE_URL } from '../../common/constants'

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

class PicturesWall extends Component {
  static propTypes = {
    imgs: PropTypes.array
  }

  constructor(props) {
    super(props)
    let fileList = []
    const { imgs } = this.props
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, idx) => ({
        uid: -idx,
        name: img,
        status: 'done',
        url: BASE_IMAGE_URL + img,
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }

  // state = {
  //   previewVisible: false,
  //   previewImage: '',
  //   fileList: [
  //     {
  //       uid: '-1',
  //       name: 'image.png',
  //       status: 'done',
  //       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  //     }
  //   ],
  // }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      const { status, data } = file.response
      if (status === 0) {
        message.success('图片添加成功！', 2)
        const { name, url } = data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('图片添加失败！', 2)
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg({ name: file.name })
      if (result && result.status === 0) {
        message.error('图片已删除！', 2)
      } else {
        message.error('图片删除失败！', 2)
      }
    }
    this.setState({ fileList })
  }

  getImages = () => {
    return this.state.fileList.map(item => item.name)
  }


  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          name="image"
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default PicturesWall
