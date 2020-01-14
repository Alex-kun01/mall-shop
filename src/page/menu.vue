<template>
    <el-menu
      unique-opened
      :default-active="target"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollse"
      :collapse-transition="false"
      router
    >
    <!-- 一级菜单 -->
      <el-submenu :index="'/' + item.id"
        v-for="(item,index) in menuList"
        :key="item.id"
      >
        <template slot="title">
          <i :class="icoList[index]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <el-menu-item :index="'/' + v.path"
            v-for="v in item.children"
            :key="v.id"
        >
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ v.authName }}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
</template>
<script>
export default {
  data () {
    return {
      icoList: ['el-icon-s-custom', 'el-icon-reading', 'el-icon-shopping-bag-1', 'el-icon-document', 'el-icon-pie-chart']
    }
  },
  computed: {
    target() {
      return window.location.hash.slice(1)
    }
  },
  props: ['menuList', 'isCollse']
}
</script>
<style scoped>
    .el-menu {
        border-right: none;
    }
</style>
