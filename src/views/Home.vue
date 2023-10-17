<template>
  <el-container style="height: 100vh">
    <el-aside
      :width="sideWidth + 'px'"
      style="
        background-color: rgb(238, 241, 246);
        box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
      "
    >
      <el-menu
        :default-openeds="['1', '3']"
        style="min-height: 100%; overflow-x: hidden"
        background-color="rgb(48, 65, 86)"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse-transition="false"
        :collapse="isCollapse"
        class="el-menu-vertical-demo"
      >
        <div style="height: 60px; line-height: 60px; text-align: center">
          <img
            src="@/assets/logo.png"
            style="width: 20px; position: relative; top: 5px"
          />
          <b style="color: #fff; margin-left: 5px" v-show="logoTextShow"
            >视教学习管理系统</b
          >
        </div>
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-user-solid"></i>
            <span slot="title">人员管理导航</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">学生管理</el-menu-item>
            <el-menu-item index="1-2">教师管理</el-menu-item>
            <el-menu-item index="1-3">管理员管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"
            ><i class="el-icon-menu"></i
            ><span slot="title">功能管理导航</span></template
          >
          <el-menu-item-group>
            <template slot="title">教师管理区</template>
            <el-menu-item index="2-1">学生成绩管理</el-menu-item>
            <el-menu-item index="2-2">各科题型管理</el-menu-item>
            <el-menu-item index="2-3">学生各科题型成绩管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="管理员管理">
            <el-menu-item index="2-4">专业管理</el-menu-item>
            <el-menu-item index="2-5">课程管理</el-menu-item>
            <el-menu-item index="2-6">班级管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"
            ><i class="el-icon-setting"></i>
            <span slot="title">权限管理导航</span></template
          >
          <el-menu-item-group>
            <el-menu-item index="3-1">用户权限管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        style="
          background-color: #fff;
          font-size: 12px;
          border-bottom: 1px solid #ccc;
          line-height: 60px;
          display: flex;
        "
      >
        <div style="flex: 1; font-size: 20px">
          <span
            :class="collapseBtnClass"
            style="cursor: pointer"
            @click="collapse"
          ></span>
        </div>
        <el-dropdown style="width: 70px; cursor: pointer">
          <span>王小虎</span
          ><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
        <!-- 页签 -->
        <div style="margin-bottom: 15px">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <!-- 搜索 start-->
        <div style="margin-bottom: 5px">
          <el-checkbox-group
            v-model="checkedsearchs"
            @change="handlecheckedsearchsChange"
            :max="3"
            :min="1"
          >
            <el-checkbox
              v-for="search in searchs"
              :label="search"
              :key="search"
              >{{ search }}</el-checkbox
            >
          </el-checkbox-group>
        </div>

        <div style="margin: 10px 0; position: relative">
          <div style="display: flex">
            <div
              v-for="(check, index) in checkedsearchs"
              :key="index"
              style="width: 200px; margin-right: 5px"
            >
              <div v-if="check === searchs[2]" style="padding: 8px 10px">
                <el-radio v-model="searchContent[index]" label="男"
                  >男</el-radio
                >
                <el-radio v-model="searchContent[index]" label="女"
                  >女</el-radio
                >
              </div>

              <div class="block" v-else-if="check === searchs[3]">
                <el-date-picker
                  v-model="searchContent[index]"
                  type="date"
                  placeholder="请选择出生日期"
                >
                </el-date-picker>
              </div>
              <div v-else-if="check === searchs[4]">
                <el-select
                  v-model="searchContent[index]"
                  placeholder="请选择年级"
                >
                  <el-option
                    v-for="(item, index) in grades"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
              <div v-else-if="check === searchs[5]">
                <el-select
                  v-model="searchContent[index]"
                  placeholder="请选择班级"
                >
                  <el-option
                    v-for="(item, index) in classIds"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
              <div v-else-if="check === searchs[6]">
                <el-select
                  v-model="searchContent[index]"
                  placeholder="请选择专业"
                >
                  <el-option
                    v-for="(item, index) in majors"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </div>
              <el-input
                v-else
                v-model="searchContent[index]"
                :placeholder="check"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>

            <el-button
              type="primary"
              style="margin-left: 5px"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button type="warning" @click="reset">重置</el-button>
          </div>

          <!-- 新增 -->
          <div style="position: absolute; right: 0px; top: 0px">
            <el-button type="primary" @click="addStudentFunc"
              >新增 <i class="el-icon-circle-plus-outline"></i
            ></el-button>
            <el-button type="danger"
              >批量删除 <i class="el-icon-remove-outline"></i
            ></el-button>
            <el-button type="primary"
              >导入 <i class="el-icon-upload"></i
            ></el-button>
            <el-button type="primary"
              >导出 <i class="el-icon-download"></i
            ></el-button>
          </div>
        </div>
        <!-- 搜索end -->

        <!-- 学生管理 -->
        <el-table :data="tableData" border stripe>
          <el-table-column prop="id" label="学号" width="140"></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="100"
          ></el-table-column>
          <el-table-column prop="gender" label="性别" width="60">
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期" width="120">
          </el-table-column>
          <el-table-column prop="grade" label="年级" width="80">
          </el-table-column>
          <el-table-column prop="classId" label="班级" width="120">
          </el-table-column>
          <el-table-column prop="major" label="专业" width="160">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="200">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="140">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="200">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="updatastudentfunc(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div style="padding: 10px 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>

        <!-- 新增表单 -->

        <el-dialog title="新增学生" :visible.sync="addStudent">
          <el-form ref="stuform" :model="stuform" label-width="80px">
            <el-form-item label="学生学号">
              <el-input
                v-model="stuform.id"
                placeholder="请输入学号"
              ></el-input>
            </el-form-item>

            <el-form-item label="用户密码">
              <el-input
                v-model="stuform.password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>

            <el-form-item label="激活">
              <el-switch
                v-model="activationIn"
              ></el-switch>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input
                v-model="stuform.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="stuform.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="出生日期">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="stuform.birthday"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
            </el-form-item>

            <el-form-item label="年级">
              <el-select
                v-model="stuform.grade"
                placeholder="请选择年级"
                @change="choiceGradeFunc"
              >
                <el-option
                  v-for="(item, index) in grades"
                  :key="index"
                  :label="item"
                  :value="item"
                  :default-value="stuform.grade"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="专业">
              <el-select v-model="stuform.major" placeholder="请选择专业">
                <el-option
                  v-for="(item, index) in majors"
                  :key="index"
                  :label="item"
                  :value="item"
                  :default-value="stuform.major"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="班级">
              <el-select
                v-model="stuform.classId"
                placeholder="请选择班级"
                @change="choiceClassFunc"
              >
                <el-option
                  v-for="(item, index) in classIds"
                  :key="index"
                  :label="item"
                  :value="item"
                  :default-value="stuform.classId"
                ></el-option>
              </el-select>
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
                v-model="stuform.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="stuform.phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>

            <!-- 地址 -->
            <el-form-item label="地址">
              <el-input
                v-model="stuform.address"
                placeholder="请输入地址"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addStudentsubmitoff">取 消</el-button>
            <el-button type="primary" @click="addStudentsubmit"
              >确 定</el-button
            >
          </div>
        </el-dialog>

        <!-- 修改学生信息 -->
        <el-dialog title="修改学生信息" :visible.sync="updataStudent">
          <el-form ref="stuform" :model="stuform" label-width="80px">
            <el-form-item label="学生学号">
              <el-input
                v-model="stuform.id"
                placeholder="请输入学号"
              ></el-input>
            </el-form-item>

            <el-form-item label="用户密码">
              <el-input
                v-model="stuform.password"
                placeholder="请输入密码"
                type="password"
                v-model.lazy="stuform.password"
              ></el-input>
            </el-form-item>

            <el-form-item label="激活">
              <el-switch
                v-model="activationIn"
              ></el-switch>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input
                v-model="stuform.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-radio-group v-model="stuform.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="出生日期">
              <el-col :span="11">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="stuform.birthday"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
            </el-form-item>

            <el-form-item label="年级">
              <el-select
                v-model="stuform.grade"
                placeholder="请选择年级"
                @change="choiceGradeFunc"
              >
                <el-option
                  v-for="(item, index) in grades"
                  :key="index"
                  :label="item"
                  :value="item"
                  :default-value="stuform.grade"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="专业">
              <el-select v-model="stuform.major" placeholder="请选择专业">
                <el-option
                  v-for="(item, index) in majors"
                  :key="index"
                  :label="item"
                  :value="item"
                  :default-value="stuform.major"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="班级">
              <el-select
                v-model="stuform.classId"
                placeholder="请选择班级"
                @change="choiceClassFunc"
              >
                <el-option
                  v-for="(item, index) in classIds"
                  :key="index"
                  :label="item"
                  :value="item"
                  :default-value="stuform.classId"
                ></el-option>
              </el-select>
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
                v-model="stuform.email"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="stuform.phone"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>

            <!-- 地址 -->
            <el-form-item label="地址">
              <el-input
                v-model="stuform.address"
                placeholder="请输入地址"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updatastudentsubmitoff">取 消</el-button>
            <el-button type="primary" @click="updatastudentsubmit"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
<script>
import request from "../utils/request";
export default {
  data() {
    const searchOptions = [
      "学号",
      "姓名",
      "性别",
      "出生日期",
      "年级",
      "班级",
      "专业",
      "邮箱",
      "手机号",
      "地址",
    ];
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      collapseBtnClass: "el-icon-s-fold",
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      checkedsearchs: ["学号"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      searchString: "",
      addStudent: false, //新增学生弹框
      updataStudent: false, //修改学生弹窗
      activationIn: false, //激活
      stuform: {
        id: "",
        password: "",
        activation: 0,
        name: "",
        gender: "",
        birthday: "",
        grade: "",
        classId: "",
        major: "",
        email: "",
        phone: "",
        address: "",
      },
      userform: {
        username: "",
        password: "",
        activation: 0,
        roleId: "",
        roleName: 0,
      },
      grades: [],
      classIds: [],
      majors: [],
    };
  },
  created() {
    //请求分页查询数据
    this.load();
    //请求班级、年级、专业等数据
    this.getsomeList();
  },
  methods: {
    /**
    + * 切换组件的收缩状态。
    + */
    collapse() {
      //点击收缩
      // 切换收缩状态
      this.isCollapse = !this.isCollapse;

      if (this.isCollapse) {
        // 如果收缩，将侧边栏宽度设置为 64
        this.sideWidth = 64;
        // 更新收缩按钮的样式类
        this.collapseBtnClass = "el-icon-s-unfold";
        this.logoTextShow = false;
      } else {
        // 如果未收缩，将侧边栏宽度设置为 200
        this.sideWidth = 200;
        // 更新收缩按钮的样式类
        this.collapseBtnClass = "el-icon-s-fold";
        this.sidewidth = 200;
        this.logoTextShow = true;
      }
    },
    load() {
      //请求分页查询数据
      request
        .get("http://localhost:9001/sms/admin/student/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchString: this.searchString,
          },
        })
        .then((res) => {
          this.tableData = res.records;
          this.total = res.total;
        });

      // fetch(
      //   "http://localhost:9001/sms/admin/student/page?pageNum=" +
      //     this.pageNum +
      //     "&pageSize=" +
      //     this.pageSize
      //     +"&searchString="
      //     +encodeURIComponent(this.searchString)

      // )
      //   .then((res) => res.json())
      //   .then((res) => {
      //     this.tableData = res.records;
      //     this.total = res.total;
      //   });
    },
    getsomeList() {
      request
        .get("http://localhost:9001/sms/admin/classs/getClassList", {})
        .then((res) => {
          this.classIds = res;
        });
      request
        .get("http://localhost:9001/sms/admin/classs/getGradeList", {})
        .then((res) => {
          this.grades = res;
        });
      request
        .get("http://localhost:9001/sms/admin/major/getMajorList", {})
        .then((res) => {
          this.majors = res;
        });
    },
    reset() {
      this.handlecheckedsearchsChange();
      this.handleSearch();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },

    selectCondition(condition) {
      this.searchCondition = condition;
    },

    handlecheckedsearchsChange() {
      this.searchContent = [];
    },

    //选择年级
    choiceGradeFunc() {
      request
        .get("http://localhost:9001/sms/admin/classs/getClassListBygradeId", {
          params: {
            gradeId: this.stuform.grade,
          },
        })
        .then((res) => {
          this.classIds = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //选择班级
    choiceClassFunc() {
      //获得专业
      request
        .get("http://localhost:9001/sms/admin/classs/getMajorByclassId", {
          params: {
            classId: this.stuform.classId,
          },
        })
        .then((res) => {
          this.majors = res;
        })
        .catch((err) => {
          console.log(err);
        });
      //获得班级
      request
        .get("http://localhost:9001/sms/admin/classs/getGradeByclassId", {
          params: {
            classId: this.stuform.classId,
          },
        })
        .then((res) => {
          this.grades = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //选择专业
    addStudentFunc() {
      this.stuform = {};
      //调用接口获得年级、班级、专业列表
      this.getsomeList();

      this.addStudent = true;
    },
    addStudentsubmitoff() {
      this.stuform = {};
      this.userform = {};
      this.addStudent = false;
      this.load();
    },
    addStudentsubmit() {
      //调用接口提交表单数据
      this.stuform.activation = this.activationIn == true ? 1 : 0;

      this.userform.username = this.stuform.id;
      this.userform.password = this.stuform.password;
      this.userform.activation = this.stuform.activation;
      this.userform.roleId = this.stuform.id;
      this.userform.roleName = 4;

      //添加学生
      request
        .post("http://localhost:9001/sms/admin/student", this.stuform)
        .then((res) => {
          //添加用户
          if (res) {
            request
              .post(
                "http://localhost:9001/sms/admin/user/addUser",
                this.userform
              )
              .then((res) => {});
            this.$message.success("添加成功");
          } else {
            this.$message.error("添加失败");
          }
          this.stuform = {};
          this.userform = {};
          this.addStudent = false;
          this.load();
        })
        .catch((err) => {
          this.$message.error("添加失败", err);
        });
    },
    updatastudentfunc(row) {
      //获取用户信息
      request
        .get("http://localhost:9001/sms/admin/user/getUser", {
          params: {
            id: row.id,
          },
        })
        .then((res) => {
          this.stuform = row;
          this.stuform.id = res.username;
          this.stuform.password = res.password;
          this.stuform.activation = res.activation
          this.activationIn = this.stuform.activation == 1 ? true : false;
          this.stuform.id = res.roleId;
          this.userform.roleName = res.roleName;
        })
        .catch((err) => {
          console.log(err);
        });

      this.updataStudent = true;
    },
    updatastudentsubmitoff() {
      this.stuform = {};
      this.userform = {};
      this.updataStudent = false;
      this.load();
    },
    updatastudentsubmit() {
      this.stuform.activation = this.activationIn == true? 1 : 0;
      this.userform.username = this.stuform.id;
      this.userform.password = this.stuform.password;
      this.userform.activation = this.stuform.activation;
      this.userform.roleId = this.stuform.id;
      this.userform.roleName = 4;
      request
        .post("http://localhost:9001/sms/admin/student/updata", this.stuform)
        .then((res) => {
          if (res) {
            request
              .post(
                "http://localhost:9001/sms/admin/user/updataUser",
                this.userform
              )
              .then((res) => {});
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
          this.updatastudentsubmitoff();
        })
        .catch((err) => {
          this.$message.error("修改失败", err);
        });
      this.updataStudent = false;
    },
    handleSearch() {
      this.searchString = "";
      for (let index = 0; index < this.checkedsearchs.length; index++) {
        switch (this.checkedsearchs[index]) {
          case this.searchs[0]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&id=" + this.searchContent[index];
            break;
          case this.searchs[1]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&name=" + this.searchContent[index];
            break;
          case this.searchs[2]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&gender=" + this.searchContent[index];
            break;
          case this.searchs[3]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&birthday=" + this.searchContent[index];
            break;
          case this.searchs[4]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&grade=" + this.searchContent[index];
            break;
          case this.searchs[5]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&class_id=" + this.searchContent[index];
            break;
          case this.searchs[6]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&major=" + this.searchContent[index];
            break;
          case this.searchs[7]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&email=" + this.searchContent[index];
            break;
          case this.searchs[8]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&phone=" + this.searchContent[index];
            break;
          case this.searchs[9]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&address=" + this.searchContent[index];
            break;
        }
      }
      this.load();
    },
  },
};
</script>
