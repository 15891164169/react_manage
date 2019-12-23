import { request } from './request'

// 获取角色列表
export const reqListRole = () => {
  return request({
    url: '/manage/role/list',
  })
}

// 添加角色
export const reqAddRole = ({ roleName }) => {
  return request({
    url: '/manage/role/add',
    method: 'POST',
    data: { roleName }
  })
}

// 更新角色(给角色设置权限)
export const reqUpdateRole = ({ _id, menus, auth_time, auth_name }) => {
  return request({
    url: '/manage/role/update',
    method: 'POST',
    data: { _id, menus, auth_time, auth_name }
  })
}
