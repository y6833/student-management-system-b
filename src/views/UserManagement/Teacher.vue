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
        <el-checkbox
          v-for="search in searchs"
          :label="search"
          :key="search"
        ></el-checkbox>
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
          :disabled="!authority.includes(4)"
          >搜索</el-button
        >
        <el-button type="warning" @click="reset">重置</el-button>
      </div>

      <!-- 功能菜单 -->
      <div style="position: absolute; right: 0px; top: 0px">
        <el-button
          type="primary"
          @click="addTeacherFunc"
          :disabled="!authority.includes(1)"
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
          <el-button
            type="danger"
            slot="reference"
            :disabled="!authority.includes(2)"
            >批量删除 <i class="el-icon-remove-outline"></i
          ></el-button>
        </el-popconfirm>

        <el-upload
          action="http://localhost:9001/sms/admin/teacher/import"
          style="display: inline-block"
          :show-file-list="false"
          accept=".xlsx"
          :on-success="handExcelleImportSuccess"
          :on-error="handleExcelleImportError"
        >
          <el-button
            type="primary"
            style="margin-right: 5px"
            :disabled="!authority.includes(5)"
            >导入 <i class="el-icon-upload"></i
          ></el-button>
        </el-upload>

        <el-button
          type="primary"
          @click="exportBtn"
          :disabled="!authority.includes(6)"
          >导出 <i class="el-icon-download"></i
        ></el-button>
      </div>
    </div>
    <!-- 搜索end -->

    <!-- 教师管理 -->

    <el-row>
      <el-col
        :span="4"
        v-for="(item, index) in tableData"
        :key="index"
        :offset="index % 5 == 0 ? 0 : 1"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <el-checkbox
            id="myCheckbox"
            v-model="selectedId"
            :label="item.id"
            multiple
            style="position: absolute; top: -3px"
          >
            <label for="myCheckbox" style="display: none"></label>
          </el-checkbox>
          <el-image
            class="teaAvatar"
            :src="item.avatar || defaultAvatar"
            :preview-src-list="[item.avatar || defaultAvatar]"
            fit="fill"
          ></el-image>
          <div style="padding: 14px; position: relative">
            <p>姓名：{{ item.name }}</p>
            <p>性别：{{ item.gender }}</p>
            <p>年龄：{{ age(item.birthday) }}</p>
            <p>教职工号：{{ item.id }}</p>
            <p>
              激活：
              <el-switch
                v-model="item.activation"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="true"
                inactive-value="false"
                @change="handleSwitchChange(item)"
              >
              </el-switch>
            </p>
            <div class="bottom_clearfix">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="updataTeacherfunc(item)"
                :disabled="!authority.includes(3)"
              ></el-button>
              <el-popconfirm
                style="margin: 0 0 0 5px"
                confirm-button-text="确定"
                cancel-button-text="再想想"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm="delTeacher(item.id)"
              >
                <el-button
                  type="danger"
                  slot="reference"
                  icon="el-icon-delete"
                  circle
                  :disabled="!authority.includes(2)"
                ></el-button>
              </el-popconfirm>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 新增表单 -->

    <el-dialog title="新增教师" :visible.sync="addTeacher">
      <el-form ref="teaform" :model="teaform" label-width="80px">
        <el-form-item label="教职工号">
          <el-input
            v-model="teaform.id"
            placeholder="请输入教职工号"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户密码">
          <el-input
            v-model="teaform.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="激活">
          <el-switch v-model="activationIn"></el-switch>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="teaform.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="teaform.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="teaform.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="teaform.grade"
            placeholder="请选择年级"
            @change="choiceGradeFunc"
          >
            <el-option
              v-for="(item, index) in grades"
              :key="index"
              :label="item"
              :value="item"
              :default-value="teaform.grade"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班级">
          <el-select
            v-model="teaform.classId"
            placeholder="请选择班级"
            @change="choiceClassFunc"
          >
            <el-option
              v-for="(item, index) in classIds"
              :key="index"
              :label="item"
              :value="item"
              :default-value="teaform.classId"
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
          <el-input v-model="teaform.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="teaform.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <!-- 地址 -->
        <el-form-item label="地址">
          <el-input
            v-model="teaform.address"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTeachersubmitoff">取 消</el-button>
        <el-button type="primary" @click="addTeachersubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改教师信息 -->
    <el-dialog title="修改教师信息" :visible.sync="updataTeacher">
      <el-form ref="teaform" :model="teaform" label-width="80px">
        <el-form-item label="教职工号">
          <el-input
            v-model="teaform.id"
            placeholder="请输入教职工号"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户密码">
          <el-input
            v-model="teaform.password"
            placeholder="请输入密码"
            type="password"
            v-model.lazy="teaform.password"
          ></el-input>
        </el-form-item>

        <el-form-item label="激活">
          <el-switch v-model="activationIn"></el-switch>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="teaform.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="teaform.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="teaform.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="teaform.grade"
            placeholder="请选择年级"
            @change="choiceGradeFunc"
          >
            <el-option
              v-for="(item, index) in grades"
              :key="index"
              :label="item"
              :value="item"
              :default-value="teaform.grade"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="班级">
          <el-select
            v-model="teaform.classId"
            placeholder="请选择班级"
            @change="choiceClassFunc"
          >
            <el-option
              v-for="(item, index) in classIds"
              :key="index"
              :label="item"
              :value="item"
              :default-value="teaform.classId"
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
          <el-input v-model="teaform.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="teaform.phone"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>

        <!-- 地址 -->
        <el-form-item label="地址">
          <el-input
            v-model="teaform.address"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataTeachersubmitoff">取 消</el-button>
        <el-button type="primary" @click="updataTeachersubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import moment from "moment";
import {
  getTeacherPage,
  saveTeacher,
  removeTeacher,
  updatateacher,
} from "@/api/teacher";
import {
  getUser,
  updateIsActivate,
  addUser,
  removeUser,
  updataUser,
} from "@/api/user";
import {
  getClassList,
  getGradeList,
  getClassListBygradeId,
  getMajorByclassId,
  getGradeByclassId,
} from "@/api/class";
import { getUserPermission } from "@/api/userpermission";
export default {
  name: "Teacher",
  data() {
    const searchOptions = [
      "教职工号",
      "姓名",
      "性别",
      "出生日期",
      "年级",
      "班级",
      "邮箱",
      "手机号",
      "地址",
    ];
    return {
      defaultAvatar:
        "http://localhost:9001/sms/file/9df4588dcb844f63b657dd6b95f9379a.jpg",
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      checkedsearchs: ["教职工号"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      searchString: "",
      addTeacher: false, //新增教师弹框
      updataTeacher: false, //修改教师弹窗
      activationIn: false, //激活
      selectedId: [], //选中的列表id
      teaform: {
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
        avatar: "",
      },
      grades: [],
      classIds: [],
      majors: [],
      authority: [], //权限
    };
  },
  created() {
    //请求分页查询数据
    this.load();
    //请求班级、年级、专业等数据
    this.getsomeList();
    //获取权限
    this.getauthority();
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
      const res = await getTeacherPage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.tableData.forEach((item, index) => {
          this.getactive(item);
        });
      }
    },


    //获取权限列表
    async getauthority() {
      let user = JSON.parse(localStorage.getItem("user"));
      //获取权限列表
      const props = {
        roleId: user.roleId,
      };
      const res = await getUserPermission(props);
      if (res.code == 200) {
        this.authority = res.data;
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
        item.avatar = res.data.avatar;
        //头像
      }
    },
    //通过生日获得年龄
    age(birthday) {
      const birthDate = new Date(birthday);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        return age - 1;
      }
      return age;
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
      if (res1.code == 200) {
        this.classIds = res1.data;
      }
      if (res2.code == 200) {
        this.grades = res2.data;
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
      window.open("http://localhost:9001/sms/admin/teacher/export");
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

    //批量删除
    batchDeletion() {
      this.selectedId.forEach((id) => {
        this.delTeacher(id);
      });
    },
    //选择年级
    async choiceGradeFunc() {
      const params = {
        gradeId: this.teaform.grade,
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
        classId: this.teaform.classId,
      };
      const res1 = await getMajorByclassId(params);
      const res2 = await getGradeByclassId(params);
      if (res1.code == 200) {
        this.majors = res1.data;
      }
      //获得班级
      if (res2.code == 200) {
        this.grades = res2.data;
      }
    },

    //选择专业
    addTeacherFunc() {
      this.teaform = {};
      //调用接口获得年级、班级、专业列表
      this.getsomeList();

      this.addTeacher = true;
    },
    addTeachersubmitoff() {
      this.teaform = {};
      this.userform = {};
      this.addTeacher = false;
      this.load();
    },
    async addTeachersubmit() {
      //调用接口提交表单数据
      this.teaform.activation = this.activationIn == true ? 1 : 0;
      this.userform.username = this.teaform.id;
      this.userform.password = this.teaform.password;
      this.userform.activation = this.teaform.activation;
      this.userform.roleId = this.teaform.id;
      this.teaform.birthday = moment(this.teaform.birthday).add(1, "day");
      this.userform.roleName = 3;

      //添加教师
      const res = await saveTeacher(this.teaform);
      if (res.code == 200) {
        const res1 = await addUser(this.userform);
        if (res1.code == 200) {
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败");
        }
        this.teaform = {};
        this.userform = {};
        this.addTeacher = false;
        this.load();
      }
    },
    //删除教师
    async delTeacher(id) {
      // 调用删除接口，传入id参数
      const res = await removeTeacher(id);
      if (res.code == 200) {
        const res1 = await removeUser(id);
        if (res1.code == 200) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      }
      this.load();
    },
    async updataTeacherfunc(row) {
      //获取用户信息
      const params = {
        id: row.id,
      };
      const res = await getUser(params);
      if (res.code == 200) {
        this.teaform = row;
        this.teaform.id = res.data.username;
        this.teaform.password = res.data.password;
        this.teaform.activation = res.data.activation;
        this.activationIn = this.teaform.activation == 1 ? true : false;
        this.teaform.id = res.data.roleId;
        this.userform.roleName = res.data.roleName;
      }
      //获取激活信息
      this.getactive(row);

      this.updataTeacher = true;
    },
    updataTeachersubmitoff() {
      this.teaform = {};
      this.userform = {};
      this.updataTeacher = false;
      this.load();
    },
    async updataTeachersubmit() {
      this.teaform.activation = this.activationIn == true ? 1 : 0;
      this.userform.username = this.teaform.id;
      this.userform.password = this.teaform.password;
      this.userform.activation = this.teaform.activation;
      this.userform.roleId = this.teaform.id;
      this.teaform.birthday = moment(this.teaform.birthday).add(1, "day");
      this.userform.roleName = 3;
      const res = await updatateacher(this.teaform);
      if (res.code == 200) {
        const res1 = await updataUser(this.userform);
        if (res1.code == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
        this.updataTeachersubmitoff();
      }
      this.updataTeacher = false;
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
                : "&email=" + this.searchContent[index];
            break;
          case this.searchs[7]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&phone=" + this.searchContent[index];
            break;
          case this.searchs[8]:
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
.bottom_clearfix {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
}
.teaAvatar {
  width: 280px;
  height: 240px;
}
</style>