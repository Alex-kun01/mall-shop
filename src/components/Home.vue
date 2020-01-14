<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-box">
        <img src="../assets/cat-y.png">
        <span>后台管理系统</span>
      </div>
      <div id="btn-out">
        <el-button type="info" @click="outClick">退出登陆</el-button>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 --> 
      <el-aside :width="isCollse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <meun-page :menuList='menuList' :isCollse='isCollse'/>
      </el-aside>
      <!-- 右侧内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MeunPage from '../page/menu.vue'
export default {
  data() {
    return {
      menuList: null,
      isCollse: false
    }
  },
  methods: {
    outClick() {
      const key = window.confirm('您现在要退出吗？')
      if (!key) return
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
      } else {
        alert('数据请求出错！')
      }
    },
    toggleCollapse() { // 菜单折叠
      this.isCollse = !this.isCollse
    }
  },
  components: {
    MeunPage
  },
  created() {
    // 获取所有菜单列表
    this.getMenuList()
  }
}
</script>
<style scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-header .header-box img{
    width: 50px;
    height: 50px;
  }
    .el-header .header-box span{
      color: #ffd04b;
      font-size: 20px;
      margin-left: 10px;
    }
    .el-header .header-box{
      display: flex;
      align-items: center;
    }
  .el-aside{
    background-color: #333744;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .toggle-button{
    background-color: #333744;
    text-align: center;
    color: #ffd04b;
    font-size: 14px;
    line-height: 18px;
    padding: 2px 0;
    letter-spacing: 0.2em;
    cursor: pointer;
    transition: background-color 0.2s linear;
  }
  .toggle-button:hover{
    background-color: #4a5064;
    transition: background-color 0.2s linear;
  }
  .el-aside{
    transition: width 0.1s linear;
  }
</style>
