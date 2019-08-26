import request from '@/utils/request'

export function getCategoryList(params = '') {
  return request({
    url: '/api/product/category/' + params,
    method: 'get'
  })
}

export function getStyleList(params = '') {
  return request({
    url: '/api/product/style/' + params,
    method: 'get'
  })
}
