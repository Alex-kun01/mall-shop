<template>
    <div class="roles">
    <!-- 角色列表 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb class="roles-top" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区域 -->
      <el-card>
          <el-button class="btn-add" type="primary" plain size="small" @click="openRoles">添加角色</el-button>
          <el-table :data="rolesList" border stripe>
              <!-- 展开列表 -->
              <el-table-column type="expand"> 
                  <template slot-scope="scope">
                      <el-row v-for="item1 in scope.row.children" :key="item1.id" class="item1">
                          <!-- 渲染一级权限 -->
                          <el-col :span="5">
                              <el-tag 
                              type="primary"
                              plain
                              closable
                              @close="removeByid(scope.row,item1)"
                              >{{ item1.authName }}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 渲染二级和三级权限 -->
                          <el-col :span="19">
                              <el-row v-for="item2 in item1.children" :key="item2.id" class="item2">
                                  <!-- 二级权限 -->
                                  <el-col :span="6">
                                      <el-tag 
                                      type="success"
                                      closable
                                      @close="removeByid(scope.row,item2)"
                                      >{{ item2.authName }}</el-tag>
                                      <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <!-- 三级权限 -->
                                  <el-col :span="18">
                                      <el-tag 
                                      v-for="item3 in item2.children" 
                                      :key="item3.id" 
                                      class="item3" 
                                      type="warning"
                                      closable
                                      @close="removeByid(scope.row,item3)"
                                      >
                                          {{ item3.authName }}
                                      </el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                  </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column  label="角色名称" prop="roleName"></el-table-column>
              <el-table-column  label="角色描述" prop="roleDesc"></el-table-column>
              <el-table-column  label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(scope.row)">删除</el-button>
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRolesClick(scope.row)">分配权限</el-button>
                </template>
              </el-table-column>
          </el-table>
      </el-card>
      <!-- 添加角色弹出框 -->
      <el-dialog
        title="提示"
        :visible.sync="addShow"
        width="50%"
        @close="close"
        >
        <span>这是一段信息</span>
        <span slot="footer">
            <!-- 添加角色Form -->
            <el-form :model="addRolesList" :rules="addRolesRules" ref="addRolesRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="addRolesList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addShow = false">取 消</el-button>
            <el-button type="primary" @click="addShow = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色弹出框 -->
       <el-dialog
        title="提示"
        :visible.sync="editShow"
        width="50%"
        @close="editClose"
        >
        <span>这是一段信息</span>
        <span slot="footer">
            <!-- 添加角色Form -->
            <el-form :model="editRolesList" :rules="editRolesRules" ref="editRolesRef" label-width="100px">
              <el-form-item label="角色ID" prop="id">
                    <el-input v-model="editRolesList.id"></el-input>
                </el-form-item>
                <el-form-item label="角色名称">
                    <el-input v-model="editRolesList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editRolesList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="editShow = false">取 消</el-button>
            <el-button type="primary" @click="editShow = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限弹出框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRolesShow"
        width="50%"
        @close="setRolesClose"
        >
        <span slot="footer">
          <el-tree 
          :data="setRolesList" 
          :props="treeProps" 
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
          ></el-tree>
          <el-button @click="setRolesShow = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      addShow: false, // 添加弹框显示
      editShow: false, // 编辑弹框显示
      closable: false, // 删除弹框显示
      setRolesShow: false, // 分配权限弹框显示
      setRolesList: [], // 分配权限列表
      treeProps: { // 分配权限 树形结构
        label: 'authName',
        children: 'children'
      },
      roleId: '', 
      defKeys: [], // 分配权限默认展开数组
      addRolesList: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: { // 添加角色校验
        roleName: [
          { required: true, message: '角色名称不能为空！', trigger: 'blur' }
        ]
      },
      editRolesList: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      editRolesRules: {
        id: [{ required: true, message: '角色ID不能为空！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色权限信息
    async getRolesList() { 
      const res = await this.$http.get('roles')
      if (res.status === 200) {
        this.rolesList = res.data.data
        return
      }
      this.$message.error('获取数据失败！')
    },
    openRoles() {
      this.addShow = !this.addShow
    },
    close() {
      this.$refs.addRolesRef.validate(valid => {
        this.$refs.addRolesRef.resetFields()
        if (!valid) return
        this.$http.post('roles/', this.addRolesList).then(res => {
          if (res.status === 201) {
            this.addShow = false
            this.$message({ message: '添加成功！', type: 'success' })
            this.getRolesList()
            this.$refs.addRolesRef.resetFields()
          }
        })
      })
    },
    // 编辑按钮弹出弹框
    editClick(res) { 
      this.editShow = true
      this.editRolesList.id = res.id
      this.editRolesList.roleName = res.roleName
      this.editRolesList.roleDesc = res.roleDesc
    },
    // 编辑弹框提交按钮
    editClose() { 
      this.$refs.editRolesRef.validate(valid => {
        if (!valid) return
        this.$http.put(`roles/${this.editRolesList.id}`, {
          roleName: this.editRolesList.roleName,
          roleDesc: this.editRolesList.roleDesc
        }).then(res => {
          if (res.status === 200) {
            this.$message({ message: '修改成功', type: 'success' })
            this.getRolesList()
            this.$refs.editRolesRef.resetFields()
            return
          }
          this.$message.error('修改失败')
          this.$refs.addRolesRef.resetFields()
        })
      })
    },
    // 删除角色信息
    deleteClick(res) { 
      this.$confirm('此操作将永久删除该角色, 是否继续?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${res.id}`).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getRolesList()
            return
          }
          this.$message.error('删除失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 删除权限
    removeByid(role, rights) { 
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${role.id}/rights/${rights.id}`).then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '取消权限成功!'
            });
            role.children = res.data.data
            return
          }
          this.$message.error('权限取消失败')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 分配权限按钮
    async setRolesClick(role) { 
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.setRolesList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRolesShow = true
    },
    // 获取所有权限id
    getLeafKeys(data, arr) { 
      if (!data.children) {
        return arr.push(data.id)
      }
      data.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 清空分配权限默认展开数组
    setRolesClose() { 
      this.defKeys = []
    },
    // 分配弹窗提交按钮点击事件
    async allotRights() { 
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedNodes()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status === 200) {
        this.$message({ message: '授权成功', type: 'success' })
        this.setRolesShow = false
        this.getRolesList()
        return
      }
      this.$message.error('授权失败')
    }
  }
}
</script>
<style scoped>
.roles-top{
    margin-bottom: 20px;
}
.btn-add{
    margin-bottom: 20px;
}
.item1,
.item2{
    border: 1px solid #eee;
    padding: 5px;
    display: flex;
    align-items: center;
}
.item3{
    margin: 5px;
}
</style>
