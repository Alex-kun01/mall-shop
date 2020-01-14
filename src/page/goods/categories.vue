<template>
    <div class="categories">
        <!-- 商品分类 -->
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="card">
            <el-button type="primary" size="small" @click="addCateClick">添加分类</el-button>
            <!-- 表格区域 -->
            <tree-table :data="goodsList" :columns="columns"
            :selection-type="false"
            :expand-type="false"
            :show-index="true"
            index-text="#"
            border
            >
                <!-- 是否有效模板 -->
                <template slot="isOk"  slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: #008c8c"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序模板 -->
                 <template slot="order" slot-scope="scope">
                     <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                     <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                     <el-tag type="warning" size="mini" v-else>三级</el-tag> 
                 </template>
                 <!-- 操作模板 -->
                 <template slot="opt" slot-scope="scope">
                     <el-button type="primary" size="mini"
                     @click="editOpt(scope.row)"
                     >
                         <i class="el-icon-edit"></i>
                         编辑
                     </el-button>
                     <el-button type="danger" size="mini"
                     @click="deleteOpt(scope.row)"
                     >
                         <i class="el-icon-delete"></i>
                         删除
                     </el-button>
                 </template>
            </tree-table>
                <div class="page_box">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pagenum"
                        :page-sizes="[5, 10, 20, 30]"
                        :page-size="queryInfo.pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        >
                    </el-pagination>
                </div>
        </el-card>
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addcate"
      width="50%"
      destroy-on-close
      @close="addCateFormClose"
      >
      <span slot="footer">
        <!-- 添加分类表单 -->
        <el-form :model="addCateFrom" :rules="addCateRules" ref="addCateRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateFrom.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
              <el-cascader
                v-model="seletedKeyds"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChange"
                clearable
                change-on-select
                >
              </el-cascader>
          </el-form-item>
        </el-form>
        <el-button @click="addcate = false">取 消</el-button>
        <el-button type="primary" @click="addCateClickOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类弹出 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCaate"
      width="50%"
      >
      <p>调整分类：<el-input v-model="editCateInfo.cat_name"></el-input></p>
      <span slot="footer">
        <el-button @click="editCaate = false">取 消</el-button>
        <el-button type="primary" @click="editCaateClickOk">确 定</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      addcate: false, // 控制添加分类对话框弹出
      editCaate: false, // 控制编辑分类对话框弹出
      editCateInfo: { // 编辑分类对话框信息
        cat_name: '',
        cat_id: ''
      },
      goodsList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name' 
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      total: null,
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      // 添加分类表单列表
      addCateFrom: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类表单规则
      addCateRules: {
        cat_name: [
          { required: true, message: '您还未添加分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类数据列表
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      seletedKeyds: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() { // 获取商品分类列表
      this.$http.get('categories', { params: this.queryInfo }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
        this.goodsList = res.data.data.result
        this.total = res.data.data.total
      })
    },
    // 监听每页显示条数的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 编辑按钮点击
    editOpt(res) {
      this.editCateInfo.cat_name = res.cat_name
      this.editCateInfo.cat_id = res.cat_id
      this.editCaate = true
    },
    // 编辑弹出框确定按钮点击
    editCaateClickOk() {
      if (!this.editCateInfo.cat_name) return this.$message.error('商品分类不能为空')
      this.$http.put(`categories/${this.editCateInfo.cat_id}`, { cat_name: this.editCateInfo.cat_name }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('修改失败')
        this.$message({ message: '修改成功', type: 'success' })
        this.getCateList()
        this.editCaate = false
      })
    },
    // 删除按钮点击
    deleteOpt(res) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-use-before-define
        this.$http.delete(`categories/${res.cat_id}`).then(reg => {
          if (reg.data.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({ message: '删除成功', type: 'success' })
          this.getCateList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 添加分类按钮点击
    addCateClick() {
      this.addcate = true
      this.$http.get(`categories`, { params: { type: 2 } }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
        this.parentCateList = res.data.data
      })
    },
    // 选择项发生变化触发这个函数
    parentCateChange() {
      if (this.seletedKeyds.length > 0) {
        // 如果selectdKeys数组中的length大于0 证明选中的父级分类
        // 反之 就说明没有选中父级分类
        this.addCateFrom.cat_pid = this.seletedKeyds[this.seletedKeyds.length - 1]
        // 为当前分类的等级赋值
        this.addCateFrom.cat_level = this.seletedKeyds.length
      } else {
        this.addCateFrom.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateFrom.cat_level = 0
      }
    },
    // 添加分类确定按钮点击
    addCateClickOk() {
      this.$refs.addCateRef.validate(valid => {
        if (!valid) return
        this.$http.post('categories', this.addCateFrom).then(res => {
          if (res.data.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message({ message: '分类添加成功', type: 'success' })
          this.getCateList()
          this.addcate = false
          this.$refs.addCateRef.resetFields()
        })
      })
    },
    // 关闭添加分类对话框触发函数
    addCateFormClose() {
      // 清空填写的数据
      this.$refs.addCateRef.resetFields()
    }
  }
}
</script>
<style scoped>
.card{
    margin-top: 20px;
    margin-bottom: 20px;
}
.page_box{
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
