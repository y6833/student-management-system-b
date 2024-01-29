<!-- 年级成绩看板 -->
<template>
  <div class="bodys">
    <!-- 标题 -->
    <div id="drag_hzln3vphjq" class="show-comt-box">
      <span style="font-family: '华文琥珀'; font-size: 32px">班级成绩看板</span>
    </div>
    <div class="ScoreBody">
      <!-- 选择菜单行 -->
      <div class="choiceMune">
        <!-- 选择考试 -->
        <div class="choiceName">
          <div class="choiceTitle">考试场次</div>
          <div class="choiceContent">
            <el-select
              v-model="examValue"
              placeholder="请选择考试(必选)"
              size="mini"
              @change="choiceExamOrGradeOrMajor"
            >
              <el-option
                v-for="item in examinationList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 选择年级 -->
        <div class="choiceName">
          <div class="choiceTitle">年级</div>
          <div class="choiceContent">
            <el-select
              v-model="gradeValue"
              placeholder="请选择年级(必选)"
              size="mini"
              @change="choiceGrade"
            >
              <el-option
                v-for="item in gradeList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 选择班级 -->
        <div class="choiceName">
          <div class="choiceTitle">班级</div>
          <div class="choiceContent">
            <el-select
              v-model="classValue"
              placeholder="请选择班级(必选)"
              size="mini"
              @change="choiceClassFunc"
            >
              <el-option
                v-for="item in classList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 选择专业 -->
        <div class="choiceName">
          <div class="choiceTitle">专业</div>
          <div class="choiceContent">
            <el-select
              v-model="majorValue"
              placeholder="请选择专业(可选)"
              size="mini"
              @change="choiceExamOrGradeOrMajor"
            >
              <el-option
                v-for="item in majors"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 实时时间 -->
        <Realtime class="realtime"></Realtime>
      </div>
      <!-- 基本信息 -->
      <div class="basicInfo">
        <!-- 年级人数 -->
        <div class="Score gradePeople">
          <span class="introduce">年级人数：</span>
          <span>{{ gradePeople }}</span>
        </div>
        <!-- 最高分 -->
        <div class="Score maxScore">
          <span class="introduce">最高分：</span>
          <span class="intvalue">{{ maxScore }}</span>
        </div>
        <!-- 最低分 -->
        <div class="Score minScore">
          <span class="introduce">最低分：</span>
          <span class="intvalue">{{ minScore }}</span>
        </div>
        <!-- 平均分 -->
        <div class="Score aveScore">
          <span class="introduce">平均分：</span>
          <span class="intvalue">{{ aveScore }}</span>
        </div>
      </div>
      <!-- 区域一 -->
      <div class="area1" style="background-color: #fff">
        <div class="left" style="width: 70%">
          <!-- 考试科目选择区域 -->
          <div class="exam_subjects">
            <!-- 通过考试名称获取考试科目 -->
            <span style="font-size: 14px; margin-right: 10px"> 科目</span>
            <el-radio-group
              v-model="choiceSubject"
              size="mini"
              @change="choiceSubjectFunc"
            >
              <el-radio-button
                v-for="subject in examSubjects"
                :key="subject"
                :label="subject"
              ></el-radio-button>
            </el-radio-group>
          </div>
          <div class="subject_class_Ranking">
            <ClassExamAveChart
              :choiceSubject="choiceSubject"
              :examClassAve="examClassAve"
            />
          </div>
          <div class="grade_score_range">
            <ScoreClassRangeChart
              :choiceSubject="choiceSubject"
              :examValue="examValue"
              :classValue="classValue"
            />
          </div>
        </div>
      </div>
      <!-- 区域二 -->
      <div
        class="area2"
        style="background-color: #fff; width: 100%; position: relative"
      >
      <span
          class="semester"
          style="
            margin-left: 50px;
            display: flex;
            position: absolute;
            left: 0;
          "
        >
          <span
            style="
              margin-right: 10px;
              font-size: 14px;
              line-height: 30px;
              height: 30px;
            "
            >学期</span
          >
          <div class="semesterSelect">
            <el-select
              v-model="semester"
              placeholder="学期"
              size="mini"
            >
              <el-option
                v-for="item in [1,2]"
                :key="item"
                :value="item"
              >
              {{item == 1 ? '上学期' :'下学期'}}
              </el-option>
            </el-select>
          </div>
        </span>
        <div
          class="exam_subjects"
          style="display: flex; margin: 0 auto; width: auto"
        >
          <!-- 通过考试名称获取考试科目 -->
          <span
            style="
              font-size: 14px;
              margin-right: 10px;
              line-height: 30px;
              height: 30px;
            "
          >
            科目</span
          >
          <el-radio-group
            v-model="choiceSubject1"
            size="mini"
            @change="choiceSubjectFunc1"
          >
            <el-radio-button
              v-for="subject in examSubjects"
              :key="subject"
              :label="subject"
            ></el-radio-button>
          </el-radio-group>
        </div>
        <span
          class="ranking_range"
          style="
            margin-right: 100px;
            display: flex;
            position: absolute;
            right: 0;
          "
        >
          <span
            style="
              margin-right: 10px;
              font-size: 14px;
              line-height: 30px;
              height: 30px;
            "
            >年级排名范围</span
          >
          <div class="rangkingSelect">
            <el-select
              v-model="rankingRange"
              placeholder="年级排名范围"
              size="mini"
              @change="choiceRankingRange"
            >
              <el-option
                v-for="item in rankingRangeList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </span>
        <div class="top">
          <ClassRankSegmentChart
            :classValue="classValue"
            :choiceSubject1="choiceSubject1"
            :rankingRange="rankingRange"
            :semester="semester"
          />
        </div>
        <div class="bottom">
          <!-- 学生管理 -->
          <el-table :data="tableData" height="200" border stripe>
            <el-table-column
              prop="student.id"
              label="学号"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="student.name"
              label="姓名"
              width="200"
            ></el-table-column>
            <el-table-column prop="student.gender" label="性别" width="100">
            </el-table-column>
            <el-table-column prop="examDate" label="考试日期" width="200">
            </el-table-column>
            <el-table-column prop="examName" label="考试名称" width="200">
            </el-table-column>
            <el-table-column prop="student.grade" label="年级" width="110">
            </el-table-column>
            <el-table-column prop="student.classId" label="班级" width="185">
            </el-table-column>
            <el-table-column
              prop="subjectNum"
              :label="choiceSubject1"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="gradeRanking"
              sortable
              label="年级排名"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="classRanking"
              sortable
              label="班级排名"
              width="150"
            >
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
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { getGradeList, getClassListBygradeId } from "@/api/class";
import {
  getAveTableData,
  getSubjectListByExamNameAndGradeAndMajor,
  getClassNum,
  getStuScoreClassRankList,
  getExamClassAve,
} from "@/api/scores";
import { getExamListks } from "@/api/examination";
import { getMajorList } from "@/api/major";

import ClassRankSegmentChart from "@/components/fig/ClassRankSegmentChart.vue";
import ScoreClassRangeChart from "@/components/fig/ScoreClassRangeChart.vue";
import ClassExamAveChart from "@/components/fig/ClassExamAveChart.vue";
import Realtime from "@/components/Realtime.vue";

export default {
  components: {
    Realtime,
    ClassExamAveChart,
    ScoreClassRangeChart,
    ClassRankSegmentChart,
  },
  data() {
    return {
      semester: 1, //学期
      examValue: "", //考试名称
      gradeValue: "", //年级
      classValue: "", //班级
      majorValue: "", //专业
      gradePeople: 0, //年级人数
      maxScore: 0, //最高分
      minScore: 0, //最低分
      aveScore: 0, //平均分
      tagType: "", //标签类型，用于显示不同的颜色样式，根据分数来判断
      choiceSubject: "总分", //选择的科目，默认为空
      choiceSubject1: "总分", //选择的科目，默认为空
      AveTableData: [], //各班级科目的平均成绩列表
      examClassAve: [], //map<"考试名称"，"平均分">
      examSubjects: [], //考试科目列表
      examinationList: [],
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      searchString: "",
      scores: {},
      majors: [],
      gradeList: [],
      classList: [],
      rankingRangeList: ["1-100", "101-200", "201-300", "301-400", "401-500"], //排名范围列表
      rankingRange: "1-100", //排名范围
    };
  },
  created() {
    this.getURLData();
    this.getsomeList();
    this.getArea1TopData();
    this.getScorePage();
  },
  methods: {
    getURLData() {
      // 获取URL中的查询字符串
      const queryString = window.location.search;

      // 使用URLSearchParams对象解析查询字符串
      const urlParams = new URLSearchParams(queryString);

      // 获取exam和grade的值
      const exam = urlParams.get("exam");
      const grade = urlParams.get("grade");
      const className = urlParams.get("className");
      this.gradeValue = grade;
      this.examValue = exam;
      this.classValue = className;
    },
    async getClassNum() {
      const params = {
        examValue: this.examValue,
        gradeValue: this.gradeValue,
        majorValue: this.majorValue,
        classValue: this.classValue,
        choiceSubject: this.choiceSubject,
      };

      const res = await getClassNum(params);
      if (res.code == 200) {
        this.gradePeople = res.data.gradePeople; //班级人数
        this.maxScore = res.data.maxScore; //最高分
        this.minScore = res.data.minScore; //最低分
        this.aveScore = res.data.aveScore; //平均分
      }
    },
    //区域2选课程
    choiceSubjectFunc1() {
      this.subjectChange();
      this.getScorePage();
    },
    //选择排名
    choiceRankingRange() {
      this.getScorePage();
    },
    subjectChange() {
      this.tableData.forEach((item) => {
        const str = JSON.stringify(item.scores);
        const map = JSON.parse(str);
        item.subjectNum = map[this.choiceSubject1];
        // item.subjectNums = Object.values(map).reduce((a, b) => a + b, 0);
      });
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getScorePage();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getScorePage();
    },
    //获取考试page
    async getScorePage() {
      this.tableData = [];
      //请求分页查询数据
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        rankingRange: this.rankingRange,
        examValue: this.examValue,
        gradeValue: this.gradeValue,
        majorValue: this.majorValue,
        classValue: this.classValue,
        choiceSubject: this.choiceSubject1,
      };
      const res = await getStuScoreClassRankList(params);
      if (res.code == 200) {
        this.tableData = res.data.studentScoresList;
        this.total = res.data.total;
        this.subjectChange();
      }
    },
    //选择课程
    choiceSubjectFunc() {
      this.getAverageScore();
      this.getClassNum();
      if (this.classValue != "") {
        this.getArea1TopData();
      }
    },
    //选择年级获得班级列表
    async choiceGrade() {
      this.classValue = "";
      this.getClassListBygradeId();
    },
    //通过年级获得班级列表
    async getClassListBygradeId() {
      const params = {
        gradeId: this.gradeValue,
      };
      const res = await getClassListBygradeId(params); // 获取班级列表
      if (res.code == 200) {
        this.classList = res.data;
      }
    },
    async getAverageScore() {
      //将考试，年级，专业（可为空），科目传过去
      const params = {
        examValue: this.examValue,
        gradeValue: this.gradeValue,
        majorValue: this.majorValue,
        choiceSubject: this.choiceSubject,
      };
      const res = await getAveTableData(params);
      if (res.code == 200) {
        this.AveTableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取基本信息
    async getsomeList() {
      const res2 = await getGradeList(); // 获取年级列表
      const res3 = await getMajorList(); // 获取专业列表
      const res4 = await getExamListks(); // 获取考试列表
      this.getClassListBygradeId();
      // if (res1.code == 200) {
      //   this.classIds = res1.data;
      // }
      if (res2.code == 200) {
        this.gradeList = res2.data;
        // this.gradeValue = this.gradeList[0];
      }
      if (res3.code == 200) {
        this.majors = res3.data;
      }
      if (res4.code == 200) {
        this.examinationList = res4.data;
        // this.examValue = this.examinationList[0];
      }
      this.getSubjectList();
      //请求平均分
      this.getAverageScore();
      this.getClassNum();
    },
    // 获取考试科目
    async getSubjectList() {
      const params = {
        examValue: this.examValue,
        gradeValue: this.gradeValue,
        majorValue: this.majorValue,
      };
      const res5 = await getSubjectListByExamNameAndGradeAndMajor(params); // 获取考试科目
      if (res5.code == 200) {
        this.examSubjects = res5.data;
        this.examSubjects.unshift("总分");
        this.choiceSubjectFunc();
      }
    },
    choiceClassFunc() {
      this.getArea1TopData();
      this.choiceExamOrGradeOrMajor();
    },
    async getArea1TopData() {
      //获取一个map<"考试名称"，"平均分">
      const params = {
        classValue: this.classValue,
        choiceSubject: this.choiceSubject,
      };
      const res = await getExamClassAve(params);
      if (res.code == 200) {
        this.examClassAve = res.data;
      }
    },
    choiceExamOrGradeOrMajor() {
      this.getSubjectList();
      //请求平均分
      this.getAverageScore();
      this.getClassNum();
    },
  },
};
</script>
  
  <style>
/* body {
    background-color: #edf0f5;
  } */
.el-main {
  /* background-color: #edf0f5; */
  background: linear-gradient(to bottom, #edf0f5, #24b8ff);
}
.selected-style {
  background-color: #409eff;
  color: #fff;
}

.ScoreBody {
  /* background-color: #edf0f5; */
}
.choiceTitle {
  font-family: 微软雅黑;
  color: rgb(0, 0, 0);
  font-size: 13px;
  font-style: normal;
  font-weight: normal;
  line-height: 28px;
  margin: 0 5px;
}
.choiceContent {
  width: 200px;
  margin-right: 20px;
}
.choiceName {
  display: flex;
}
.choiceMune {
  height: 40px;
  padding: 5px 0;
  display: flex;
  position: relative;
}
.realtime {
  position: absolute;
  right: 20px;
}
.basicInfo {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #fff;
  display: flex;
  padding: 0px 10px;
  margin-bottom: 10px;
}
.introduce {
  color: rgb(140, 140, 140);
  font-size: 12px;
  font-family: 微软雅黑;
}
.intvalue {
  color: rgb(0, 0, 0);
  font-size: 16px;
  font-family: 微软雅黑;
}
.Score {
  margin-right: 100px;
}
.exam_subjects {
  text-align: center;
}
.area1 {
  padding-top: 10px;
  height: 700px;
  display: flex;
  margin-bottom: 20px;
}
.area2 {
  height: 650px;
  display: flex;
  margin-bottom: 20px;
  background-color: aqua;
  padding-top: 10px;
}
.bottom {
  position: absolute;
  bottom: 0;
}
.top {
  position: absolute;
  top: 40px;
  padding: 10px;
}
.show-comt-box {
  background: linear-gradient(to right, white, #24b8ff);
  height: 80px;
  color: #fff;
  text-align: center;
  font-size: 20px;
  line-height: 80px;
}
/* 将滚动轴隐藏 */
.el-table--scrollable-y .el-table__body-wrapper {
  overflow: auto;
}
.el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  display: none;
}
.el-table__body-wrapper {
  overflow: auto;
}
.el-table__body-wrapper::-webkit-scrollbar {
  display: none;
}
</style>