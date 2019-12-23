import { request } from './request.js'
import jsonp from 'jsonp'

import { message } from 'antd'


// 登陆
export const reqLogin = ({ username, password }) => {
  return request({
    url: 'login',
    method: 'POST',
    data: { username, password }
  })
}

export const reqWeather = (city) => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    return jsonp(url, {
      timeout: 5000
    }, (error, data) => {
      if(!error && data.status === 'success') {
        const { weather, dayPictureUrl, nightPictureUrl } = data.results[0].weather_data[0]
        resolve({ weather, dayPictureUrl, nightPictureUrl })
      } else {
        message.warning('获取天气状况失败', 2)
      }
    })
  })
}
