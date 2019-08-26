import { login, logout, getUserDetail } from '@/api/user'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  user_id: getUser(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response.result
        commit('SET_TOKEN', data.token)
        commit('SET_USER_ID', data.user_id)
        setToken(data.token)
        setUser(data.user_id)
        resolve()
      }).catch(error => {
        console.log('--login', error)
        reject(error)
      })
    })
  },

  // get user info
  getUserDetail({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserDetail(state.user_id).then(response => {
        const data = response.result

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        if (data.user_role_name) {
          // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', Array(data.user_role_name))
        } else {
          reject('角色不能为空')
        }

        commit('SET_NAME', data.profile.true_name)
        commit('SET_AVATAR', 'http://hyym.oocpo.com/2647970cc4df11e98f31c4b301cc20dd.jpg')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.user_id).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USER_ID', 0)
        commit('SET_ROLES', [])
        removeToken()
        removeUser()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

