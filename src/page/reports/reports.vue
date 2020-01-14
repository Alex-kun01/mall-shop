<template>
    <div class="reports">
        <!-- 数据报表 -->
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="card-reports">
        <div id="main" style="width: 750px;height: 400px;"></div>
    </el-card>
    </div>
</template> 
<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {

  },
  // 页面上的元素已经被渲染完毕了
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('统计数据获取失败')

    const newOPtions = _.merge(res.data, this.options)
    // // 展示数据
    myChart.setOption(newOPtions)
  }
}
</script>
<style scoped>
.card-reports{
    margin-top: 20px;
}
</style>
