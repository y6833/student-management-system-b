<template>
  <div>
    <el-card>
      <div class="el-card__body" style="display: flex">
        <div class="UserImage">
          <el-image
            class="UserImg"
            :src="userform.avatar || defaultAvatar"
            :preview-src-list="[userform.avatar || defaultAvatar]"
            fit="fill"
          ></el-image>
          <el-upload
            action="http://localhost:9001/sms/file/upload"
            :show-file-list="false"
            :on-success="updataAvatar"
            style="display: inline-block"
          >
            <el-button>修改照片</el-button>
          </el-upload>
        </div>
        <div class="UserInformation">
          <el-form
            ref="personform"
            :model="personform"
            label-width="80px"
            class="personform"
          >
            <el-form-item label="职工号">
              <el-input
                v-model="personform.id"
                placeholder="请输入职工号"
                :disabled="true"
              ></el-input>
            </el-form-item>

            <el-form-item label="用户密码">
              <el-input
                v-model="personform.password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>

            <el-form-item label="激活">
              <el-switch v-model="activationIn" disabled></el-switch>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input
                v-model="personform.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="personform.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="出生日期">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="personform.birthday"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
            </el-form-item>

            <el-form-item
              prop="email"
              label="邮箱"
              :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                {
                  type: 'email',
                  message: '请输入正确的邮箱地址',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input
                v-model="personform.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="personform.phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <!-- 地址 -->
            <el-form-item label="地址">
              <el-input
                v-model="personform.address"
                placeholder="请输入地址"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="personsubmit">保存</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAdminByRoleId, updataAdmin } from "@/api/admin";
import { getTeacherByRoleId, updatateacher } from "@/api/teacher";
import { updataUser } from "@/api/user";
import moment from "moment";

export default {
  name: "Person",

  data() {
    return {
      defaultAvatar: "http://localhost:8080/img/user.f5801f9b.jpg",
      personform: {
        id: "",
        name: "",
        password: "",
        gender: "",
        birthday: "",
        phone: "",
        address: "",
        email: "",
        activation: 0,
      },
      userform: {
        username: "",
        password: "",
        activation: 0,
        roleId: "",
        roleName: 0,
        avatar: "",
      },
      activationIn: false, //激活
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    };
  },
  created() {
    //请求分页查询数据
    this.getPerson();
  },
  methods: {
    async getPerson() {
      var res;
      switch (this.user.roleName) {
        case 1:
        case 2:
          res = await getAdminByRoleId(this.user.roleId);
          break;
        case 3:
          res = await getTeacherByRoleId(this.user.roleId);
          break;
      }
      if (res.code == 200) {
        this.personform = res.data;
        this.userform.avatar = this.user.avatar;
        this.activationIn = this.user.activation == 1 ? true : false;
      }
      this.refreshHeader();
    },
    async personsubmit() {
      this.userform.username = this.personform.id;
      this.userform.password = this.personform.password;
      this.userform.activation = 1;
      this.userform.roleId = this.user.roleId;
      this.userform.roleName = this.user.roleName;
      this.personform.birthday = moment(this.personform.birthday).add(1, "day");
      var res;
      switch (this.userform.roleName) {
        case 1:
        case 2:
          res = await updataAdmin(this.personform);
          break;
        case 3:
          res = await updatateacher(this.personform);
          break;
      }

      if (res.code == 200) {
        const res1 = await updataUser(this.userform);
        if (res1.code == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      }
      this.getPerson();
    },
    async updataAvatar(val) {
      if (val.code == 200) {
        this.userform.avatar = val.data;
        this.user.avatar = val.data;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },
    refreshHeader() {
    this.$emit('refreshHeader');
  }
  },
};
</script>

<style scoped>
.UserImage {
  width: 30%;
  height: 530px;
  background-color: #1b1b1b62;
  opacity: 0.8; /* 降低照片的透明度 */
}
.UserInformation {
  margin-left: 5%;
  width: 60%;
  background-color: aqua;
  position: relative;
  padding: 20px;
}
.dialog-footer {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.personform {
  margin-bottom: 50px;
}
.UserImg {
  width: 100%;
  height: 100%;
  margin: 20px;
  opacity: 0.8; /* 降低照片的透明度 */
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
}
</style>