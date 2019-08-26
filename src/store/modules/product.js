import { getCategoryList, getStyleList } from '@/api/product'

const state = {
  categories: [],
  styles: []
}

const mutations = {
  SET_CATEGORY: (stat, categories) => {
    state.categories = categories
  },
  SET_STYLE: (stat, styles) => {
    state.styles = styles
  }
}

const actions = {
  /**
   * 获取分类
   * @param {} param0s
   */
  getCategories({ commit }) {
    return new Promise((resolve, reject) => {
      getCategoryList().then(response => {
        commit('SET_CATEGORY', response.result.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  /**
   * 获取风格
   * @param {*} param0
   */
  getStyles({ commit }) {
    return new Promise((resolve, reject) => {
      getStyleList().then(response => {
        commit('SET_STYLE', response.result.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

