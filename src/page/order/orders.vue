<template>
    <div class="orders">
        <!-- 订单列表 -->
        <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="card-order">
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" v-model="searchValue" class="searchInt">
            <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
        </el-input>
        <!-- 表格区域 -->
        <el-table
        :data="orderListData"
        style="width: 100%"
        border
        class="table-order"
        >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_id" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="130"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100">
           <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
           </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150">
            <!-- 编辑按钮 -->
            <el-button type="primary" size="mini" @click="editClick">
                <i class="el-icon-edit"></i>
            </el-button>
            <!-- 定位按钮 -->
            <el-button type="success" size="mini" @click="progressClick">
                <i class="el-icon-location"></i>
            </el-button>
        </el-table-column>
       </el-table>
       <!-- 分页区域 -->
       <div class="page-order">
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            >
        </el-pagination>
       </div>
    </el-card>
    <!-- 修改地址弹出框 -->
    <el-dialog
        title="修改地址"
        :visible.sync="isEditShow"
        width="50%"
        @close="editClose"
        >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
                <el-input v-model="editForm.address1"></el-input>
            </el-form-item>
            <el-form-item label="地址详情" prop="address2">
                <el-input v-model="editForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isEditShow = false">取 消</el-button>
            <el-button type="primary" @click="isEditShow = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 查看物流地址弹出框 -->
    <el-dialog
        title="查看物流"
        :visible.sync="isShowProgress"
        width="50%"
        >
        <!-- 时间线区域 -->        
        <el-timeline>
            <el-timeline-item
            v-for="(item, index) in proGressData"
            :key="index"
            :timestamp="item.time">
            {{item.context}}
            </el-timeline-item>
        </el-timeline>
        <span slot="footer">
            <el-button @click="isShowProgress = false">取 消</el-button>
            <el-button type="primary" @click="isShowProgress = false">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      searchValue: '',
      // 分页信息
      pageInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单数据列表
      orderListData: [],
      // 记录当前所有数据条数
      total: null,
      // 控制修改地址按钮对话框显示
      isEditShow: false,
      // 修改地址数据项
      editForm: {
        address1: '',
        address2: ''
      },
      // 修改地址数据规则
      editFormRules: {
        address1: [
          { required: true, message: '请输入地区', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 控制查看物流进度弹出框显示
      isShowProgress: false,
      // 物理信息
      proGressData: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$http.get('orders', { params: this.pageInfo }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('订单列表数据获取失败')
        this.orderListData = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 监听每页显示条数变化处理函数
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize;
      this.getOrderList()
    },
    // 监听当前页变化处理函数
    handleCurrentChange(newpage) {
      this.pageInfo.pagenum = newpage;
      this.getOrderList()
    },
    // 搜索按钮点击事件
    searchBtn() {
      this.pageInfo.query = this.searchValue
      this.getOrderList()
    },
    // 修改地址按钮点击事件处理函数
    editClick() {
      this.isEditShow = true
    },
    // 修改弹框关闭事件处理函数
    editClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 查看物流按钮点击事件处理函数
    progressClick() {
      this.isShowProgress = true
      this.$http.get('/kuaidi/1106975712662').then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('物流信息获取失败')
        this.proGressData = res.data.data
      })
    }
  }
}
</script>
<style scoped>
.card-order{
    margin-top: 20px;
}
.searchInt{
    width: 400px;
}
.table-order{
    margin-top: 20px;
}
.page-order{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
