import axios from 'axios'
import qs from 'qs'

import { message } from 'antd'

const BASEURL = ''

const Tip = (msg, showTime = 2) => {
  message.error(msg, showTime)
}

/** 
* 请求失败后的错误统一处理 
* @param {Number}   status 请求失败的状态码
*/
const errorHandle = (status) => {
  // 状态码判断
  switch (status) {
    case 404:
      Tip('请求的资源不存在！')
      break
    case 500:
      Tip('服务未启动！')
      break
    default:
      Tip('xxxxxxxxxxxxxxxxxxxxxxxxx')
  }
}

export const request = (config) => {
  const instance = axios.create({
    baseURL: BASEURL,
    timeout: 5000
  })

  // 请求拦截器
  instance.interceptors.request.use(config => {
    // 请求成功
    // 得到请求方式和请求体数据
    const { method, data } = config
    // 处理post请求, 将data对象转换成query参数格式字符串
    if (method.toLowerCase() === 'post' && typeof data === 'object') {
      config.data = qs.stringify(data) // username=admin&password=admin
    }
    return config
  }, err => {
    // 请求失败
    const { response } = err
    if (response) {
      errorHandle(response.status)
    }
  })

  // 响应拦截器
  instance.interceptors.response.use(response => {
    // 响应成功
    if (response.data.status === 0) {
      return response.data
    } else {
      errorHandle(response.data.status)
      Tip(response.data.msg)
    }
  }, err => {
    // 响应失败
      const { response } = err
    if (response) {
      errorHandle(response.status)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      if (!window.navigator.onLine) {
        // store.commit('changeNetwork', false)
        Tip('断网啦~~~~~~~~~')
      } else {
        return Promise.reject(err)
      }
    }
  })

  return instance(config)
}
