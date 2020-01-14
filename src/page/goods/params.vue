<template>
  <div class="params">
    <!-- 分类参数 -->
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="card-params">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <p>
        <el-row>
          <el-col>
            选择商品分类：
            <el-cascader
              v-model="paramsValue"
              :options="paramsList"
              :props="props"
              clearable
              @change="paramsSelectChange"
            >
            </el-cascader>
          </el-col>
        </el-row>
      </p>
      <!-- 标签页菜单 -->
      <el-tabs v-model="activeTag" type="card" @tab-click="tagChange">
        <el-tab-pane label="动态参数" name="only">
          <!-- 动态参数区域 -->
          <el-button
            type="primary"
            size="small"
            :disabled="isOk"
            @click="addParams"
            >添加参数</el-button
          >
          <el-table :data="sportTableList" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-tag v-for="(item,index) in scope.row.attr_vals" 
                    :key="index" 
                    closable
                    class="paramsTag"
                    @close="tagClose(scope.row,index)"
                    >{{item}}</el-tag>
                    <!-- 循环渲染input和button -->
                  <el-input
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    class="inputVisible"
                  >
                  </el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editParams(scope.row.attr_id)">
                        <i class="el-icon-edit"></i>
                        修改
                    </el-button>
                    <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">
                        <i class="el-icon-delete"></i>
                        删除
                        </el-button>
                </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="many">
          <!-- 静态属性区域 -->
          <el-button
            type="primary"
            size="small"
            :disabled="isOk"
            @click="addParams"
            >添加属性</el-button
          >
          <el-table :data="stackTableList" style="width: 100%" border>
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-tag v-for="(item,index) in scope.row.attr_vals" 
                    :key="index" 
                    closable
                    class="paramsTag"
                    @close="tagClose(scope.row,index)"
                    >{{item}}</el-tag>
                    <!-- 循环渲染input和button -->
                  <el-input
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    class="inputVisible"
                  >
                  </el-input>
                  <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="editParams(scope.row.attr_id)">
                      <i class="el-icon-edit"></i>
                      修改
                      </el-button>
                  <el-button type="danger" size="mini" @click="deleteParams(scope.row.attr_id)">
                      <i class="el-icon-delete"></i>
                      删除
                      </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数弹出框 -->
    <el-dialog
      :title="'添加' + alertTitle"
      :visible.sync="isAddParams"
      width="50%"
      @close="close"
    >
      <el-form
        :model="addParamsData"
        :rules="addParamsDataRules"
        ref="addParamsDataRef"
        label-width="100px"
      >
        <el-form-item :label="alertTitle" prop="attr_name">
          <el-input v-model="addParamsData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isAddParams = false">取 消</el-button>
        <el-button type="primary" @click="AddParamsClickOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数弹出框 -->
    <el-dialog
      :title="paramsText"
      :visible.sync="isEditParams"
      width="50%"
      @close="editClose"
    >
      <el-form
        :model="editParamsFormInfo"
        :rules="editParamsRules"
        ref="editParamsRef"
        label-width="100px"
      >
        <el-form-item :label="alertTitle" prop="attr_name">
          <el-input v-model="editParamsFormInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="isEditParams = false">取 消</el-button>
        <el-button type="primary" @click="editParamsClickOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取的商品分类数据列表
      paramsList: [],
      // 商品分类选中id数组
      paramsValue: [],
      // 商品分类选择列表
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 被激活的页签名称
      activeTag: 'only',
      // 动态参数表格数据
      sportTableList: [],
      // 静态属性表格数据
      stackTableList: [],
      // 控制添加参数弹出框
      isAddParams: false,
      // 添加参数数据
      addParamsData: {
        attr_name: ''
      },
      // 添加参数校验规则
      addParamsDataRules: {
        attr_name: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ]
      },
      // 修改参数校验规则
      editParamsRules: {
        attr_name: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ]
      },
      // 控制修改参数对话框弹出
      isEditParams: false,
      // 修改参数form信息
      editParamsFormInfo: {
      }
    }
  },
  created() {
    this.getParamsList()
  },
  computed: {
    // 是否禁用按钮
    isOk() {
      if (this.paramsValue.length === 0) return true
      return false
    },
    // 三级分类ID
    cateId() {
      return this.paramsValue.slice(2)[0]
    },
    // 动态生成title
    // eslint-disable-next-line vue/return-in-computed-property
    alertTitle() {
      if (this.activeTag === 'only') return '动态参数'
      return '静态属性'
    },
    paramsText() {
      if (this.activeTag === 'only') return '添加参数'
      return '添加属性'
    }
  },
  methods: {
    // 获取商品分类数据列表
    getParamsList() {
      this.$http.get('categories').then(res => {
        if (res.data.meta.status !== 200) { return this.$message.error('商品分类列表数据获取失败') }
        this.paramsList = res.data.data
      })
    },
    // 监听级联选择器内数据变化
    paramsSelectChange() {
      this.getParamsData()
    },
    // 获取分类数据列表
    getParamsData() {
      // 只能选择三级分类
      if (this.paramsValue.length !== 3) {
        this.paramsValue = []
        this.sportTableList = []
        this.stackTableList = []
        return
      }
      //
      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeTag }
        })
        .then(res => {
          if (res.data.meta.status !== 200) { return this.$message.error('分类数据获取失败') }
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 给每一项绑定
            item.inputVisible = false
            item.inputValue = ''
          })
          if (this.activeTag === 'only') {
            this.sportTableList = res.data.data
          } else if (this.activeTag === 'many') {
            this.stackTableList = res.data.data
          }
        })
    },
    // 页签点击事件处理函数
    tagChange(tag, event) {
      this.getParamsData()
    },
    // 添加参数按钮点击
    addParams() {
      this.isAddParams = true
    },
    // 添加参数弹出框确定按钮点击事件
    AddParamsClickOk() {
      this.$refs.addParamsDataRef.validate(valid => {
        if (!valid) return
        this.$http
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addParamsData.attr_name,
            attr_sel: this.activeTag
          })
          .then(res => {
            if (res.data.meta.status !== 201) { return this.$message.error('添加失败') }
            this.$message({ message: '添加成功', type: 'success' })
            this.getParamsData()
            this.isAddParams = false
          })
      })
    },
    // 监听添加参数弹出框的关闭
    close() {
      this.$refs.addParamsDataRef.resetFields()
    },
    // 监听修改参数弹出框的关闭
    editClose() {
      this.$refs.editParamsRef.resetFields()
    },
    //  修改参数弹框确定按钮点击
    editParamsClickOk() {
      this.$refs.editParamsRef.validate(valid => {
        if (!valid) return 
        this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsFormInfo.attr_id}`, { attr_name: this.editParamsFormInfo.attr_name, attr_sel: this.activeTag }).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('修改失败')
          this.$message({ message: '修改成功', type: 'success' })
          this.getParamsData()
          this.isEditParams = false
        })
      })
    },
    // 修改按钮点击
    editParams(id) {
      // 查询当前信息
      this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeTag } }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('数据请求失败')
        this.editParamsFormInfo = res.data.data
      })
      this.isEditParams = true
    },
    // 删除参数按钮点击
    deleteParams(attrId) {
      this.$confirm('是否确认删除该用户信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`).then(res => {
          if (res.data.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({ message: '删除成功', type: 'success' })
          this.getParamsData()
        })
      }).catch(() => {
        this.$message({ message: '已取消删除', type: 'info' })
      })
    },
    // 标签关闭事件处理函数
    tagClose(res, index) {
    },
    // 循环标签失去焦点事件处理函数
    handleInputConfirm(item) {
      if (item.inputValue.trim().length === 0) {
        item.inputValue = ''
        item.inputVisible = false
        return
      }
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      this.$http.put(`categories/${this.cateId}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: this.activeTag,
        attr_vals: item.attr_vals.join(' ')
      }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('添加失败')
        this.$message({ message: '添加成功', type: 'success' })
        this.getParamsData()
      })
    },
    // 循环按钮切换处理函数
    showInput(item) {
      item.inputVisible = true
      // 让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>
<style scoped>
.card-params {
  margin-top: 20px;
}
.paramsTag{
    margin: 0px 5px;
}
.inputVisible{
  width: 100px;
}
</style>
