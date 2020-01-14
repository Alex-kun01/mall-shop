<template>
    <div class="login-container">
       <div class="login_box">
            <div class="avatar_box">
            <img src="../assets/cat1.png">
            </div>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="inp_box">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入账号" class="inp" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" class="inp" prefix-icon="el-icon-goods" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                        <el-button type="primary" @click="login" :plain="true">登陆</el-button>
                        <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
       </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return false
        } else {
          this.$http.post('login', this.loginForm).then(res => {
            if (res.data.meta.status === 200) {
              // 登陆成功
              this.$message({
                message: '登陆成功',
                type: 'success'
              })
              // 1、登陆成功后保存token到客户端的sessionStorage中
              // 2、项目中退出登陆之外的API接口，必须再次登陆后访问
              // 3、token只应在当前网站打开期间生效，所以token保存再sessiondtorage中
              // 4通过变成是导航跳转到主页，路由/home
              window.sessionStorage.setItem('token', res.data.data.token)
              this.$router.push('/home')
            } else {
              // 登陆失败
              this.$message.error(res.data.meta.msg)
            }
          }).catch(reg => {
            this.$message.error('数据请求出错！！！')
          })
        }
      })
    }
  }
}
</script>
<style scoped>
    .login-container{
        background: #008c8c;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);

    }
    .login_box .inp_box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-95%,-40%);
        padding: 10px;
    }
    .login_box .inp_box .inp{
        width: 200%;
    }
      .login_box .inp_box .btns{
        display: flex;
        justify-content: flex-end;
        transform: translate(35%,50%);
    }
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #eee;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
    }
    .avatar_box img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
    }
</style>
