import { request } from './request.js'

// 获取商品分页列表
export const reqProductList = ({ pageNum, pageSize }) => {
  return request({
    url: '/manage/product/list',
    params: { pageNum, pageSize }
  })
}

// 根据ID/Name搜索产品分页列表
export const reqSearchProduct = ({ pageNum, pageSize, searchName, searchType }) => {
  return request({
    url: '/manage/product/search',
    params: { pageNum, pageSize, [searchType]: searchName }
  })
}

// 对商品进行上架/下架处理
export const reqUpdateStatus = ({ productId, status }) => {
  return request({
    url: '/manage/product/updateStatus',
    method: 'POST',
    data: { productId, status }
  })
}

// 根据分类ID获取分类
export const reqCategory = ({ categoryId }) => {
  return request({
    url: '/manage/category/info',
    params: { categoryId }
  })
}

// 添加商品
export const reqAddProduct = ({ categoryId, pCategoryId, name, desc, price, categoryIds, imgs, detail }) => {
  return request({
    url: '/manage/product/add',
    method: 'POST',
    data: { categoryId, pCategoryId, name, desc, price, categoryIds, imgs, detail }
  })
}

// 更新商品
export const reqUpdateProduct = ({ _id, categoryId, pCategoryId, name, desc, price, categoryIds, imgs, detail }) => {
  return request({
    url: '/manage/product/update',
    method: 'POST',
    data: { _id, categoryId, pCategoryId, name, desc, price, categoryIds, imgs, detail }
  })
}

// 删除图片
export const reqDeleteImg = ({ name }) => {
  return request({
    url: '/manage/img/delete',
    method: 'POST',
    data: { name }
  })
}
