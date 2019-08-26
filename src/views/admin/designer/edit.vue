<template>
  <section style="padding-top: 10px;">
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="/api/product/img/upload/"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="form.position" />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { apiDetail, apiUpdate, apiAdd } from '@/api/common'
import store from '@/store'

export default {
  data() {
    return {
      pkg: 'product',
      func: 'designer',
      aid: 0,
      form: {
        title: '',
        avatar: '',
        position: '',
        desc: ''
      }
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
  },
  methods: {
    async fetchDetail() {
      await apiDetail(this.pkg, this.func, this.aid).then(response => {
        // this.form = Object.assign({}, response.result)
        const result = response.result
        this.form.title = result.title
        this.form.avatar = result.avatar
        this.form.position = result.position
        this.form.desc = result.desc
      })
    },
    /**
     * 提交保存
     */
    handleSave() {
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
        name: 'AdminDesignerList',
        params: this.$route.params
      })
    },
    handleAvatarSuccess(res, file) {
      this.form.avatar = res.data[0]
    },
    beforeAvatarUpload(file) {
      const isLt500KB = file.size / 1024 <= 500

      if (!isLt500KB) {
        this.$message.error('上传头像图片大小不能超过 500KB!')
      }
      return isLt500KB
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
