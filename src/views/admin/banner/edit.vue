<template>
  <section style="padding-top: 10px;">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="封面图">
        <el-upload
          class="avatar-uploader"
          action="/api/product/img/upload/"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.cover" :src="form.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="form.sort_order" />
      </el-form-item>

      <el-form-item label="位置">
        <el-select v-model="form.position" style="width: 100%;" placeholder="请选择广告位置" @change="handlePositionChange">
          <el-option
            v-for="item in positionItems"
            :key="item._id"
            :label="item.title"
            :value="item._id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="链接类型">
        <el-select v-model="form.link_type" style="width: 100%;" placeholder="请选择链接类型" @change="handleLinkTypeChange">
          <el-option
            v-for="item in linkItems"
            :key="item._id"
            :label="item.title"
            :value="item._id"
          />
        </el-select>
      </el-form-item>

      <!-- 链接到列表 -->
      <section v-if="form.link_type === 0">
        <!-- 选择类别（商品、案例和设计师） -->
        <el-form-item label="类别">
          <el-select v-model="form.type" style="width: 100%;" placeholder="请选择类别" @change="handleTypeChange">
            <el-option
              v-for="item in typeItems"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <!-- 链接到家具需要选择风格 -->
        <section v-if="form.type === 0">
          <el-form-item label="风格">
            <el-select v-model="form.style_id" style="width: 100%;" placeholder="请选择关联风格" @change="handleStyleChange">
              <el-option
                v-for="item in styleItems"
                :key="item._id"
                :label="item.title"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
        </section>
      </section>

      <!-- 链接到详情 -->
      <section v-else-if="form.link_type === 1">
        <!-- 选择类别（商品、案例和设计师） -->
        <el-form-item label="类别">
          <el-select v-model="form.type" style="width: 100%;" placeholder="请选择类别" @change="handleTypeChange">
            <el-option
              v-for="item in typeItems"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-select
            v-model="form.product_id"
            style="width: 100%;"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteQuery"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </section>

      <!-- 静态页，只有一张图片，不会跳转 -->
      <section v-else />

      <el-form-item>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { apiList, apiDetail, apiUpdate, apiAdd } from '@/api/common'
import { getStyleById } from '@/utils/product'
import { Promise } from 'q'
import store from '@/store'

export default {
  data() {
    return {
      pkg: 'product',
      func: 'banner',
      aid: 0,
      positionItems: [
        { _id: 0, title: '第一广告位' },
        { _id: 1, title: '第二广告位' }
      ],
      linkItems: [
        { _id: 0, title: '列表页' },
        { _id: 1, title: '详情页' },
        { _id: 2, title: '静态页' }
      ],
      typeItems: [
        { _id: 0, title: '家具' },
        { _id: 1, title: '案例' },
        { _id: 2, title: '设计师' }
      ],
      styleItems: [],
      form: {
        cover: '',
        sort_order: 1,
        position: '', // 位置（第一广告位，第二广告位）
        type: '', // 类型（商品，案例，设计师）
        link_type: '', // 链接类型（列表，详情）
        // 列表
        style_id: '',
        style_title: '',
        // 详情
        product_id: '',
        product_title: ''
      },
      options: [],
      value: [],
      list: [],
      loading: false
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
    this.styleItems = store.getters.styles
  },
  methods: {
    remoteQuery(query) {
      if (query !== '') {
        this.loading = true
        this.fetchList(query).then(res => {
          this.loading = false
          const data = res.result.data
          var items = []
          for (let i = 0; i < data.length; i++) {
            items.push({ value: data[i]._id, label: data[i].title })
          }
          this.options = items
        })
      } else {
        this.options = []
      }
    },
    /** 获取列表 */
    fetchList(queryString) {
      var func = ''
      var params = '?title=like__' + queryString

      if (this.form.type === 0) {
        func = 'furniture'
      } else if (this.form.type === 1) {
        func = 'case'
      } else if (this.form.type === 2) {
        func = 'designer'
      }

      if (func) {
        return apiList(this.pkg, func, params)
      } else {
        return new Promise(resolve => {
          resolve([])
        })
      }
    },
    async fetchDetail() {
      await apiDetail(this.pkg, this.func, this.aid).then(response => {
        // this.form = Object.assign({}, response.result)
        const result = response.result
        this.form.cover = result.cover
        this.form.sort_order = result.sort_order.toString()
        this.form.position = result.position
        this.form.link_type = result.link_type
        this.form.type = result.type
        // this.form.product_id = result.product_id
        this.form.product_title = result.product_title
        this.form.style_id = result.style_id
        this.form.style_title = result.style_title
        // this.positionSelected = result.position
      })
    },
    /**
     * 提交保存
     */
    handleSave() {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].value === this.form.product_id) {
          this.form.product_title = this.options[i].label
          break
        }
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
        name: 'AdminBannerList',
        params: this.$route.params
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.cover = res.data[0]
    },
    beforeAvatarUpload(file) {
      // const isLt500KB = file.size / 1024 / 1024 < 2
      const isLt500KB = file.size / 1024 <= 500

      if (!isLt500KB) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isLt500KB
    },
    handlePositionChange(item) {
      // this.positionSelected = item
      // if (item === 0) {
      //   this.form.type = ''
      //   this.form.product_id = ''
      //   this.form.product_title = ''
      // } else {
      //   this.form.style_id = ''
      //   this.form.style_title = ''
      // }
    },
    handleTypeChange(item) {
      // this.form.product_id = ''
      // this.options = []
    },
    handleLinkTypeChange(item) {
      if (item === 0) {
        this.form.style_id = ''
        this.form.style_title = ''
      } else if (item === 1) {
        this.form.product_id = ''
        this.form.product_title = ''
      } else {
        this.form.type = ''
        this.form.style_id = ''
        this.form.style_title = ''
        this.form.product_id = ''
        this.form.product_title = ''
      }
    },
    handleStyleChange(item) {
      const style = getStyleById(item)
      this.form.style_title = style.title
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
