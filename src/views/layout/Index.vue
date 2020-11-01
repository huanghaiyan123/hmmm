<template>
  <el-container>
    <!-- 头部 -->
    <el-header class="header">
      <div class="left">
        <i
          class="el-icon-s-fold setheight"
          @click="isCollapse = !isCollapse"
        ></i>
        <img src="@/assets/layout_icon.png" class="marginlr" alt="" />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="imgSrc" alt="" />
        <span>{{ username }}</span>
        <el-button type="primary" size="default" @click="getBack"
          >退出</el-button
        >
      </div>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <el-aside width="auto">
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :default-active="defaultActive"
          router
        >
          <el-menu-item
            :index="item.meta.fullpath"
            v-for="item in $router.options.routes[2].children"
            :key="item.path"
            v-show="item.meta.roles.includes(role)"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>

          <!-- <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <!-- 中心区域 -->
      <el-main class="main">
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from '../../utils/token'

export default {
  name: 'layout',
  data () {
    return {
      isCollapse: false, //折叠,
      defaultActive: '/layout/chart', //默认是高亮的是chart数据
      imgSrc: '',
      username: '',
      role: ''
    }
  },
  mounted () {
    this.defaultActive = this.$route.path

    // 发送请求,获取数据
    this.getInfo()
  },
  watch: {
    $route (newValue) {
      // 当用户使用其他方式来跳转页面时候通过监听route来判断用户是不是具有权限
      if (!newValue.meta.roles.includes(this.role)) {
        this.$message.error('不具有访问权限')
        this.$router.push('/login')
      }
      // 监听路径变化发生高亮
      this.defaultActive = this.$route.path
    }
  },
  methods: {
    async getInfo () {
      const res = await this.$http.get('/info')
      console.log(res)
      this.imgSrc = process.env.VUE_APP_BASEURL + '/' + res.data.avatar
      this.username = res.data.username

      // 思路:这里要获取到用户的role,判断此时的role是包含在在路由元信息的roles里面没,
      // 如果存在就渲染该侧边栏的menu,没有就没有显示

      // 需要做的事情1.赋值roles,使用$route.path拿到当前的路径,这个路径包含了meta,渲染menu,使用role进行判断,存在就显示,不存在就不显示
      this.role = res.data.role

      // 另外我们需要判断当前页面用户是否具有访问权限
      if (!this.$route.meta.roles.includes(this.role)) {
        // 不具有的话就显示提醒,并且跳转登录页
        this.$message.error('用户没有访问权限')

        this.$router.push('/login')
      } else {
        this.$store.commit('setUserInfo', res.data)
      }
    },
    getBack () {
      this.$confirm('确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.get('/logout')
        console.log(res)
        if (res.code == 200) {
          // 删除token
          removeToken()
          // 跳转到登录页
          this.$router.push('/login')
        }
      })
    }
  }
}
</script>

<style lang="less">
.el-container {
  height: 100%;
}
.header {
  height: 60px;
  line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f3f3;
  .left {
    display: flex;
    align-items: center;
    .setheight {
      font-size: 20px;
    }
    .marginlr {
      margin-left: 10px;
      margin-right: 10px;
    }
    .title {
      font-size: 22px;
      color: #49a1ff;
    }
  }
}
.el-menu {
  border: none;
  font-size: 20px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.main {
  background-color: #e8e9ec;
}
.header .right img {
  line-height: 43px;
  width: 43px;
  height: 43px;
  margin-right: 9px;
  border-radius: 50%;
}
.header .right .name {
  margin-right: 38px;
}
</style>
