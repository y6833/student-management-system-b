<!-- 年级成绩看板 -->
<template>
  <div class="bodys">
    <!-- 标题 -->
    <div id="drag_hzln3vphjq" class="show-comt-box">
      <span style="font-family: '华文琥珀'; font-size: 32px">学生成绩看板</span>
    </div>
    <div class="ScoreBody">
      <div class="choiceMune">
        <!-- 考试 -->
        <div class="choiceName">
          <div class="choiceTitle">考试场次:</div>
          <div class="choiceContent">
            {{ examValue }}
          </div>
        </div>
        <!-- 学生-->
        <div class="choiceName">
          <div class="choiceTitle">学生:</div>
          <div class="choiceContent">
            {{ studentName }}
          </div>
        </div>
        <!-- 实时时间 -->
        <Realtime class="realtime"></Realtime>
      </div>

      <!-- 基本信息 -->
      <div class="basicInfo">
        <div class="basicInfoLeft">
          <div class="studentAvatar">
            <el-image
              class="studentImg"
              :src="defaultAvatar"
              :preview-src-list="[defaultAvatar]"
              fit="fill"
            ></el-image>
          </div>
        </div>

        <div class="basicInfoRight">
          <div
            class="grade_bar"
            v-for="(item, index) in subRankList"
            :key="index"
          >
            <div>
              <span class="gradeBar_Name">{{ item.course }}</span>
              <span class="gradeBar_score">{{ item.subject }}</span>
            </div>
            <div>
              <span class="gradeBar_Name">班级排名</span>
              <span class="gradeBar_ClassRanking">{{ item.classRangk }}</span>
            </div>
            <div>
              <span class="gradeBar_Name">年级排名</span>
              <span class="gradeBar_GradeRanking">{{ item.gradeRangk }}</span>
            </div>
          </div>
        </div>
        <div class="Chartbar">
          <StudentRadarChart class="chart" :subRankList="subRankList" :examValue="examValue" />
        </div>
      </div>
      <!-- 区域一 -->
      <div class="area1" style="background-color: #fff">
        <!-- 考试科目选择区域 -->
        <div class="exam_subjects">
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
          <el-radio-group v-model="choiceSubject" size="mini">
            <el-radio-button
              v-for="subject in examSubjects"
              :key="subject"
              :label="subject"
            ></el-radio-button>
          </el-radio-group>
        </div>
        <!-- 图一 -->
        <div class="subject_class_Ranking">
          <RankingPreviousExamsChart
            :choiceSubject="choiceSubject"
            :studentValue="studentValue"
            :examValue="examValue"
          />
        </div>
        <!-- 图二 -->
        <div class="grade_score_range">
          <PreviousExamScores
            :choiceSubject="choiceSubject"
            :studentValue="studentValue"
            :examValue="examValue"
          />
        </div>
      </div>

      <!-- 区域二 -->
      <div
        class="area2"
        style="background-color: #fff; width: 100%; position: relative"
      >
        <ExamcompareChart :studentValue="studentValue" :examValue="examValue" />
      </div>
    </div>
  </div>
</template>
    
    <script>
import {
  getSubRank,
  getSubjectListByExamNameAndGradeAndMajor,
} from "@/api/scores";
import { getStuById } from "@/api/student";
import { getUser } from "@/api/user";
import RankingPreviousExamsChart from "@/components/fig/RankingPreviousExamsChart.vue";
import ExamcompareChart from "@/components/fig/ExamcompareChart.vue";
import StudentRadarChart from "@/components/fig/StudentRadarChart.vue";
import PreviousExamScores from "@/components/fig/PreviousExamScores.vue";

import Realtime from "@/components/Realtime.vue";

export default {
  components: {
    Realtime,
    ExamcompareChart,
    StudentRadarChart,
    RankingPreviousExamsChart,
    PreviousExamScores,
  },
  data() {
    return {
      defaultAvatar: "http://localhost:9001/sms/file/9df4588dcb844f63b657dd6b95f9379a.jpg",
      examValue: "", //考试名称
      studentValue: "", //学生id
      studentName: "", //学生姓名
      choiceSubject: "总分", //选择的科目，默认为空
      TableData: [], //各班级科目的平均成绩列表
      examSubjects: [], //考试科目列表
      subRankList: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      student: {},
    };
  },
  created() {
    this.getURLData();
    this.getSubRank();
  },
  methods: {
    getURLData() {
      // 获取URL中的查询字符串
      const queryString = window.location.search;

      // 使用URLSearchParams对象解析查询字符串
      const urlParams = new URLSearchParams(queryString);

      // 获取exam和grade的值
      const exam = urlParams.get("exam");
      const studentId = urlParams.get("studentId");
      this.studentValue = studentId;
      this.examValue = exam;
      this.getStudentNameById(this.studentValue);
      this.getStudentAvatarById(this.studentValue);
    },
    async getStudentAvatarById(id) {
      //获取用户信息
      const params = {
        id: id,
      };
      const res = await getUser(params);
      if (res.code == 200) {
        this.defaultAvatar = res.data.avatar;
      }
    },
    async getStudentNameById(id) {
      const res = await getStuById(id);
      if (res.code == 200) {
        this.student = res.data;
        this.studentName = res.data.name;
        this.getSubjectList();
      }
    },
    async getSubRank() {
      const params = {
        examValue: this.examValue,
        studentValue: this.studentValue,
      };
      const res = await getSubRank(params);
      if (res.code == 200) {
        this.subRankList = res.data;
      }
    },
    //选择考试
    async getSubjectList() {
      const params = {
        examValue: this.examValue,
        gradeValue: this.student.grade,
        majorValue: this.student.major,
      };
      const res5 = await getSubjectListByExamNameAndGradeAndMajor(params); // 获取考试科目
      if (res5.code == 200) {
        this.examSubjects = res5.data;
        this.examSubjects.unshift("总分");
      }
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
  min-width: 150px;
  line-height: 27px;
  font-family: "楷体";
  font-size: 24px;
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
  height: 400px;
  line-height: 40px;
  font-size: 14px;
  background-color: #fff;
  display: flex;
  padding-right: 10px;
  margin-bottom: 10px;
  position: relative;
}
.Chartbar {
  right: 0;
  position: absolute;
  width: 30%;
  background-color: aqua;
  height: 100%;
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
  height: 770px;
  margin-bottom: 20px;
}
.area2 {
  height: 340px;
  display: flex;
  margin-bottom: 20px;
  background-color: aqua;
  padding-top: 10px;
}
.area3 {
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
.studentImg {
  width: 100%;
  height: 100%;
}
.studentAvatar {
  height: 100%;
  width: 100%;
}

.basicInfoRight {
  column-count: 2; /* 将容器分成两列 */
  column-gap: 20px; /* 设置列之间的间距为20像素 */
  padding: 10px;
}

.grade_bar {
  padding: 5px 15px;
  margin-bottom: 10px;
  background-color: #f5f9fc;
  width: 350px;
  display: flex;
  justify-content: space-between;
}
.gradeBar_Name {
  color: #8c9abb;
  margin-right: 10px;
}
.gradeBar_score {
  color: #000;
}
.gradeBar_ClassRanking {
  color: #f0bd72;
}
.GradeRanking {
  color: red;
}
</style>