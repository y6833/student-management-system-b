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
        <!-- 搜索 -->
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
          <div style="display: flex;">
            <div
              v-for="(check, index) in checkedsearchs"
              :key="index"
              style="width: 200px; margin-right: 5px"
            >
              <el-input
                v-model="searchContent[index]"
                placeholder="请输入搜索内容"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>

            <el-button
              type="primary"
              style="margin-left: 5px"
              @click="handleSearch"
              >搜索</el-button
            >
          </div>

          <!-- 新增 -->
          <div style="position: absolute; right: 0px; top: 0px">
            <el-button type="primary"
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
            <template slot-scope>
              <el-button type="primary" size="mini">编辑</el-button>
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
    };
  },
  created() {
    //请求分页查询数据
    this.load();
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
      fetch(
        "http://localhost:9001/sms/admin/student/page?pageNum=" +
          this.pageNum +
          "&pageSize=" +
          this.pageSize
          +"&searchString="
          +encodeURIComponent(this.searchString)
          
          
      )
        .then((res) => res.json())
        .then((res) => {
          this.tableData = res.records;
          this.total = res.total;
        });
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

    handlecheckedsearchsChange(values) {
      this.searchContent = [];
      
    },
    handleSearch() {
      this.searchString = ''
      for (let index = 0; index < this.checkedsearchs.length; index++) {
        switch(this.checkedsearchs[index]){
          case this.searchs[0]:
            this.searchString += "&id=" +this.searchContent[index];
            break;
          case this.searchs[1]:
            this.searchString += "&name="+this.searchContent[index];
            break;
          case this.searchs[2]:
            this.searchString += "&gender="+this.searchContent[index];
            break;
          case this.searchs[3]:
            this.searchString += "&birthday="+this.searchContent[index];
            break;
          case this.searchs[4]:
            this.searchString += "&grade="+this.searchContent[index];
            break;
          case this.searchs[5]:
            this.searchString += "&class_id="+this.searchContent[index];
            break;
          case this.searchs[6]:
            this.searchString += "&major="+this.searchContent[index];
            break;
          case this.searchs[7]:
            this.searchString += "&email"+this.searchContent[index];
            break;
          case this.searchs[8]:
            this.searchString += "&phone="+this.searchContent[index];
            break;
          case this.searchs[9]:
            this.searchString += "&address="+this.searchContent[index];
            break;
        }
        
      }
      this.load()
    },
  },
};
</script>
