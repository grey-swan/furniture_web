<template>
  <section>
    <!--工具条-->
    <el-row class="toolbar">
      <el-col :span="16">
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
            <el-select v-model="filter.category_id" clearable placeholder="请选择分类">
              <el-option
                v-for="item in categoryItems"
                :key="item._id"
                :label="item.title"
                :value="item._id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filter.style_id" clearable placeholder="请选择风格">
              <el-option
                v-for="item in styleItems"
                :key="item._id"
                :label="item.title"
                :value="item._id"
              />
            </el-select>
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
        :span="8"
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
      style="width: 100%;"
      border
    >
      <el-table-column
        type="index"
        label="ID"
        align="center"
        width="60px"
      />
      <el-table-column
        label="封面图"
        align="center"
        width="110px"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.img.length > 0" :src="scope.row.img[0]" style="width: 80px; height: 80px; border-radius:5px">
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        align="center"
      />
      <el-table-column
        prop="styleTitle"
        label="风格"
        align="center"
      />
      <el-table-column
        prop="categoryTitle"
        label="分类"
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
import { getStyleById, getCategoryById } from '@/utils/product'
import store from '@/store'

export default {
  data() {
    return {
      pkg: 'product',
      func: 'furniture',
      items: [],
      categoryItems: [],
      styleItems: [],
      total: 0,
      page_size: 10,
      page: 1,
      listLoading: false,
      filter: {
        title: '',
        category_id: '',
        style_id: ''
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
    this.categoryItems = store.getters.categories
    this.styleItems = store.getters.styles
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
    fetchList() {
      var params = '?page=' + this.page
      params = params + '&title=like__' + this.filter.title
      params = params + '&category_id=' + this.filter.category_id
      params = params + '&style_id=' + this.filter.style_id

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
        this.items.forEach(element => {
          const category = getCategoryById(element.category_id)
          element.categoryTitle = category.title
        })
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push({
        name: 'AdminFurnitureEdit',
        params: { page: this.page, filter: this.filter }
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'AdminFurnitureEdit',
        params: { _id: row._id, page: this.page, filter: this.filter }
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
