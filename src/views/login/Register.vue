<template>
  <div>
    <!--设置dialog的内容是form表单 -->
    <el-dialog :visible.sync="dialogVisible" title="注册" width="600px" center>
      <!--  -->
      <el-form
        :model="registerForm"
        ref="registerFormRef"
        :rules="rules"
        label-width="70px"
        label-position="left"
      >
        <!-- 头像 -->
        <el-form-item label="头像" prop="avatar">
          <!--
            action：上传的地址，它上传跟axios没有关系，它是自己封装的，地址要写全
            data：上传时候需要传递的参数，按照接口文档，它的属性名叫 image
            show-file-list：是否展示列表
            before-upload：上传之前，需要做两件事，第一是格式和大小判断，第二把它里面的参数 file 赋值给
                el-upload属性的data中的image
            on-success：上传成功之后，需要做两件事，第一头像上传的框中的图片要变成预览图片(就是给imageUrl)
                      第二件事情是，把上传得到的服务器地址（"file_path":"uploads/20191024/d79f16177aa4d3bf4d2e2398f41c6d68.PNG"）
                      赋值给 registerForm.avatar
           -->
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :data="uploadObj"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
             
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
        <!-- 图形码 -->
        <el-row>
          <el-col :span="15">
            <el-form-item label="图形码" prop="code">
              <el-input v-model="registerForm.code"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7" style="margin-left:10px">
            <img :src="imgUrl" alt="" @click="getCode" />
          </el-col>
        </el-row>
        <!-- 手机验证码 -->
        <el-row>
          <el-col :span="16">
            <!-- 这里获取手机验证码以后直接把其值输入到input框里面-->
            <el-form-item label="验证码" prop="rcode">
              <el-input v-model="registerForm.rcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left:20px">
            <el-button @click="getRcode">获取手机验证码</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- 确定和取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      dialogVisible: false,
      imageUrl: '',
      uploadUrl: process.env.VUE_APP_BASEURL + 'uploads',
      imgUrl: process.env.VUE_APP_BASEURL + 'captcha?type=sendsms',
      uploadObj: { image: '' },
      // form表单元素
      registerForm: {
        avatar: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        code: '',
        rcode: ''
      },

      rules: {
        avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
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
              // 成功就回调
              callback()
            },
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true, // 加了这个前面就会有红星星
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('手机号不能为空'))
              }

              const reg = /^1[3456789][0-9]{9}$/
              if (!reg.test(value)) {
                return callback(new Error('手机号不合法'))
              }
              // 成功回调
              callback()
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '图形验证码不能为空', trigger: 'blur' }
        ],
        rcode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //上传之前要做的事情:其一是格式判断,另外一个就是把file赋值给el-upload属性的data的image
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error(
          '上传头像图片只能是 JPG 格式!或者是png格式或者是GIF格式'
        )
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      //   把file的值赋值给upload里面的data的img
      this.uploadObj.image = file
      return isJPG && isLt2M
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 200) {
        // 赋值
        this.registerForm.avatar = res.data.file_path

        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    // 点击图形验证码
    getCode () {
      this.imgUrl = `${
        process.env.VUE_APP_BASEURL
      }captcha?type=sendsms&t=${new Date() - 1}`
    },
    // 获取手机验证码
    async getRcode () {
      //    判断手机号和图形码是否存在
      if (
        this.registerForm.phone.trim().length === 0 ||
        this.registerForm.code.trim().length === 0
      ) {
        this.$message({
          message: '手机号或图形码不能为空',
          type: 'warning'
        })
        return
      }
      const res = await this.$http.post('/sendsms', {
        code: this.registerForm.code,
        phone: this.registerForm.phone
      })

      if (res.code === 200) {
        //  给验证码框赋值
        this.registerForm.rcode = res.data.captcha
      } else {
        this.$message.error(res.message)
        // 再次调用图形验证码刷新
        this.getCode()
      }
    },
    onsubmit () {
      // 全局校验
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        // 删除属性
        delete this.registerForm.code
        const res = await this.$http.post('register', this.registerForm)

        if (res.code === 200) {
          this.$message({
            message: '注册成功',
            type: 'success'
          })

          // 关掉当前窗口
          this.dialogVisible = false

          // 清空表单的内容
          this.$refs.registerFormRef.resetFields()
          //图片上传设置为空
          this.imageUrl = ''
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
