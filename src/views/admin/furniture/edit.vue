<template>
  <section style="padding-top: 10px;">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="轮播">
        <el-upload
          action="/api/product/img/upload/"
          list-type="picture-card"
          multiple
          :limit="imgLimit"
          :file-list="imgItmes"
          :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleImgRemove"
          :on-success="handleImgUpSucsess"
          :on-exceed="handleExceed"
          :before-upload="beforeImgUpload"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="副标题">
        <el-input v-model="form.subtitle" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.category_id" style="width: 100%;" placeholder="请选择分类" @change="onCategoryChange">
          <el-option
            v-for="item in categoryItems"
            :key="item._id"
            :label="item.title"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="风格">
        <el-select v-model="form.style_id" multiple style="width: 100%;" :disabled="styleDisabled" placeholder="请选择风格">
          <el-option
            v-for="item in styleItems"
            :key="item._id"
            :label="item.title"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="内容">
        <TinyMCE :form.sync="form" :reload="reload" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import TinyMCE from '@/components/TinyMCE'
import { apiDetail, apiUpdate, apiAdd } from '@/api/common'
import store from '@/store'
import { getCategoryById } from '@/utils/product'

export default {
  components: {
    TinyMCE
  },
  data() {
    return {
      pkg: 'product',
      func: 'furniture',
      aid: 0,
      form: {
        title: '',
        subtitle: '',
        price: 0,
        img: [],
        content: '',
        category_id: '',
        style_id: []
      },
      reload: false,
      categoryItems: [],
      styleItems: [],
      imgItmes: [],
      imgList: [],
      imgLimit: 7,
      uploadDisabled: false,
      dialogImageUrl: '',
      dialogVisible: false,
      styleDisabled: false
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Token ' + store.getters.token
      }
    }
  },
  mounted() {
    this.aid = this.$route.params._id
    if (this.aid !== undefined) {
      this.fetchDetail()
    }
    this.categoryItems = store.getters.categories
    this.styleItems = store.getters.styles
  },
  methods: {
    fetchDetail() {
      apiDetail(this.pkg, this.func, this.aid).then(response => {
        // this.form = Object.assign({}, response.result)
        const result = response.result
        this.form.title = result.title
        this.form.subtitle = result.subtitle
        this.form.img = result.img
        this.form.content = result.content
        this.form.category_id = result.category_id
        this.form.style_id = result.style_id
        this.reload = !this.reload

        result.img.forEach(element => {
          this.imgItmes.push({ name: element, url: element })
        })
        const selCategory = getCategoryById(this.form.category_id)
        if (selCategory.type === '0') {
          this.styleDisabled = false
        } else {
          this.styleDisabled = true
        }
      })
    },
    /**
     * 获取图片url列表
     */
    getImgList(fileList) {
      this.imgList.splice(0, this.imgList.length)
      fileList.forEach(element => {
        if (element.response) {
          this.imgList = this.imgList.concat(element.response.data)
        } else {
          this.imgList.push(element.url)
        }
      })
    },
    onCategoryChange(item) {
      const selCategory = getCategoryById(item)
      if (selCategory.type === '0') {
        this.styleDisabled = false
      } else {
        this.styleDisabled = true
        this.form.style_id = []
      }
    },
    /**
     * 提交保存
     */
    handleSave() {
      if (this.imgList.length > 0) {
        this.form.img.splice(0, this.form.img.length)
        this.imgList.forEach(element => {
          this.form.img.push(element)
        })
      }

      if (this.aid) {
        apiUpdate(this.pkg, this.func, this.aid, this.form).then(response => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.handleBack()
        })
      } else {
        apiAdd(this.pkg, this.func, this.form).then(response => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.handleBack()
        })
      }
    },
    /**
     * 返回上一页
     */
    handleBack() {
      this.$router.push({
        name: 'AdminFurnitureList',
        params: this.$route.params
      })
    },
    /**
     * 删除图片回调
     */
    handleImgRemove(file, fileList) {
      this.getImgList(fileList)
    },
    /**
     * 预览图片
     */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /**
     * 插入图片回调
     */
    handleImgUpSucsess(response, file, fileList) {
      this.getImgList(fileList)
    },
    /**
     * 判断图片最大上传数量
     */
    handleExceed(file, fileList) {
      this.$message.error('最多只能上传' + this.imgLimit + '张')
    },
    beforeImgUpload(file) {
      // const isLt500KB = file.size / 1024 / 1024 < 2
      const isLt500KB = file.size / 1024 <= 500

      if (!isLt500KB) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isLt500KB
    }
  }
}
</script>
