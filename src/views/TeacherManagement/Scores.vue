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
          <div class="block" v-else-if="check === searchs[6]">
            <el-date-picker
              v-model="searchContent[index]"
              type="date"
              placeholder="请选择考试日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
          <div class="block" v-else-if="check === searchs[7]">
            <el-select v-model="chooseExamname" placeholder="请选择考试名称">
              <el-option
                v-for="(item, index) in examNames"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="block" v-else-if="check === searchs[8]">
            <el-select
              v-model="subject"
              placeholder="请选择科目名称"
              @change="subjectChange"
            >
              <el-option
                v-for="(item, index) in subjects"
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
          @click="addStudentScoreFunc"
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
          action="http://localhost:9001/sms/admin/score/import"
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
              <el-form-item label="考试教室">
                <el-input
                  v-model="props.row.examRoom"
                  @change="updataExamRoom(props.row)"
                ></el-input>
              </el-form-item>
              <el-form-item label="评语">
                <el-input
                  type="textarea"
                  v-model="props.row.proposal"
                  @change="updataProposal(props.row)"
                ></el-input>
                <!-- <span>{{ props.row.proposal }}</span> -->
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
                  :max="
                    props.row.maxScores.find((item) => item.name === key).max
                  "
                  :disabled="!authority.includes(3)"
                  @change="
                    ChangeScores(
                      props.row.student.id,
                      key,
                      props.row.scores[key],
                      props.row.examDate,
                      props.row.examName
                    )
                  "
                ></el-input-number>
                <!-- 通过方法获取成绩最大值 -->
              </el-form-item>
              <div style="margin-left: 40px; font-size: 16px">
                总分: <span style="padding: 0 60px">{{ props.row.sums }}</span>
              </div>
            </div>
            <div v-if="props.row.maxScores.length > 2">
              <RadarChart class="chart" :stuScores="props.row" />
            </div>
            <div v-else>
              <ScoreBarChart class="chart" :stuScores="props.row" />
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="student.id"
        label="学号"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="student.name"
        label="姓名"
        width="80"
      ></el-table-column>
      <el-table-column prop="student.gender" label="性别" width="60">
      </el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="140">
      </el-table-column>
      <el-table-column prop="examName" label="考试名称" width="200">
      </el-table-column>
      <el-table-column prop="student.grade" label="年级" width="80">
      </el-table-column>
      <el-table-column prop="student.classId" label="班级" width="120">
      </el-table-column>
      <el-table-column
        :prop="subject != '总分' ? 'sum' : 'sums'"
        sortable
        :label="subject != '总分' ? subject : '总分'"
        width="60"
      >
      </el-table-column>
      <el-table-column
        prop="gradeRanking"
        sortable
        label="年级排名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="classRanking"
        sortable
        label="班级排名"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="active" label="是否考试" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.active == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link
          v-if="scope.row.active == 1"
            class="LookGrade"
            :to="{
              path: '/scores_grade',
              query: {
                exam: scope.row.examName,
                grade: scope.row.student.grade,
              },
            }"
            >年级看板</router-link
          >
          <router-link
            v-if="scope.row.type == 1 && scope.row.active == 1"
            class="LookClass"
            :to="{
              path: '/scores_class',
              query: {
                exam: scope.row.examName,
                grade: scope.row.student.grade,
                className: scope.row.student.classId,
              },
            }"
            >班级看板</router-link
          >
          <router-link
            class="LookStudent"
            v-if="scope.row.active == 1"
            :to="{
              path: '/scores_student',
              query: {
                exam: scope.row.examName,
                studentId: scope.row.student.id,
              },
            }"
            >学生看板</router-link
          >
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delStudentScore(scope.row)"
          >
            <el-button
              type="danger"
              size="mini"
              slot="reference"
              :disabled="!authority.includes(2)"
              >删除</el-button
            >
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
        :page-sizes="[3, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 新增学生成绩 -->
    <el-dialog title="新增学生" :visible.sync="addStudentScore">
      <el-form ref="stuScore" :model="stuScore" label-width="80px">
        <el-form-item label="学生学号">
          <el-input
            v-model="stuScore.stuform.id"
            @change="getStuById(stuScore.stuform.id)"
            placeholder="请输入学号"
          ></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          {{ stuScore.stuform.name }}
        </el-form-item>

        <el-form-item label="年级">
          {{ stuScore.stuform.grade }}
        </el-form-item>

        <el-form-item label="专业">
          {{ stuScore.stuform.major }}
        </el-form-item>

        <el-form-item label="班级">
          {{ stuScore.stuform.classId }}
        </el-form-item>

        <el-form-item label="考试名称">
          <el-select
            v-model="stuScore.examName"
            @change="getSubjectListFunc(stuScore.examName)"
            placeholder="请选择考试名称"
          >
            <el-option
              v-for="(item, index) in examNames"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="成绩">
          <div v-for="(item, index) in subjectList" :key="index">
            <div style="margin-bottom: 20px">
              <div class="addObjectName">{{ item }}:</div>
              <el-input-number
                v-model="stuScore.scores[item]"
                controls-position="right"
                :min="0"
              ></el-input-number>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStudentScoresubmitoff">取 消</el-button>
        <el-button type="primary" @click="addStudentScoresubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import moment from "moment";
import {
  getStudentPage,
  saveStudent,
  removeStudent,
  updatastudent,
  getStuById,
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
  addStudentScore,
  delStudentScore,
  getScoreTotal,
  updataExamRoom,
  updataProposal,
  exportScore,
} from "@/api/scores";
import {
  getSubjectList,
  getSubjectMax,
  getClassAve,
  getGradeAve,
  getSubjectListByExamName,
} from "@/api/course";
import { getMajorList } from "@/api/major";
import RadarChart from "@/components/fig/RadarChart.vue";
import ScoreBarChart from "@/components/fig/ScoreBarChart.vue";
import { getUserPermission } from "@/api/userpermission";

export default {
  components: { RadarChart, ScoreBarChart },
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
      checkedsearchs: ["学号"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      comparesIf: "", //成绩搜索条件
      comparesDy: 0,
      comparesXy: 0,
      compares: 0,
      searchString: "",
      addStudentScore: false, //新增学生弹框
      updataStudent: false, //修改学生弹窗
      activationIn: false, //激活
      selectedId: [],
      // chooseExamdata: "",
      chooseExamname: "",
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
        scores: {},
        gradeRanking: 0,
        proposal: "",
        stuform: {},
      },
      grades: [], //年级列表
      classIds: [], //班级列表
      majors: [], //专业列表
      examNames: [], //考试列表
      subjects: [], //考试科目
      subjectList: [], //根据考试获取考试科目
      subject: "总分", //选中的科目
      studentList: [],
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
      const res = await getStuScoreList(params);
      if (res.code == 200) {
        this.tableData = res.data.studentScoresList;
        // console.log(this.tableData);
        this.handlecomparesXyChange();
        this.getStudentScoresInfo();
        this.total = res.data.total;
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

    //添加考试教室
    async updataExamRoom(row) {
      const dateObj = new Date(row.examDate);
      const examDate = dateObj.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const params = {
        id: row.scoreId,
        examRoom: row.examRoom,
        examDate: examDate,
        examName: row.examName,
      };
      const res = await updataExamRoom(params);
      if (res.code == 200) {
        this.$message.success("考试教室设置成功");
      } else {
        this.$message.error("考试教室设置失败");
      }
    },
    //添加评语
    async updataProposal(row) {
      const dateObj = new Date(row.examDate);
      const examDate = dateObj.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const params = {
        id: row.scoreId,
        proposal: row.proposal,
        examDate: examDate,
        examName: row.examName,
      };
      const res = await updataProposal(params);
      if (res.code == 200) {
        this.$message.success("评论成功");
      } else {
        this.$message.error("评论失败");
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
    async exportBtn() {
      // await this.getSubjectListFunc(this.chooseExamname)
      // console.log("导出",this.subjectList);
      // let subs = JSON.stringify(this.subjectList);
      // console.log(subs.replace(/[[]]/g, ""));
      // let data = "学号，学生姓名，班级，"

      let examName = this.chooseExamname;

      // 科目1,科目2,"班级排名，年级排名，考试日期，考试名称";
      if (this.chooseExamname == "") {
        this.$message.error("请选择考试名称");
      } else {
        const res = await exportScore(examName);
        if (res.code == 200) {
          this.$message.success("导出成功");
        }
        // window.open(`http://localhost:9001/sms/admin/score/export?examName=${this.chooseExamname}`);
      }
    },
    scoresGrade(row) {
      // console.log(row);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.load();
    },

    handlecheckedsearchsChange() {
      this.searchContent = [];
    },

    //通过学号获取信息
    async getStuById(id) {
      const res = await getStuById(id);
      if (res.code == 200) {
        this.stuScore.stuform = res.data;
      }
    },

    //批量选中
    handleSelectionChange(val) {
      // [{},{}] =>[1,2,3]
      val.forEach((index, value) => {
        this.selectedId[value] = index;
      });
    },
    //批量删除
    batchDeletion() {
      this.selectedId.forEach((item) => {
        this.delStudentScore(item);
      });
    },

    //根据考试日期筛选
    // async chooseExamdataChange() {
    //   await this.load();
    //   this.tableData = this.tableData.filter(
    //     (item) => item.examDate == this.chooseExamdata
    //   );
    // },
    //根据考试名称进行筛选
    async chooseExamnameChange() {
      await this.load();
      this.tableData = this.tableData.filter(
        (item) => item.examName == this.chooseExamname
      );
    },
    //删除
    async delStudentScore(row) {
      const params = {
        studentId: row.student.id,
        examName: row.examName,
      };
      const res = await delStudentScore(params);
      if (res.code == 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      this.load();
    },
    //添加学生成绩
    addStudentScoreFunc() {
      this.stuScore = {
        stuform: {},
        scores: {},
      };
      this.subject = "";
      this.subjectList = [];
      //调用接口获得年级、班级、专业列表
      this.getsomeList();
      this.addStudentScore = true;
    },

    //重置
    reset() {
      this.checkedsearchs = [];
      this.searchContent = [];
      this.comparesIf = "";
      this.comparesDy = 0;
      this.comparesXy = 0;
      this.compares = 0;
      this.subject = "总分";
      // this.chooseExamdata = "";
      this.chooseExamname = "";
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

    //更具考试科目修改sum值
    subjectChange() {
      this.tableData.forEach((item) => {
        const str = JSON.stringify(item.scores);
        const map = JSON.parse(str);
        item.sum = map[this.subject];
        item.sums = Object.values(map).reduce((a, b) => a + b, 0);
      });
    },
    //通过成绩查询
    handlecomparesXyChange() {
      this.subjectChange();
      switch (this.comparesIf) {
        case this.compare[0]:
          this.tableData = this.tableData.filter(
            (item) =>
              (this.subject == "总分" ? item.sums : item.sum) >= this.compares
          );

          break;
        case this.compare[1]:
          this.tableData = this.tableData.filter(
            (item) =>
              (this.subject == "总分" ? item.sums : item.sum) == this.compares
          );
          break;
        case this.compare[2]:
          this.tableData = this.tableData.filter(
            (item) =>
              (this.subject == "总分" ? item.sums : item.sum) <= this.compares
          );
          break;
        case this.compare[3]:
          this.tableData = this.tableData.filter(
            (item) =>
              (this.subject == "总分" ? item.sums : item.sum) >=
                this.comparesDy &&
              (this.subject == "总分" ? item.sums : item.sum) <= this.comparesXy
          );
          break;
      }
    },

    //- 获取学生成绩信息（要传给雷达图）
    getStudentScoresInfo() {
      //获取每个科目的最大值
      this.tableData.forEach(async (item) => {
        //获取所有的键

        let keys = Object.keys(item.scores);
        const date = new Date(item.examDate);
        const formattedDate = date.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        let keysStr = JSON.stringify(keys).replace(/\[|\]/g, "");
        let params = {
          examName: item.examName,
          examDate: formattedDate,
          id: item.student.id,
          objects: keysStr,
        };
        const res1 = await getSubjectMax(keys); //获取科目满分
        const res2 = await getClassAve(params); //获取班级平均分
        const res3 = await getGradeAve(params); //获取年级平均分
        if (res1.code == 200) {
          item.maxScores = res1.data;
        }
        if (res2.code == 200) {
          item.classAve = res2.data;
        }
        if (res3.code == 200) {
          item.gradeAve = res3.data;
        }
      });
    },
    //-修改成绩
    async ChangeScores(id, courseName, scores, examDate1, examName) {
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
        examName: examName,
      };
      const res = await updataScore(params);
      if (res.code == 200) {
      } else {
        this.$message.error("修改失败");
      }
    },
    //--取消添加成绩
    addStudentScoresubmitoff() {
      this.stuScore = {
        stuform: {},
        scores: {},
      };
      this.addStudentScore = false;
      this.load();
    },
    //--添加成绩
    async addStudentScoresubmit() {
      let scoreList = "";
      this.subjectList.forEach((item) => {
        scoreList += item + ":" + this.stuScore.scores[item] + ",";
      });
      const params = {
        studentId: this.stuScore.stuform.id,
        examName: this.stuScore.examName,
        scoreList: scoreList,
      };
      const res = await addStudentScore(params);
      if (res.code == 200) {
        this.$message.success("添加成功");
      } else {
        this.$message.error(res.msg);
      }
      this.addStudentScore = false;
      this.load();
    },
    //-通过老师名称获得考试科目
    async getSubjectListFunc(examName) {
      const params = {
        examName: examName,
      };
      const res = await getSubjectListByExamName(params);

      if (res.code == 200) {
        this.subjectList = res.data;
      }
    },
    //-搜索
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
          case this.searchs[6]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&examDate=" + this.searchContent[index];
            break;
          case this.searchs[7]:
            this.searchString +=
              this.chooseExamname === undefined
                ? ""
                : "&examName=" + this.chooseExamname;
            break;
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
      this.pageNum = 1;
      this.pageSize = 3;
      this.load();
    },
  },
};
</script>
  
  <style scoped>
.chart {
  width: 100%;
  height: 100%;
}
.addObjectName {
  display: inline-block;
  width: 80px;
}
.el-main {
  background-color: #ffffff;
}
.LookGrade {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  text-decoration: none;
  margin-right: 10px;
}
.LookClass {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  text-decoration: none;
  margin-right: 10px;
}
.LookStudent {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  text-decoration: none;
}
.el-main {
  background-color: #fff;
}
</style>