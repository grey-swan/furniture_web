<template>
  <section style="padding-top: 10px;">
    <el-form ref="form" :model="form" size="small" label-width="80px">
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
export default {
  components: {
    TinyMCE
  },
  data() {
    return {
      pkg: 'product',
      func: 'company',
      aid: 0,
      reload: false,
      form: {
        content: ''
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
        this.form.content = result.content
        this.reload = !this.reload
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
        name: 'AdminCompanyDetail'
      })
    }
  }
}
</script>
