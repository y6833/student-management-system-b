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
          <el-button type="primary"
          style="margin-right: 5px"
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
    load() {
      this.tableData = []
      //请求分页查询数据
      request
        .get("/admin/student/page", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            searchString: this.searchString,
          },
        })
        .then((res) => {
          // res.records.forEach((record) => {
          //   record.birthday = moment(record.birthday).format("YYYY-MM-DD");
          // });
          this.tableData = res.records;
          this.total = res.total;
          this.getactive();
        });
    },
    getactive() {
      //获取用户信息
      this.tableData.forEach((item, index) => {
        request
          .get("/admin/user/getUser", {
            params: {
              id: item.id,
            },
          })
          .then((res) => {
            item.activation = res.activation == 1 ? "true" : "false";
          });
      });
    },

    handleSwitchChange(row) {
      request
        .get("/admin/user/updateIsActivate", {
          params: {
            roleId: row.id,
            isActivate: row.activation == "true" ? 1 : 0,
          },
        })
        .then((res) => {
          if (res) {
            this.$message.success("修改成功");
          } else {
            this.$message.error("修改失败");
          }
        });
      console.log("row", row);
    },
    getsomeList() {
      request.get("/admin/classs/getClassList", {}).then((res) => {
        this.classIds = res;
      });
      request.get("/admin/classs/getGradeList", {}).then((res) => {
        this.grades = res;
      });
      request.get("/admin/major/getMajorList", {}).then((res) => {
        this.majors = res;
      });
    },
    handExcelleImportSuccess(){
      this.$message.success("导入成功");
      this.load();
    },
    handleExcelleImportError(){
      this.$message.error("导入失败");
      this.load();
    },
    //导入接口
    // importBtn(){
    //   console.log("导入");
    // },
    //导出接口
    exportBtn(){
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
    choiceGradeFunc() {
      request
        .get("/admin/classs/getClassListBygradeId", {
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
        .get("/admin/classs/getMajorByclassId", {
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
        .get("/admin/classs/getGradeByclassId", {
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
        .post("/admin/student", this.stuform)
        .then((res) => {
          //添加用户
          if (res) {
            request
              .post("/admin/user/addUser", this.userform)
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
    delStudent(id) {
      request
        .delete("/admin/student/" + id)
        .then((res) => {
          if (res) {
            request
              .delete("/admin/user/" + id)
              .then((res) => {
                if (res) {
                  this.$message.success("删除用户成功");
                }
              })
              .catch((err) => {
                console.log("删除用户失败", err);
              });
          }
          this.$message.success("删除学生成功");
        })
        .catch((err) => {
          this.$message.success("删除学生失败", err);
        });
      this.load();
    },
    updatastudentfunc(row) {
      //获取用户信息
      request
        .get("/admin/user/getUser", {
          params: {
            id: row.id,
          },
        })
        .then((res) => {
          this.stuform = row;
          this.stuform.id = res.username;
          this.stuform.password = res.password;
          this.stuform.activation = res.activation;
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
      this.stuform.activation = this.activationIn == true ? 1 : 0;
      this.userform.username = this.stuform.id;
      this.userform.password = this.stuform.password;
      this.userform.activation = this.stuform.activation;
      this.userform.roleId = this.stuform.id;
      this.userform.roleName = 4;
      request
        .post("/admin/student/updata", this.stuform)
        .then((res) => {
          if (res) {
            request
              .post("/admin/user/updataUser", this.userform)
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

<style scoped>
</style>