<template>
  <div class="users">
    <!-- 用户列表 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="user-top" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="reset"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">
                添加用户
            </el-button>
        </el-col>
      </el-row>
      <el-table class="table-box" :data="userList" border  stripe>
           <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label=" 状态" prop="mg_state">
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="userstatusChange(scope.row)"
                    >
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="target">
               <el-button size="mini" type="success" icon="el-icon-edit" @click="motyClick(target.row)"></el-button>
               <el-button size="mini" type="danger" icon="el-icon-delete" @click="modelete(target.row.id)"></el-button>
               <el-tooltip class="item" effect="light" content="分配角色" placement="top-start" :enterable="false">
                   <el-button size="mini" type="warning" icon="el-icon-s-tools" @click="setRoles(target.row)"></el-button>
               </el-tooltip>
            </template>
          </el-table-column>
      </el-table>
          <!-- 分页区域 -->
          <div  class="checkPage">
                  <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryInfo.pagenum"
                  :page-sizes="[1, 2, 5, 10]"
                  :page-size="queryInfo.pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
          </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="close"
      >
      <!-- addForm -->
      <el-form :model="addForm" :rules="addFormReles" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item> 
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item> 
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item> 
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item> 
      </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="okClick">确 定</el-button>
      </span>
  </el-dialog>
    <!-- 修改用户信息 -->
      <el-dialog
      title="添加用户"
      :visible.sync="xiugai"
      width="50%"
      @close="moclose"
      >
      <!-- addForm -->
      <el-form :model="moForm" :rules="addFormReles" ref="moFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户" prop="username">
          <el-input v-model="moForm.username" disabled></el-input>
        </el-form-item>  
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="moForm.email"></el-input>
        </el-form-item> 
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="moForm.mobile"></el-input>
        </el-form-item> 
      </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="xiugai = false">取 消</el-button>
        <el-button type="primary" @click="moClick">确 定</el-button>
      </span>
  </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRolesDiagolVis"
      width="50%"
      >
      <div>
        <p>当前用户：{{ setRolesInfo.username }}</p>
        <p>当前角色：{{ setRolesInfo.role_name }}</p>
        <p>
          分配新角色：
           <template>
          <el-select v-model="selectRolesId" placeholder="请选择">
            <el-option
              v-for="item in setRolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </template>
        </p>
      </div>
      <span slot="footer">
        <el-button @click="setRolesDiagolVis = false">取 消</el-button>
        <el-button type="primary" @click="setRolesOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: '', // 查询关键字
        pagenum: 1,
        pagesize: 5
      },
      dialogVisible: false, // 控制对话框的显示与隐藏
      xiugai: false, // 控制修改对话框
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormReles: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6-12个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '手机号码长度为11位', trigger: 'blur' }
        ]
      },
      moForm: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      setRolesDiagolVis: false,
      setRolesInfo: {},
      setRolesList: [], // 下拉菜单列表
      selectRolesId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败') 
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newSize) { 
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) { 
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    userstatusChange(userInfo) { 
      this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res => {
        if (res.status === 200) { 
          this.$message({ message: '修改成功', type: 'success' })
          return
        }
        this.$message.error('状态修改失败')
      })
    },
    reset() {
      this.getUserList();
    },
    // 点击按钮添加新用户
    okClick() { 
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.$http.post('users', this.addForm).then(res => {
          if (res.data.meta.status === 201) {
            this.$message({ message: '添加成功', type: 'success' })
            this.dialogVisible = false
            this.getUserList()
          }
        }).catch(reg => {
          this.$message.error('服务器出错')
        })
      })
    },
    // 监听添加用户弹出框关闭
    close() { 
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改用户信息弹出框关闭
    moclose() { 
      this.$refs.moFormRef.resetFields()
      this.moForm = {
        username: '',
        id: '',
        email: '',
        mobile: ''
      }
    },
    // 获取修改用户信息数据
    motyClick(target) { 
      this.xiugai = true
      this.moForm.username = target.username
      this.moForm.mobile = target.mobile
      this.moForm.email = target.email
      this.moForm.id = target.id
    },
    // 提交修改用户数据
    moClick() { 
      this.$refs.moFormRef.validate(valid => {
        if (!valid) return
        this.$http.put(`users/${this.moForm.id}`, { email: this.moForm.email, mobile: this.moForm.mobile }).then(res => {
          if (res.data.meta.status === 200) { 
            this.xiugai = false
            this.$message({ message: '修改成功', type: 'success' })
            this.getUserList()
            return
          }
          this.$message.error('修改失败!')
        }).catch(reg => {
          this.$message.error('数据提交出错！')
        })
      })
    },
    // 删除用户
    modelete(id) { 
      this.$confirm('是否确认删除该用户信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(res => {
          if (res.data.meta.status === 200) {
            this.$message({ message: '删除成功！', type: 'success' })
            this.getUserList()
            return
          }
          this.$message.error('删除失败！')
        })
      }).catch(() => {
        this.$message({ message: '已取消删除', type: 'info' })
      })
    },
    // 分配权限按钮
    setRoles(res) {
      this.setRolesInfo = res
      this.$http.get('roles').then(res => {
        if (res.data.meta.status !== 200) return this.$message.error('获取角色列表失败')
      })
      this.setRolesDiagolVis = true
    },
    // 提交分配角色按钮
    setRolesOk() { 
      if (!this.selectRolesId) return this.$message({ message: '您未选择新角色', type: 'info' })
      this.$http.put(`users/${this.setRolesInfo.id}/role/`, { rid: this.selectRolesId }).then(res => {
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.$message({ message: '角色分配成功', type: 'success' })
        this.getUserList()
        this.setRolesDiagolVis = false
      })
    }
  }
}
</script>
<style scoped>
.user-top {
  margin-bottom: 15px;
}
.table-box{
    margin-top: 20px;
    font-size: 12px;
}
.checkPage{
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
