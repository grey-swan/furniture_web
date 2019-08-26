<template>
  <section>
    <!--工具条-->
    <el-row class="toolbar">
      <el-col :span="12">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button
              type="success"
              @click="handleEdit"
            >编辑</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--详情-->
    <el-row>
      <el-col :span="12" :offset="6">
        <div style="width: 100%;" v-html="softItem.content" />
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { apiList } from '@/api/common'
export default {
  data() {
    return {
      pkg: 'product',
      func: 'soft',
      softItem: {}
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    /** 获取列表 */
    fetchList() {
      apiList(this.pkg, this.func).then(response => {
        const data = response.result.data
        if (data.length > 0) {
          this.softItem = data[0]
        } else {
          this.$message({
            message: '未获取到数据，请先添加',
            type: 'error'
          })
          this.handleEdit()
        }
      })
    },
    handleEdit() {
      const that = this
      this.$router.push({
        name: 'AdminSoftEdit',
        params: { _id: that.softItem._id }
      })
    }
  }
}
</script>
