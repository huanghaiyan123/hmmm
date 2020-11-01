<template>
  <div>
    <!-- 搜索 -->
    <el-form
      inline
      :model="formInline"
      ref="form"
      class="demo-form-inline"
      size="medium"
    >
      <el-form-item label="用户名称" prop="username">
        <el-input
          v-model="formInline.username"
          placeholder="请输入用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input
          v-model="formInline.email"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="formInline.role_id" placeholder="请选择角色">
          <el-option
            v-for="item in roles"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="info" @click="clear">清除</el-button>
        <el-button type="primary" @click="add">+新增用户</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" :index="indexMethod" label="序列">
      </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>
      <el-table-column label="电话" prop="phone"> </el-table-column>
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="角色" prop="role"> </el-table-column>
      <el-table-column label="备注" prop="remark"> </el-table-column>
      <el-table-column label="状态" width="180" prop="status">
        <template slot-scope="scope">
          <span
            :style="{ color: scope.row.status === 0 ? 'red' : '#606266' }"
            >{{ scope.row.status === 0 ? '禁用' : '启用' }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            :type="scope.row.status === 0 ? 'info' : 'success'"
            @click="changeStatus(scope.row.id)"
            >{{ scope.row.status === 0 ? '启用' : '禁用' }}</el-button
          >
          <el-button @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <div class="block" style="text-align:center; margin-top:20px;">
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

    <add-or-update ref="formRef"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './Add-or-update'
export default {
  name:'user',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      formInline: {
        username: '',
        email: '',
        role_id: ''
      },
      roles: [
        { label: '超级管理员', value: 1 },
        { label: '管理员', value: 2 },
        { label: '老师', value: 3 },
        { label: '学生', value: 4 }
      ],
      tableData: [],

      sum: 0,
      page: 1,
      limit: 2
    }
  },
  methods: {
    indexMethod (index) {
      return index
    },
    // 获取数据
    async getListData () {
      const res = await this.$http.get('/user/list', {
        params: {
          username: this.formInline.username,
          email: this.formInline.email,
          role_id: this.formInline.role_id,
          page: this.page,
          limit: this.limit
        }
      })
      console.log(res)
      this.tableData = res.data.items
      this.sum = res.data.pagination.total
    },
    // 编辑
    handleEdit (row) {
      this.$refs.formRef.mode = 'edit'
      this.$refs.formRef.dialogVisible = true
      // 这个需要放在表单出来完成的时候加载
      // this.$nextTick(() => {
      //   this.$refs.formRef.$refs.form.clearValidate()
      // })
      // 把需要的值赋值给表单
      this.$refs.formRef.ruleForm = {...row}
    },
    // 删除
    handleDelete (id) {
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.post('/user/remove', { id })
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
    // 更改状态
    async changeStatus (id) {
      // 点击禁用和启用改变状态
      const res = await this.$http.post('/user/status', { id })

      if (res.code == 200) {
        this.$message({
          type: 'success',
          message: '更改成功'
        })

        this.getListData()
      } else {
        this.$message.error(res.message)
      }
    },

    // 改变每页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.page = 1
      this.getListData()
    },
    // 当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = 1
      this.getListData()
    },
    search () {
      this.page = 1
      this.getListData()
    },
    clear () {
      // 清空表单--调用search
      this.$refs.form.resetFields()
      this.search()
    },
    add () {
      // 清空表单的元素--这里不能使用重置表单
      this.$refs.formRef.ruleForm = {
        // 编辑需要的id
        id: '',
        username: '',
        email: '',
        phone: '',
        role_id: 1,
        status: '',
        remark: ''
      }
      // 修改mode 的值
      this.$refs.formRef.mode = 'add'
      this.$refs.formRef.dialogVisible = true
      // 作用就是要等DOM渲染完成以后再做回调函数里面的执行
      // this.$nextTick(() => {
      //   this.$refs.formRef.$refs.form.clearValidate()
      // })
    }
  },
  mounted () {
    this.getListData()
  }
}
</script>
