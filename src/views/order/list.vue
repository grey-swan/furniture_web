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
              v-model="filter.name"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="filter.types" clearable placeholder="请选择分类">
              <el-option
                v-for="item in typeItems"
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
      ref="multipleTable"
      v-loading="listLoading"
      size="mini"
      :data="items"
      highlight-current-row
      style="width: 100%;"
      border
      @row-click="handleRowClick"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 全屋软装搭配 -->
          <section v-if="scope.row.types === 0">
            <el-form
              v-for="item in scope.row.products"
              :key="item._id"
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="">
                <span>无更多信息</span>
              </el-form-item>
            </el-form>
          </section>
          <!-- 获取报价 -->
          <section v-else-if="scope.row.types === 1">
            <el-form
              v-for="item in scope.row.products"
              :key="item._id"
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="标题：">
                <span>{{ item.title }}</span>
              </el-form-item>
              <el-form-item label="风格：">
                <span>{{ getStyleTitle(item.style_id) }}</span>
              </el-form-item>
              <el-form-item label="价格：">
                <span>{{ item.price }}</span>
              </el-form-item>
              <el-divider />
            </el-form>
          </section>
          <!-- 我想这样搭 -->
          <section v-else-if="scope.row.types === 2">
            <el-form
              v-for="item in scope.row.products"
              :key="item._id"
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="标题：">
                <span>{{ item.title }}</span>
              </el-form-item>
              <el-form-item label="风格：">
                <span>{{ item.styleTitle }}</span>
              </el-form-item>
              <el-form-item label="楼盘：">
                <span>{{ item.building }}</span>
              </el-form-item>
              <el-form-item label="面积：">
                <span>{{ item.area }}</span>
              </el-form-item>
            </el-form>
          </section>
          <!-- 预约设计师 -->
          <section v-if="scope.row.types === 3">
            <el-form
              v-for="item in scope.row.products"
              :key="item._id"
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <!-- <el-form-item label="">
              <img v-if="item.avatar" :src="item.avatar" style="width: 60px; height: 60px; border-radius:10px">
            </el-form-item> -->
              <el-form-item label="设计师：">
                <span>{{ item.title }}</span>
              </el-form-item>
              <el-form-item label="称号：">
                <span>{{ item.position }}</span>
              </el-form-item>
            </el-form>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="ID"
        align="center"
        width="60px"
      />
      <el-table-column
        label="类型"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.types === 0">全屋软装搭配</el-tag>
          <el-tag v-else-if="scope.row.types === 1" type="success">获取报价</el-tag>
          <el-tag v-else-if="scope.row.types === 2" type="danger">我想这样搭</el-tag>
          <el-tag v-else-if="scope.row.types === 3" type="warning">预约设计师</el-tag>
          <el-tag v-else type="info">分类错误</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
      />
      <el-table-column
        prop="phone"
        label="电话"
        align="center"
      />
      <el-table-column
        prop="address"
        label="地址"
        align="center"
      />
      <el-table-column
        prop="style"
        label="风格"
        align="center"
      />
      <el-table-column
        prop="created"
        label="创建时间"
        align="center"
      />
      <!-- <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >标为完成</el-button>
        </template>
      </el-table-column> -->
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
import { apiList } from '@/api/common'
import { getStyleById } from '@/utils/product'

export default {
  data() {
    return {
      pkg: 'product',
      func: 'order',
      items: [],
      typeItems: [
        { _id: 0, 'title': '全屋软装搭配' },
        { _id: 1, 'title': '获取报价' },
        { _id: 2, 'title': '我想这样搭' },
        { _id: 3, 'title': '预约设计师' }
      ],
      total: 0,
      page_size: 10,
      page: 1,
      listLoading: false,
      filter: {
        name: '',
        types: ''
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
    getStyleTitle(style_id) {
      return getStyleById(style_id).title
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchList()
    },
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowExpansion(row)
    },
    fetchSearch() {
      this.page = 1
      this.fetchList()
    },
    fetchList() {
      var params = '?page=' + this.page
      params = params + '&name=like__' + this.filter.name
      params = params + '&types=' + this.filter.types

      this.listLoading = true
      apiList(this.pkg, this.func, params).then(response => {
        const result = response.result
        this.items = result.data
        this.total = result.count
        this.page_size = result.per_page
        this.page = result.page
        this.listLoading = false
      })
    }
  }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
