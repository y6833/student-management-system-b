<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-content">
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:9001/sms/file/upload"
            :show-file-list="false"
            :on-success="updataAvatar"
          >
            <div class="avatar-wrapper">
              <el-avatar 
                :size="100"
                :src="userform.avatar || defaultAvatar"
                class="user-avatar"
              ></el-avatar>
              <div class="avatar-overlay">
                <i class="el-icon-camera"></i>
              </div>
            </div>
          </el-upload>
        </div>
        <div class="user-details">
          <h1>{{ personform.name || '未知用户' }}</h1>
          <div class="user-meta">
            <el-tag size="medium">{{ getRoleName }}</el-tag>
            <el-tag 
              :type="activationIn ? 'success' : 'warning'" 
              effect="dark" 
              size="medium"
              class="status-tag"
            >
              {{ activationIn ? '已激活' : '未激活' }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <el-card class="info-card">
        <div slot="header" class="card-header">
          <span>基本信息</span>
          <el-button 
            type="text" 
            icon="el-icon-edit"
            @click="startEdit" 
            v-if="!isEditing"
          >
            编辑资料
          </el-button>
        </div>
        
        <el-form
          ref="personform"
          :model="personform"
          :rules="rules"
          label-width="100px"
          :disabled="!isEditing"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="账号">
                <el-input v-model="personform.id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="personform.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="personform.password"
                  type="password"
                  placeholder="输入新密码"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="confirmPassword"
                  type="password"
                  placeholder="确认新密码"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别">
                <el-radio-group v-model="personform.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生日期">
                <el-date-picker
                  v-model="personform.birthday"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="personform.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="personform.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="地址">
            <el-input v-model="personform.address" placeholder="请输入地址"></el-input>
          </el-form-item>

          <el-form-item v-if="isEditing" class="form-actions">
            <el-button @click="cancelEdit">取消</el-button>
            <el-button type="primary" @click="personsubmit">保存更改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getAdminByRoleId, updataAdmin } from "@/api/admin";
import { getTeacherByRoleId, updatateacher } from "@/api/teacher";
import { updataUser } from "@/api/user";
import moment from "moment";

export default {
  name: "Person",
  computed: {
    getRoleName() {
      switch (this.user.roleName) {
        case 1:
          return '系统管理员';
        case 2:
          return '管理员';
        case 3:
          return '教师';
        default:
          return '未知角色';
      }
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'));
      } else {
        if (this.confirmPassword !== '') {
          this.$refs.personform.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (value !== this.personform.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      defaultAvatar: "http://localhost:9001/sms/file/9df4588dcb844f63b657dd6b95f9379a.jpg",
      isEditing: false,
      confirmPassword: '',
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
      },
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
      activationIn: false,
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
    };
  },
  created() {
    this.getPerson();
  },
  methods: {
    startEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
      this.getPerson();
    },
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
        this.activationIn = this.user.activation == 1;
      }
      this.refreshHeader();
    },
    async personsubmit() {
      try {
        await this.$refs.personform.validate();
        
        if (this.personform.password && this.personform.password !== this.confirmPassword) {
          this.$message.error('两次输入的密码不一致');
          return;
        }

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
            this.isEditing = false;
            this.confirmPassword = '';
          } else {
            this.$message.error("修改失败");
          }
        }
        this.getPerson();
      } catch (error) {
        console.error('表单验证失败:', error);
      }
    },
    async updataAvatar(val) {
      if (val.code == 200) {
        this.userform.avatar = val.data;
        this.user.avatar = val.data;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.$message.success("头像更新成功");
      }
    },
    refreshHeader() {
      this.$emit('refreshHeader');
    }
  },
};
</script>

<style scoped>
.profile-container {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
}

.profile-header {
  background: linear-gradient(135deg, #409EFF 0%, #68DEF8 100%);
  border-radius: 8px;
  padding: 40px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-section {
  position: relative;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.avatar-overlay i {
  font-size: 24px;
  color: white;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-wrapper:hover .user-avatar {
  transform: scale(1.05);
}

.user-details {
  flex: 1;
}

.user-details h1 {
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 600;
}

.user-meta {
  display: flex;
  gap: 12px;
}

.user-meta .el-tag {
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.el-form {
  padding: 24px 0;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-input__inner {
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.el-input__inner:hover {
  border-color: #409EFF;
}

.el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.el-radio-group {
  display: flex;
  gap: 24px;
}

.el-radio__label {
  font-size: 14px;
}

.form-actions {
  margin-top: 32px;
  margin-bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.el-button--primary {
  background: linear-gradient(135deg, #409EFF 0%, #68DEF8 100%);
  border: none;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 添加响应式布局 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .user-meta {
    justify-content: center;
  }

  .el-form {
    padding: 20px;
  }
}
</style>