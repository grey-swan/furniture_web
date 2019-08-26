<template>
  <section>
    <!--工具条-->
    <el-row class="toolbar">
      <el-col :span="12">
        <el-button
          size="small"
          type="success"
          @click="handleAdd"
        >增加</el-button>
      </el-col>
      <!--工具条-->
      <el-col
        :span="12"
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

    <!--列表-->
    <el-table
      v-loading="listLoading"
      size="mini"
      :data="items"
      highlight-current-row
      style="width: 100%; margin-top: 30px;"
      border
    >
      <el-table-column
        type="index"
        label="ID"
        align="center"
        width="80px"
      />
      <el-table-column
        label="封面图"
        align="center"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.cover" :src="scope.row.cover" style="width: 80px; height: 80px; border-radius:5px">
        </template>
      </el-table-column>
      <el-table-column
        prop="product_title"
        label="标题"
        align="center"
      />
      <el-table-column
        label="位置"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.position == 0">第一广告位</el-tag>
          <el-tag v-else type="danger">第二广告位</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="类别/风格"
        align="center"
      >
        <template slot-scope="scope">
          <section v-if="scope.row.position == 0">
            <el-tag v-if="scope.row.type == 0">家具</el-tag>
            <el-tag v-else-if="scope.row.type == 1">案例</el-tag>
            <el-tag v-else>设计师</el-tag>
          </section>
          <section v-else>
            <el-tag type="danger">{{ scope.row.style_title }}</el-tag>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort_order"
        label="排序"
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
  </section>
</template>

<script>
import { apiList, apiDelete } from '@/api/common'

export default {
  data() {
    return {
      pkg: 'product',
      func: 'banner',
      items: [],
      total: 0,
      page_size: 10,
      page: 1,
      listLoading: false
    }
  },
  created() {
    const page = this.$route.params.page
    if (page !== undefined) {
      this.page = page
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
      const params = '?sort_order=order__asc&page=' + this.page
      this.listLoading = true
      apiList(this.pkg, this.func, params).then(response => {
        const result = response.result
        this.items = result.data
        this.total = result.count
        this.page_size = result.per_page
        this.page = result.page
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push({
        name: 'AdminBannerEdit',
        params: { page: this.page }
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'AdminBannerEdit',
        params: { _id: row._id, page: this.page }
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该轮播, 是否继续?', '提示', {
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
