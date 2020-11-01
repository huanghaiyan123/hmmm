<template>
  <div>
    <!-- 搜索部分 -->
    <el-form
      :inline="true"
      :model="formInline"
      ref="ruleForm"
      class="demo-form-inline"
    >
      <el-form-item label="企业编号" prop="eid">
        <el-input
          v-model="formInline.eid"
          placeholder="请输入企业编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input
          v-model="formInline.name"
          placeholder="请输入企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建者" prop="username">
        <el-input v-model="formInline.username" placeholder="创建者"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formInline.status" placeholder="请选择状态">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in statuses"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="info" @click="clear">清除</el-button>
        <el-button type="primary" @click="add">+新增企业</el-button>
      </el-form-item>
    </el-form>

    <!-- 页面列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序列">
      </el-table-column>
      <el-table-column prop="eid" label="企业编号"> </el-table-column>
      <el-table-column prop="name" label="企业名称"> </el-table-column>
      <el-table-column prop="username" label="创建者"> </el-table-column>
      <el-table-column label="创建时间" prop="create_time">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span
            :style="{ color: (scope.row.status === 0 ? 'red' : '#606266') }"
            >{{ scope.row.status === 0 ? '禁用' : '启用' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)">编辑 </el-button>
          <el-button
            @click="changeStatus(scope.row.id)"
            :type="scope.row.status === 0 ? 'success' : 'info'"
            >{{ scope.row.status === 0 ? '启用' : '禁用' }}</el-button
          >
          <el-button @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="text-align:center; margin-top:40px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sum"
      >
      </el-pagination>
    </div>
    <add-or-update ref="formRef" />
  </div>
</template>
<script>
import AddOrUpdate from './Add-or-update'
export default {
  name:'enterprise',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      formInline: {
        name: '',
        eid: '',
        username: '',
        status: ''
      },
      statuses: [
        {
          label: '禁用',
          value: 0
        },
        {
          label: '启用',
          value: 1
        }
      ],
      sum: 0,
      limit: 2,
      page: 1,
      tableData: []
    }
  },
  methods: {
    //   加载列表数据
    async getListData () {
      const res = await this.$http.get('/enterprise/list', {
        params: {
          name: this.formInline.name,
          eid: this.formInline.eid,
          username: this.formInline.username,
          status: this.formInline.status,
          limit: this.limit,
          page: this.page
        }
      })
      this.tableData = res.data.items

      this.sum = res.data.pagination.total
    },
    // 点击搜索
    search () {
      // 当前页面始终为1
      this.page = 1

      this.getListData()
    },
    // 每页时间改变时
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.page = 1
      this.limit = val
      this.getListData()
    },
    // 当前页发送改变时
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getListData()
    },
    // 序列
    indexMethod (index) {
      return index
    },
    // 编辑
    handleEdit (row) {
      console.log(row)
      this.$refs.formRef.mode = 'edit'
      this.$refs.formRef.dialogVisible = true
      this.$refs.formRef.form = { ...row }

      //   编辑的话把值赋值给子组件的model
      // 另外监听dialogVisible的值,点击新增的时候,再次点击编辑,校检新增的规则消失
      // 点击编辑的时候dialogVisible变为true
    },
    // 删除
    handleDelete (id) {
      console.log(id)
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.post('/enterprise/remove', { id })
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })

            this.search()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    add () {
      // 点击编辑再次点击新增的时候,编辑的内容会出现在新增上面,这时候要在点击新增事件的时候清空表单的内容
      // dialogVisible赋值为true
      // 这时候要设置默认值,不然出现清空内容会出现校检规则

      this.$refs.formRef.form = {
        eid: '',
        name: '',
        short_name: '',
        intro: '',
        remark: ''
      }
      this.$refs.formRef.mode = 'add'

      this.$refs.formRef.dialogVisible = true
    },
    clear () {
      // 清空表单输入的内容
      this.$refs.ruleForm.resetFields()
      // 重新调用search
      this.search()
    },

    //改变状态
    async changeStatus (id) {
      const res = await this.$http.post('/enterprise/status', { id })
      if (res.code == 200) {
        this.$message({
          type: 'success',
          message: '状态修改成功'
        })
        this.getListData()
      } else {
        this.$message.error(res.message)
      }
    }
  },
  mounted () {
    this.getListData()
  }
}
</script>
