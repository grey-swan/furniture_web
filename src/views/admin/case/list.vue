<template>
  <section>
    <!--工具条-->
    <el-row class="toolbar">
      <el-col :span="12">
        <el-form
          :inline="true"
          :model="filter"
          size="small"
        >
          <el-form-item>
            <el-input
              v-model="filter.title"
              placeholder="请输入查询内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="fetchSearch"
            >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="success"
              @click="handleAdd"
            >增加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--工具条-->
      <el-col
        :span="12"
        class="toolbar"
      >
        <el-pagination
          small
          :page-size="page_size"
          :total="total"
          :current-page.sync="page"
          layout="prev, pager, next"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      size="mini"
      :data="items"
      highlight-current-row
      style="width: 100%;"
      border
    >
      <el-table-column
        type="index"
        label="ID"
        align="center"
        width="80px"
      />
      <el-table-column
        prop="title"
        label="标题"
        align="center"
      />
      <el-table-column
        prop="building"
        label="楼盘"
        align="center"
      />
      <el-table-column
        prop="area"
        label="面积"
        align="center"
      />
      <el-table-column
        prop="styleTitle"
        label="风格"
        align="center"
      />
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-row class="toolbar" style="margin-top: 10px;">
      <el-col
        :span="24"
        class="toolbar"
      >
        <el-pagination
          :page-size="page_size"
          :total="total"
          :current-page.sync="page"
          layout="prev, pager, next"
          background
          style="float:right;"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { apiList, apiDelete } from '@/api/common'
import { getStyleById } from '@/utils/product'

export default {
  data() {
    return {
      pkg: 'product',
      func: 'case',
      items: [],
      total: 0,
      page_size: 10,
      page: 1,
      listLoading: false,
      filter: {
        title: ''
      }
    }
  },
  created() {
    const page = this.$route.params.page
    const filter = this.$route.params.filter
    if (page !== undefined) {
      this.page = page
    }
    if (filter !== undefined) {
      this.filter = filter
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.fetchList()
    },
    fetchSearch() {
      this.page = 1
      this.fetchList()
    },
    /** 获取列表 */
    fetchList() {
      const params = '?page=' + this.page + '&title=' + this.filter.title
      this.listLoading = true
      apiList(this.pkg, this.func, params).then(response => {
        const result = response.result
        this.items = result.data
        this.total = result.count
        this.page_size = result.per_page
        this.page = result.page
        this.items.forEach(element => {
          element.styleTitle = ''
          element.style_id.forEach(element2 => {
            const style = getStyleById(element2)
            element.styleTitle += style.title + ' | '
          })
        })
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push({
        name: 'AdminCaseEdit',
        params: { page: this.page, filter: this.filter }
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'AdminCaseEdit',
        params: { _id: row._id, page: this.page, filter: this.filter }
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该案例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDelete(this.pkg, this.func, row._id).then(response => {
          this.$message({ message: '删除成功', type: 'success' })
          this.fetchList()
        })
      })
    }
  }
}
</script>
