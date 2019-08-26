import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/profiles/users/login/',
    method: 'post',
    data
  })
}

export function logout(id) {
  return request({
    url: '/api/profiles/users/' + id + '/logout/',
    method: 'post'
  })
}

export function getUserList(params = '') {
  return request({
    url: '/api/profiles/users/' + params,
    method: 'get'
  })
}

export function getUserDetail(id) {
  return request({
    url: '/api/profiles/users/' + id + '/',
    method: 'get'
  })
}
