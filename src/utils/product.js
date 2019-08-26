/**
 * Created by yangming on 19/08/19.
 */
import store from '@/store'

/**
 * 获取分类
 * @param {style_id} str
 * @returns {str}
 */
export function getCategoryById(style_id) {
  const items = store.getters.categories
  var item = {}

  for (let i = 0; i < items.length; i++) {
    if (items[i]._id === style_id) {
      item = items[i]
      break
    }
  }
  return item
}

/**
 * 获取风格
 * @param {style_id} str
 * @returns {str}
 */
export function getStyleById(style_id) {
  const items = store.getters.styles
  var item = {}

  for (let i = 0; i < items.length; i++) {
    if (items[i]._id === style_id) {
      item = items[i]
      break
    }
  }
  return item
}
