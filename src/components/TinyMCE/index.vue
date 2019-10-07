<template>
  <div id="editor" />
</template>

<script>
import E from 'wangeditor'
import store from '@/store'

export default {
  name: 'TinyMCE',
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    reload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: new E('#editor')
    }
  },
  watch: {
    reload() {
      this.editor.txt.html(this.form.content)
    }
  },
  mounted() {
    var that = this
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      // 'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'list', // 列表
      'justify', // 对齐方式
      'image' // 插入图片
      // 'undo', // 撤销
      // 'redo' // 重复
    ]
    this.editor.customConfig.onchange = function(html) {
      that.form.content = html // 内容变化触发
    }
    this.editor.customConfig.pasteIgnoreImg = true // 粘贴时过滤图片
    this.editor.customConfig.uploadImgServer = '/api/product/img/upload/'
    // this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024 // 3M
    this.editor.customConfig.uploadImgMaxSize = 500 * 1024 // 500K
    this.editor.customConfig.uploadImgMaxLength = 7
    this.editor.customConfig.zIndex = 100
    this.editor.customConfig.uploadImgHeaders = {
      'Authorization': 'Token ' + store.getters.token
    }
    // editor.customConfig.uploadFileName = 'myFileName'
    // editor.customConfig.uploadImgHooks = {
    //   customInsert: function(insertImg, result, editor) {
    //     var url = result.data
    //     insertImg(url)
    //   }
    // }
    this.editor.create()
  }
}
</script>

<style>
  .w-e-text-container{
    height: 500px !important;
  }
</style>
