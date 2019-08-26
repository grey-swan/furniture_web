<template>
  <section>
    <el-form ref="form" :model="form" size="small" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio label="0">普通</el-radio>
          <el-radio label="1">饰品</el-radio>
        </el-radio-group>
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
      func: 'category',
      aid: 0,
      form: { title: '', type: '0' }
    }
  },
  mounted() {
    this.aid = this.$route.params._id
    if (this.aid !== undefined) {
      this.fetchDetail()
    }
  },
  methods: {
    fetchDetail() {
      apiDetail(this.pkg, this.func, this.aid).then(response => {
        this.form.title = response.result.title
        this.form.type = response.result.type
      })
    },
    handleSave() {
      if (this.aid) {
        apiUpdate(this.pkg, this.func, this.aid, this.form).then(response => {
          this.$message({ message: '更新成功', type: 'success' })
          this.handleBack()
          store.dispatch('product/getCategories')
        })
      } else {
        apiAdd(this.pkg, this.func, this.form).then(response => {
          this.$message({ message: '创建成功', type: 'success' })
          this.handleBack()
          store.dispatch('product/getCategories')
        })
      }
    },
    handleBack() {
      this.$router.push({
        name: 'AdminCategoryList',
        params: this.$route.params
      })
    }
  }
}
</script>
