<template>
  <div class="login-container">
    <!-- 登录页面 -->
    <div class="left">
      <!-- 登录 -->
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt="" />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录 </span>
      </div>
      <!-- Form 表单提供了表单验证的功能，只要通过rules属性传入约定的验证规则，通过props属性设置为需要校检的字段名即可 -->
      <!-- el-form是整个表单，el-form-item是对应的每一个部分 ，el-input是对应的输入框-->
      <!-- 通过label来定义 标签的文本-->
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="rulesForm"
        class="login-form"
      >
        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item>
          <el-col :span="14">
            <el-form-item prop="code">
              <el-input
                v-model="loginForm.code"
                placeholder="验证码"
                prefix-icon="el-icon-key"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8" style="margin-left:30px">
            <el-form-item>
              <img
                :src="captchaUrl"
                alt=""
                class="captcha"
                @click="changeCaptchaUrl"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 勾选状态 -->
        <el-form-item prop="isChecked">
          <el-checkbox v-model="isCheckBox"></el-checkbox>我已同意并且阅读
          <el-link
            type="primary"
            href="http://itheima.com"
            target="_blank"
            :underline="false"
            >用户协议</el-link
          >和
          <el-link
            type="primary"
            href="http://itheima.com"
            target="_blank"
            :underline="false"
            >隐私条款</el-link
          >
        </el-form-item>
        <!-- 登录 -->
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="login"
            >登录</el-button
          >
        </el-form-item>
        <!-- 注册 -->
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="register"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt="" />
    </div>
    <register ref="registerRef" />
  </div>
</template>

<script>
import { saveToken } from '../../utils/token'
import Register from './Register'
export default {
  name:'Login',
  components: {
    Register
  },
  data () {
    return {
      loginForm: {
        phone: '18511111111',
        password: '12345678',
        code: ''
      },
      isCheckBox: 'false', //默认不勾选
      captchaUrl: process.env.VUE_APP_BASEURL + 'captcha?type=login',

      rules: {
        phone: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                //为空
                return callback(new Error('手机号不能为空'))
              }

              const reg = /^1[3456789][0-9]{9}$/
              if (!reg.test(value)) {
                //检测是否存在
                return callback(new Error('手机号不合法'))
              }

              // 成功就回调一下
              callback()
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!this.isCheckBox) {
                // return 阻止代码继续往下执行
                return callback(new Error('请勾选是否同意的协议'))
              }
              // 成功回调一下
              callback()
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    changeCaptchaUrl () {
      // 发送验证码的图片随机生成--利用时间轴
      this.captchaUrl = `${
        process.env.VUE_APP_BASEURL
      }captcha?type=login&t=${new Date() - 1}`
    },
    login () {
      // 再次重新校验一次
      this.$refs.rulesForm.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post('/login', this.loginForm)

        console.log(res)
        if (res.code == 200) {
          saveToken(res.data.token)
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 跳转
          this.$router.push('/layout')
        } else {
          this.$message.error(res.message)
          this.changeCaptchaUrl()
        }
      })
    },
    register () {
      this.$refs.registerRef.dialogVisible = true
    }
  }
}
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 20px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>
