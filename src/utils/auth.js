import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserKey = 'user_id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return Cookies.get(UserKey)
}

export function setUser(user_id) {
  return Cookies.set(UserKey, user_id)
}

export function removeUser() {
  return Cookies.remove(UserKey)
}
