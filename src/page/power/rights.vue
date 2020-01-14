<template>
    <div class="rights"> 
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="rights-top" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
          <el-table :data="RightsList" border>
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="权限名称" prop="authName"></el-table-column>
              <el-table-column label="路径" prop="path"></el-table-column>
              <el-table-column label="权限等级" prop="level">
                  <template slot-scope="scope">
                     <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
                     <el-tag type="wraning" v-else-if="scope.row.level === '1'">二级</el-tag>
                     <el-tag type="danger" v-else>三级</el-tag>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      type: 'list',
      RightsList: [],
      tabList: [
        { type: '', label: '一级' },
        { type: 'success', label: '二级' },
        { type: 'info', label: '三级' },
        { type: 'danger', label: '四级' },
        { type: 'warning', label: '五级' }
      ]
    }
  },
  methods: {
    getRightsList() { // 获取权限数据列表
      this.$http.get(`rights/${this.type}`).then(res => {
        if (res.status === 200) {
          this.RightsList = res.data.data
          return
        }
        this.$message.error('获取数据出错！')
      }).catch(reg => {
        this.$message.error('数据请求出错！')
      })
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>
<style scoped>
.rights{
  height: 100vh;
}
.el-card__body{
  overflow: scroll;
}
    .rights-top {
        margin-bottom: 20px;
    }
</style>
