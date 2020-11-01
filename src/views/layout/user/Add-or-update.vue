<template>
  <div>
    <el-dialog
      :title="mode === 'add' ? '新增用户' : '编辑用户'"
      :visible.sync="dialogVisible"
      width="600px"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="form"
        :inline="false"
        size="normal"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="ruleForm.role_id" placeholder="请选择角色">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in roles"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择状态">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in statuses"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'userUpdate',
  data () {
    return {
      dialogVisible: false,
      ruleForm: {
        // 编辑需要的id
        id: '',
        username: '',
        email: '',
        phone: '',
        role_id: 1, //设置默认值,避免点击新增的时候出现校检规则提示
        status: '',
        remark: ''
      },
      mode: '', //判断是新增还是编辑
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('邮箱不能为空'))
              }
              /* eslint-disable */
              const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
              /* eslint-enable */
              if (!reg.test(value)) {
                return callback(new Error('邮箱不合法'))
              }

              callback()
            },
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('手机号不能为空'))
              }

              const reg = /^1[3456789][0-9]{9}$/
              if (!reg.test(value)) {
                return callback(new Error('手机号不合法'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        role_id: [
          { required: true, message: '角色不能为空', trigger: 'change' }
        ]
      },

      roles: [
        { label: '超级管理员', value: 1 },
        { label: '管理员', value: 2 },
        { label: '老师', value: 3 },
        { label: '学生', value: 4 }
      ],
      // 状态数组
      statuses: [
        {
          label: '禁用',
          value: 0
        },
        {
          label: '启用',
          value: 1
        }
      ]
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        let url = ''
        let msg = ''

        if (this.mode === 'add') {
          delete this.ruleForm.id
          url = '/user/add'
          msg = '新增成功'
        } else {
          url = '/user/edit'
          msg = '编辑成功'
        }
        const res = await this.$http.post(url, this.ruleForm)

        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: msg
          })

          // 关闭当前窗口
          this.dialogVisible = false

          // 清空表单
          this.$refs.form.resetFields()

          // 调用父组件的方法
          this.$parent.search()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  // 另外一种方法监听dialogVisible,消失的时候就清除校检
  watch: {
    dialogVisible (newValue) {
      if (!newValue) {
        this.$refs.form.clearValidate()
      }
    }
  }
}
</script>
