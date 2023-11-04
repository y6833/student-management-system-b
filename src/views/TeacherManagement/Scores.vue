<template>
  <div>
    <!-- 搜索 start-->
    <div style="margin-bottom: 5px">
      <el-checkbox-group
        v-model="checkedsearchs"
        @change="handlecheckedsearchsChange"
        :max="3"
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

          <div class="block" v-else-if="check === searchs[6]">
            <el-date-picker
              v-model="searchContent[index]"
              type="date"
              placeholder="请选择考试日期"
            >
            </el-date-picker>
          </div>
          <div class="block" v-else-if="check === searchs[7]">
            <el-select
              v-model="searchContent[index]"
              placeholder="请选择考试名称"
            >
              <el-option
                v-for="(item, index) in examNames"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="block" v-else-if="check === searchs[8]">
            <el-select v-model="subject" placeholder="请选择科目名称">
              <el-option
                v-for="(item, index) in subjects"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[3]">
            <el-select v-model="searchContent[index]" placeholder="请选择年级">
              <el-option
                v-for="(item, index) in grades"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[4]">
            <el-select v-model="searchContent[index]" placeholder="请选择班级">
              <el-option
                v-for="(item, index) in classIds"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[5]">
            <el-select v-model="searchContent[index]" placeholder="请选择专业">
              <el-option
                v-for="(item, index) in majors"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[9]" style="display: flex">
            <el-select
              v-model="comparesIf"
              placeholder="查询条件"
              style="width: 120px; margin-right: 10px"
            >
              <el-option
                v-for="(item, index) in compare"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>

            <div v-if="comparesIf == compare[3]" style="display: flex">
              <el-input-number
                v-model="comparesDy"
                controls-position="right"
                @change="handlecomparesXyChange"
                :min="0"
              ></el-input-number>
              ~
              <el-input-number
                v-model="comparesXy"
                controls-position="right"
                @change="handlecomparesXyChange"
                :min="0"
              ></el-input-number>
            </div>
            <div v-else>
              <el-input-number
                v-model="compares"
                controls-position="right"
                @change="handlecomparesXyChange"
                :min="0"
              ></el-input-number>
            </div>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            ref="stuform"
            :model="stuform"
            label-width="80px"
            style="display: flex"
          >
            <div style="margin-right: 100px">
              <el-form-item label="学号:">
                <span>{{ props.row.student.id }}</span>
              </el-form-item>

              <el-form-item label="姓名">
                <span>{{ props.row.student.name }}</span>
              </el-form-item>

              <el-form-item label="年级">
                <span>{{ props.row.student.grade }}级</span>
              </el-form-item>

              <el-form-item label="专业">
                <span>{{ props.row.student.major }}</span>
              </el-form-item>

              <el-form-item label="班级">
                <span>{{ props.row.student.classId }}</span>
              </el-form-item>
            </div>
            <div style="margin-right: 100px">
              <el-form-item label="考试日期">
                <span>{{ props.row.examDate }}</span>
              </el-form-item>
              <el-form-item label="考试名称">
                <span>{{ props.row.examName }}</span>
              </el-form-item>
              <el-form-item label="年级排名">
                <span>{{ props.row.gradeRanking }}</span>
              </el-form-item>
              <el-form-item label="班级排名">
                <span>{{ props.row.classRanking }}</span>
              </el-form-item>
            </div>
            <div style="margin-right: 100px">
              成绩：
              <el-form-item
                v-for="(value, key) in props.row.scores"
                :key="key"
                :label="key"
              >
                <el-input-number
                  v-model="props.row.scores[key]"
                  controls-position="right"
                  :min="0"
                  :max="120"
                  @change="
                    ChangeScores(
                      props.row.student.id,
                      key,
                      props.row.scores[key],
                      props.row.examDate
                    )
                  "
                ></el-input-number>
                <!-- 通过方法获取成绩最大值 -->
              </el-form-item>
            </div>
            <div>
              <RadarChart style="width: 100%; height: 100%;" />
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="student.id"
        label="学号"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="student.name"
        label="姓名"
        width="100"
      ></el-table-column>
      <el-table-column prop="student.gender" label="性别" width="60">
      </el-table-column>
      <el-table-column prop="student.birthday" label="出生日期" width="120">
      </el-table-column>
      <el-table-column prop="student.grade" label="年级" width="80">
      </el-table-column>
      <el-table-column prop="student.classId" label="班级" width="120">
      </el-table-column>
      <el-table-column prop="sum" sortable label="总分" width="160">
      </el-table-column>
      <el-table-column
        prop="gradeRanking"
        sortable
        label="年级排名"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="classRanking"
        sortable
        label="班级排名"
        width="140"
      >
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
        :page-sizes="[3, 5, 10, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
  
  <script>
import moment from "moment";
import {
  getStudentPage,
  saveStudent,
  removeStudent,
  updatastudent,
} from "@/api/student";
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
import {
  getStuScorePage,
  getStuScoreList,
  updataScore,
  getExamList,
} from "@/api/scores";
import { getSubjectList } from "@/api/course";
import { getMajorList } from "@/api/major";
import RadarChart from "@/components/fig/RadarChart.vue";
export default {
  components: { RadarChart },
  name: "Scores",
  data() {
    const searchOptions = [
      "学号", //0
      "姓名", //1
      "性别", //2
      "年级", //3
      "班级", //4
      "专业", //5
      "考试日期", //6
      "考试名称", //7
      "考试科目", //8
      "考试成绩", //9
    ];
    return {
      compare: ["大于", "等于", "小于", "介于"],
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 3,
      checkedsearchs: [], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      comparesIf: "", //成绩搜索条件
      comparesDy: 0,
      comparesXy: 0,
      compares: 0,
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
      stuScore: {
        classRanking: 0,
        examDate: "",
        examName: "",
        gradeRanking: 0,
        stuform: {},
      },
      grades: [], //年级列表
      classIds: [], //班级列表
      majors: [], //专业列表
      examNames: [], //考试列表
      subjects: [], //考试科目
      subject: "", //选中的科目
      studentList: [],
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
      const res = await getStuScoreList(params);

      if (res.code == 200) {
        this.studentList = res.data.data.records;
        const res1 = await getStuScorePage(this.studentList);
        if (res1.code == "200") {
          this.tableData = res1.data.slice(0, this.pageSize);
          this.handlecomparesXyChange();
        }
        this.total = res.data.total;
      }
    },

    // 获取班级、年级、专业等数据
    async getsomeList() {
      const res1 = await getClassList(); // 获取班级列表
      const res2 = await getGradeList(); // 获取年级列表
      const res3 = await getMajorList(); // 获取专业列表
      const res4 = await getExamList(); // 获取考试列表
      const res5 = await getSubjectList(); // 获取考试科目

      if (res1.code == 200) {
        this.classIds = res1.data;
      }
      if (res2.code == 200) {
        this.grades = res2.data;
      }
      if (res3.code == 200) {
        this.majors = res3.data;
      }
      if (res4.code == 200) {
        this.examNames = res4.data;
      }
      if (res5.code == 200) {
        this.subjects = res5.data;
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
      this.stuform.birthday = moment(this.stuform.birthday).add(1, "day");

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
      const res = await removeStudent(id);
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
      this.stuform.birthday = moment(this.stuform.birthday).add(1, "day");
      this.userform.roleName = 4;
      const res = await updatastudent(this.stuform);
      if (res.code == 200) {
        const res1 = await updataUser(this.userform);
        if (res1.code == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
        this.updatastudentsubmitoff();
      }
      this.updataStudent = false;
    },

    //重置
    reset() {
      this.checkedsearchs = [];
      this.searchContent = [];
      this.comparesIf = "";
      this.comparesDy = 0;
      this.comparesXy = 0;
      this.compares = 0;
      this.handleSearch();
    },
    //选择班级
    async choiceClassFunc() {
      //获得专业
      const params = {
        classId: this.stuform.classId,
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

    //添加总分
    getsumscores() {
      this.tableData.forEach((item) => {
        const str = JSON.stringify(item.scores);
        const map = JSON.parse(str);
        item.sum = Object.values(map).reduce((a, b) => a + b, 0);
      });
    },
    //通过成绩查询
    handlecomparesXyChange() {
      if (this.comparesIf != "") {
        switch (this.comparesIf) {
          case this.compare[0]:
            if (this.subject == "") {
              this.getsumscores();
              this.tableData = this.tableData.filter(
                (item) => item.sum >= this.compares
              );
            } else {
              this.tableData.forEach((item) => {
                const str = JSON.stringify(item.scores);
                const map = JSON.parse(str);
                item.sum = map[this.subject];
              });
              this.tableData = this.tableData.filter(
                (item) => item.sum >= this.compares
              );
            }
            break;
          case this.compare[1]:
            if (this.subject == "") {
              this.getsumscores();
              this.tableData = this.tableData.filter(
                (item) => item.sum == this.compares
              );
            } else {
              this.tableData.forEach((item) => {
                const str = JSON.stringify(item.scores);
                const map = JSON.parse(str);
                item.sum = map[this.subject];
              });
              this.tableData = this.tableData.filter(
                (item) => item.sum == this.compares
              );
            }
            break;
          case this.compare[2]:
            if (this.subject == "") {
              this.getsumscores();
              this.tableData = this.tableData.filter(
                (item) => item.sum <= this.compares
              );
            } else {
              this.tableData.forEach((item) => {
                const str = JSON.stringify(item.scores);
                const map = JSON.parse(str);
                item.sum = map[this.subject];
              });
              this.tableData = this.tableData.filter(
                (item) => item.sum <= this.compares
              );
            }
            break;
          case this.compare[3]:
            if (this.subject == "") {
              this.getsumscores();
              this.tableData = this.tableData.filter(
                (item) =>
                  item.sum >= this.comparesDy && item.sum <= this.comparesXy
              );
            } else {
              this.tableData.forEach((item) => {
                const str = JSON.stringify(item.scores);
                const map = JSON.parse(str);
                item.sum = map[this.subject];
              });
              this.tableData = this.tableData.filter(
                (item) =>
                  item.sum >= this.comparesDy && item.sum <= this.comparesXy
              );
            }
            break;
        }
      } else {
        this.getsumscores();
      }
    },
    //修改成绩
    async ChangeScores(id, courseName, scores, examDate1) {
      const dateObj = new Date(examDate1);
      const examDate = dateObj.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const params = {
        id: id,
        courseName: courseName,
        scores: scores,
        examDate: examDate,
      };
      const res = await updataScore(params);
      if (res.code != 200) {
        this.$message.error("修改失败");
      }
    },
    //搜索
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
                : "&grade=" + this.searchContent[index];
            break;
          case this.searchs[4]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&class_id=" + this.searchContent[index];
            break;
          case this.searchs[5]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&major=" + this.searchContent[index];
            break;
          // case this.searchs[6]:
          //   this.searchString +=
          //     this.searchContent[index] === undefined
          //       ? ""
          //       : "&examDate=" + this.searchContent[index];
          //   break;
          // case this.searchs[7]:
          //   this.searchString +=
          //     this.searchContent[index] === undefined
          //       ? ""
          //       : "&examName=" + this.searchContent[index];
          //   break;
          // case this.searchs[8]:
          //   this.searchString +=
          //     this.searchContent[index] === undefined
          //       ? ""
          //       : "&course=" + this.searchContent[index];
          //   break;
          // case this.searchs[9]:
          //   this.searchString +=
          //     this.compares === undefined
          //       ? ""
          //       : "&score=" + this.comparesIf + "," + this.compares;
          //   break;
        }
      }
      this.load();
    },
  },
};
</script>
  
  <style scoped>
</style>