import { request } from './request.js'

// 获取一级或某个二级分类列表
export const reqCategory = ({ parentId }) => {
  return request({
    url: '/manage/category/list',
    params: { parentId }
  })
}

// 添加分类
export const reqAddCategory = ({ parentId, categoryName }) => {
  return request({
    url: '/manage/category/add',
    method: 'POST',
    data: { parentId, categoryName }
  })
}

// 更新分类名称
export const reqUpdateCategory = ({ categoryId, categoryName }) => {
  return request({
    url: '/manage/category/update',
    method: 'POST',
    data: { categoryId, categoryName }
  })
}
