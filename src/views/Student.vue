<template>
  <div>
    <!-- 搜索 start-->
    <div style="margin-bottom: 5px">
      <el-checkbox-group
        v-model="checkedsearchs"
        @change="handlecheckedsearchsChange"
        :max="3"
        :min="1"
      >
        <el-checkbox v-for="search in searchs" :label="search" :key="search">{{
          search
        }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <div style="margin: 10px 0; position: relative">
      <div style="display: flex">
        <div
          v-for="(check, index) in checkedsearchs"
          :key="index"
          style="margin-right: 5px"
        >
          <div v-if="check === searchs[2]" style="padding: 8px 10px">
            <el-radio v-model="searchContent[index]" label="男">男</el-radio>
            <el-radio v-model="searchContent[index]" label="女">女</el-radio>
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
            <el-select v-model="searchContent[index]" placeholder="请选择年级">
              <el-option
                v-for="(item, index) in grades"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[5]">
            <el-select v-model="searchContent[index]" placeholder="请选择班级">
              <el-option
                v-for="(item, index) in classIds"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[6]">
            <el-select v-model="searchContent[index]" placeholder="请选择专业">
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

        <el-button type="primary" style="margin-left: 5px" @click="handleSearch"
          >搜索</el-button
        >
        <el-button type="warning" @click="reset">重置</el-button>
      </div>

      <!-- 功能菜单 -->
      <div style="position: absolute; right: 0px; top: 0px">
        <el-button type="primary" @click="addStudentFunc"
          >新增 <i class="el-icon-circle-plus-outline"></i
        ></el-button>
        <el-popconfirm
          style="margin: 0 10px"
          confirm-button-text="确定"
          cancel-button-text="再想想"
          icon="el-icon-info"
          icon-color="red"
          title="确定删除吗？"
          @confirm="batchDeletion"
        >
          <el-button type="danger" slot="reference"
            >批量删除 <i class="el-icon-remove-outline"></i
          ></el-button>
        </el-popconfirm>

        <el-upload
          action="http://localhost:9001/sms/admin/student/import"
          style="display: inline-block"
          :show-file-list="false"
          accept=".xlsx"
          :on-success="handExcelleImportSuccess"
          :on-error="handleExcelleImportError"
        >
          <el-button type="primary" style="margin-right: 5px"
            >导入 <i class="el-icon-upload"></i
          ></el-button>
        </el-upload>

        <el-button type="primary" @click="exportBtn"
          >导出 <i class="el-icon-download"></i
        ></el-button>
      </div>
    </div>
    <!-- 搜索end -->

    <!-- 学生管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="学号" width="140"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="gender" label="性别" width="60"> </el-table-column>
      <el-table-column prop="birthday" label="出生日期" width="120">
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="80"> </el-table-column>
      <el-table-column prop="classId" label="班级" width="120">
      </el-table-column>
      <el-table-column prop="major" label="专业" width="160"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="phone" label="手机号" width="140">
      </el-table-column>
      <el-table-column prop="address" label="地址" width="200">
      </el-table-column>
      <el-table-column prop="activation" label="是否激活" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.activation"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
            @change="handleSwitchChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="updatastudentfunc(scope.row)"
            >编辑</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit" @click="updatastudentfunc(scope.row)" circle></el-button> -->
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delStudent(scope.row.id)"
          >
            <el-button type="danger" size="mini" slot="reference"
              >删除</el-button
            >
            <!-- <el-button type="danger" slot="reference" icon="el-icon-delete" circle></el-button> -->
          </el-popconfirm>
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
          <el-input v-model="stuform.id" placeholder="请输入学号"></el-input>
        </el-form-item>

        <el-form-item label="用户密码">
          <el-input
            v-model="stuform.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="激活">
          <el-switch v-model="activationIn"></el-switch>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="stuform.name" placeholder="请输入姓名"></el-input>
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
          <el-input v-model="stuform.email" placeholder="请输入邮箱"></el-input>
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
        <el-button type="primary" @click="addStudentsubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改学生信息 -->
    <el-dialog title="修改学生信息" :visible.sync="updataStudent">
      <el-form ref="stuform" :model="stuform" label-width="80px">
        <el-form-item label="学生学号">
          <el-input
            v-model="stuform.id"
            placeholder="请输入学号"
            disabled="true"
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
          <el-switch v-model="activationIn"></el-switch>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="stuform.name" placeholder="请输入姓名"></el-input>
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
          <el-input v-model="stuform.email" placeholder="请输入邮箱"></el-input>
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
        <el-button type="primary" @click="updatastudentsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../utils/request";
import moment from "moment";
import { getStudentPage,saveStudent,removeStudent,updatastudent} from "@/api/student";
import { getUser, updateIsActivate ,addUser,removeUser,updataUser} from "@/api/user";
import { getClassList, getGradeList, getClassListBygradeId,getMajorByclassId,getGradeByclassId } from "@/api/class";
import { getMajorList } from "@/api/major";
export default {
  name: "Student",
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
      checkedsearchs: ["学号"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      searchString: "",
      addStudent: false, //新增学生弹框
      updataStudent: false, //修改学生弹窗
      activationIn: false, //激活
      selectedId: [], //选中的列表id
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
    // 获取用户数据
    async load() {
      this.tableData = [];
      //请求分页查询数据
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchString: this.searchString,
      };
      const res = await getStudentPage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableData.forEach((item, index) => {
        this.getactive(item);
        });
      }
    },
    //获取用户的激活状态
    async getactive(item) {
      //获取用户信息
      const params = {
        id: item.id,
      };
      const res = await getUser(params);
      if (res.code == 200) {
        item.activation = res.data.activation == 1 ? "true" : "false";
      }
    },

    //修改用户的激活状态
    async handleSwitchChange(row) {
      const params = {
        roleId: row.id,
        isActivate: row.activation == "true" ? 1 : 0,
      };
      const res = await updateIsActivate(params);
      if (res.code == 200) {
        if (res.data) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      }
    },
    // 获取班级、年级、专业等数据
    async getsomeList() {
      const res1 = await getClassList();
      const res2 = await getGradeList();
      const res3 = await getMajorList();
      if (res1.code == 200) {
        this.classIds = res1.data;
      }
      if (res2.code == 200) {
        this.grades = res2.data;
      }
      if (res3.code == 200) {
        this.majors = res3.data;
      }
    },
    handExcelleImportSuccess() {
      this.$message.success("导入成功");
      this.load();
    },
    handleExcelleImportError() {
      this.$message.error("导入失败");
      this.load();
    },
    //导入接口
    // importBtn(){
    //   console.log("导入");
    // },
    //导出接口
    exportBtn() {
      // console.log("导出");
      window.open("http://localhost:9001/sms/admin/student/export");
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

    //批量选中
    handleSelectionChange(val) {
      // [{},{}] =>[1,2,3]
      this.selectedId = val.map((element) => element.id);
    },

    //批量删除
    batchDeletion() {
      this.selectedId.forEach((id) => {
        this.delStudent(id);
      });
    },
    //选择年级
    async choiceGradeFunc() {
      const params = {
        gradeId: this.stuform.grade,
      };
      const res = await getClassListBygradeId(params);
      if (res.code == 200) {
        this.classIds = res.data;
      }
    },

    //选择班级
    async choiceClassFunc() {
      //获得专业
      const params = {
            classId: this.stuform.classId,
          }
      const res1 = await getMajorByclassId(params)
      const res2 = await getGradeByclassId(params)
      if (res1.code == 200) {
        this.majors = res1.data;
      }
      //获得班级
      if (res2.code == 200) {
        this.grades = res2.data;
      }
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
    async addStudentsubmit() {
      //调用接口提交表单数据
      this.stuform.activation = this.activationIn == true ? 1 : 0;
      this.userform.username = this.stuform.id;
      this.userform.password = this.stuform.password;
      this.userform.activation = this.stuform.activation;
      this.userform.roleId = this.stuform.id;
      this.userform.roleName = 4;

      //添加学生
      const res = await saveStudent(this.stuform);
      if (res.code == 200) {
        const res1 = await addUser(this.userform);
        if (res1.code == 200) {
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败");
        }
        this.stuform = {};
        this.userform = {};
        this.addStudent = false;
        this.load();
      }
    },
    //删除学生
    async delStudent(id) {

      const res = await removeStudent(id)
      console.log(res);
      if(res.code == 200){
        const res1 = await removeUser(id)
        if(res1.code == 200){
          this.$message.success("删除成功");
        }else{
          this.$message.error("删除失败");
        }
      }

      this.load();
    },
    async updatastudentfunc(row) {
      //获取用户信息
      const params = {
        id: row.id,
      };
      const res = await getUser(params);
      if (res.code == 200) {
        this.stuform = row;
        this.stuform.id = res.data.username;
        this.stuform.password = res.data.password;
        this.stuform.activation = res.data.activation;
        this.activationIn = this.stuform.activation == 1 ? true : false;
        this.stuform.id = res.data.roleId;
        this.userform.roleName = res.data.roleName;
      }
      console.log(this.stuform);

      this.updataStudent = true;
    },
    updatastudentsubmitoff() {
      this.stuform = {};
      this.userform = {};
      this.updataStudent = false;
      this.load();
    },
    async updatastudentsubmit() {
      this.stuform.activation = this.activationIn == true ? 1 : 0;
      this.userform.username = this.stuform.id;
      this.userform.password = this.stuform.password;
      this.userform.activation = this.stuform.activation;
      this.userform.roleId = this.stuform.id;
      this.userform.roleName = 4;
      const res = await updatastudent(this.stuform)
      if(res.code == 200){
        const res1 = await updataUser(this.userform)
        if(res1.code == 200){
          this.$message.success("修改成功");
        }else{
          this.$message.error("修改失败");
        }
        this.updatastudentsubmitoff();
      }
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

<style scoped>
</style>