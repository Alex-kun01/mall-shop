<template>
  <div class="goods">
    <!-- 商品列表 -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="card_list">
      <el-row :gutter="20">
        <el-col :span="8">
            <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="pageInfo.query"
            clearable
            @clear="clear"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <template>
        <el-table
            :data="goodsListData.goods"
            style="width: 100%"
            border
            class="table-goods"
            >
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width=""></el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)" width="110"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
            <el-table-column prop="upd_time" label="创建时间" width="180"></el-table-column>
            <el-table-column label="操作" width="150">
                 <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editGoods(scope.row)">
                    <!-- 编辑商品 -->
                    <i class="el-icon-edit"></i>
                </el-button>
                    <el-button type="danger" size="mini" @click="deleteGoods(scope.row.goods_id)">
                    <!-- 删除商品 -->
                    <i class="el-icon-delete"></i>
                </el-button>
                </template>
            </el-table-column>
        </el-table>
      </template>
      <!-- 分页区域 -->
      <div class="pageChange">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="goodsListData.total"
            >
          </el-pagination>
      </div>
    </el-card>
    <!-- 修改商品弹出框 -->
    <el-dialog
        title="修改商品数据"
        :visible.sync="isEditDialog"
        width="50%"
        >
        <!-- 修改表格 -->
        <el-form :model="editFormInfo" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="editFormInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="editFormInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="editFormInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="editFormInfo.goods_number"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
                <el-button @click="isEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="editGoodsClickOk">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 搜索框数据
      inputValue: '',
      // 商品列表数据
      goodsListData: {},
      // 当前页面信息
      pageInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 控制修改商品弹出框显示
      isEditDialog: false,
      // 修改商品数据列表
      editFormInfo: {
        goods_id: '',
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      // 修改商品数据列表规则
      editFormRules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' }
        ]
      }  
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    getGoodsList() {
      this.$http.get('goods', { params: this.pageInfo }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('商品列表数据请求失败')
        this.goodsListData = res.data.data
      })
    },
    // 监听每页显示条数变化
    handleSizeChange(newSize) {
      this.pageInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听当前页码变化
    handleCurrentChange(newPage) {
      this.pageInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 修改商品按钮
    editGoods(res) {
      this.editFormInfo.goods_id = res.goods_id
      this.editFormInfo.goods_name = res.goods_name
      this.editFormInfo.goods_price = res.goods_price
      this.editFormInfo.goods_weight = res.goods_weight
      this.editFormInfo.goods_number = res.goods_number
      this.isEditDialog = true
    },
    // 修改商品弹出框确定按钮
    editGoodsClickOk(id) {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$http.put(`goods/${this.editFormInfo.goods_id}`, {
          goods_name: this.editFormInfo.goods_name,
          goods_price: this.editFormInfo.goods_price,
          goods_weight: this.editFormInfo.goods_weight,
          goods_number: this.editFormInfo.goods_number
        }).then(res => {
        })
      })
    },
    // 搜索
    search() {
      this.getGoodsList()
    },
    clear() {
      this.getGoodsList()
    },
    // 删除商品
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${id}`).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({ message: '删除成功', type: 'success' })
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 添加商品按钮，跳转到添加商品界面
    goAddGoodsPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style scoped>
.card_list {
  margin-top: 20px;
}
.table-goods{
    margin-top: 20px;
    height: 70vh;
    overflow: scroll;
}
.pageChange{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
