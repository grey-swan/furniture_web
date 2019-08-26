import request from '@/utils/request'

// 通用接口
export function apiList(pkg, func, params = '') {
  return request({
    url: '/api/' + pkg + '/' + func + '/' + params,
    method: 'get'
  })
}
export function apiDetail(pkg, func, id) {
  return request({
    url: '/api/' + pkg + '/' + func + '/' + id + '/',
    method: 'get'
  })
}
export function apiAdd(pkg, func, data) {
  return request({
    url: '/api/' + pkg + '/' + func + '/',
    method: 'post',
    data: data
  })
}
export function apiUpdate(pkg, func, id, data) {
  return request({
    url: '/api/' + pkg + '/' + func + '/' + id + '/',
    method: 'patch',
    data: data
  })
}
export function apiDelete(pkg, func, id) {
  return request({
    url: '/api/' + pkg + '/' + func + '/' + id + '/',
    method: 'delete'
  })
}
