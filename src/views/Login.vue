<template>
  <div class="login-container">
    <el-form
      :rules="rules"
      :model="user"
      class="login-content"
      shadow="hover"
      ref="userForm"
    >
      <h2>欢迎登录</h2>
      <el-form-item prop="username">
        <el-input
          type="text"
          placeholder="用户名"
          v-model="user.username"
          class="login-input"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="密码"
          v-model="user.password"
          class="login-input"
          prefix-icon="el-icon-lock"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-button @click="login" type="primary" class="login-button"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import request from "../utils/request";
import {loginInfo} from '@/api/login'
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 1, max: 16, message: "用户名长度在6-16之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6-16之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs["userForm"].validate(async (valid) => {
        if (valid) {
          //表单校验合法
          // 假设在这里进行登录验证
          if (this.user.username == "") {
            this.$message.error("用户名不能为空");
          } else if (this.user.password == "") {
            this.$message.error("密码不能为空");
          } else {
            const res = await loginInfo(this.user)
            if (res.code == 200) {
              localStorage.setItem("user", JSON.stringify(res.data)); //将用户信息存入浏览器
              // console.log(res);
                this.$router.push("/home");
                this.$message.success("登录成功");
              } else {
                this.$message.error(res.msg);
              }

          }
        }
      });
    },
  },
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../assets/login/login.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-content {
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  color: #2c3e50;
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-input {
  margin-bottom: 20px;
}

.login-input .el-input__inner {
  height: 45px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding-left: 45px;
  transition: all 0.3s ease;
  font-size: 15px;
}

.login-input .el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.login-input .el-input__prefix {
  left: 15px;
}

.login-input .el-input__icon {
  font-size: 18px;
  color: #909399;
}

.login-button {
  width: 100%;
  height: 45px;
  background: linear-gradient(45deg, #409EFF, #36D1DC);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
  background: linear-gradient(45deg, #36D1DC, #409EFF);
}

.login-button:active {
  transform: translateY(0);
}

.el-form-item.is-error .el-input__inner {
  border-color: #F56C6C;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
}

.el-message {
  min-width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 添加响应式设计 */
@media screen and (max-width: 480px) {
  .login-content {
    width: 90%;
    padding: 30px;
  }
}
</style>