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
              console.log(res);
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
  background-image: url("../assets/login/login.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

.login-content {
  /* background-color: #fff; */
  width: 520px;
  background-color: rgba(129, 201, 235, 0.7);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  animation: glow 2s infinite ease-in-out alternate;
}

@keyframes glow {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.493);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
}

h2 {
  color: #333;
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.login-input {
  width: 100%;
  /* padding: 10px; */
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  margin-bottom: 10px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: rgba(0, 123, 255, 0.5);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>