<template>
  <div>
    <el-dialog
      :title="mode == 'add' ? '新增企业' : '编辑企业'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" label-width="80px" ref="form" :rules="rules">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="form.eid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="form.short_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="form.intro" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业备注">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:'enterpriseUpdate',
  data () {
    return {
      mode: '',
      dialogVisible: false,
      form: {
        id: '',
        eid: '',
        name: '',
        short_name: '',
        intro: '',
        remark: ''
      },
      rules: {
        eid: [{ required: true, message: '企业编号不能为空', trigger: 'blur' }],
        name: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        short_name: [
          { required: true, message: '企业简称不能为空', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '企业简介不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      // 先全局校检
      this.$refs.form.validate(async valid => {
        if (!valid) return
        let url = ''
        let msg = ''
        if (this.mode === 'add') {
          url = '/enterprise/add'
          msg = '添加成功'
          delete this.form.id
        } else {
          delete this.form.eid
          url = '/enterprise/edit'
          msg = '编辑成功'
        }
        const res = await this.$http.post(url, this.form)
        console.log(res)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: msg
          })

          // 隐藏,刷新数据,清空表单

          this.$refs.form.resetFields()
          this.dialogVisible = false

          this.$parent.search()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  watch: {
    dialogVisible (newValue) {
      if (!newValue) {
        this.$refs.form.clearValidate()
      }
    }
  }
}
</script>
