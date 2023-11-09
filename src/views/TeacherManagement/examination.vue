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
          <div v-if="check === searchs[2]">
            <el-select v-model="searchContent[index]" placeholder="请选择年级">
              <el-option
                v-for="(item, index) in grades"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div v-else-if="check === searchs[3]">
            <el-select v-model="searchContent[index]" placeholder="请选择专业">
              <el-option
                v-for="(item, index) in majors"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
          <div class="block" v-else-if="check === searchs[4]">
            <el-date-picker
              v-model="searchContent[index]"
              type="date"
              placeholder="请选择出生日期"
            >
            </el-date-picker>
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
        <el-button type="primary" @click="addExaminationFunc"
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
          action="http://localhost:9001/sms/admin/examination/import"
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

    <!-- 考试信息管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="考试编号" width="140"></el-table-column>
      <el-table-column
        prop="examName"
        label="考试名称"
        width="200"
      ></el-table-column>
      <el-table-column prop="examGrade" label="年级" width="80">
      </el-table-column>
      <el-table-column prop="examMajor" label="专业" width="160">
      </el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="120">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="updataExaminationfunc(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delExamination(scope.row.id)"
          >
            <el-button type="danger" size="mini" slot="reference"
              >删除</el-button
            >
            <!-- <el-button type="danger" slot="reference" icon="el-icon-delete" circle></el-button> -->
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加考试信息 -->
    <el-dialog title="新增考试" :visible.sync="addExamination">
      <el-form
        ref="examinationform"
        :model="examinationform"
        label-width="80px"
      >
        <el-form-item label="考试编号">
          <el-input
            v-model="examinationform.id"
            placeholder="请输入考试编号"
          ></el-input>
        </el-form-item>

        <el-form-item label="考试名称">
          <el-input
            v-model="examinationform.examName"
            placeholder="请输入考试名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="考试科目">
          <el-checkbox-group v-model="checkedcourses" :min="1">
            <el-checkbox
              v-for="course in courses"
              :label="course"
              :key="course"
              >{{ course }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="examinationform.examGrade"
            placeholder="请选择年级"
          >
            <el-option
              v-for="(item, index) in grades"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select
            v-model="examinationform.examMajor"
            placeholder="请选择专业"
          >
            <el-option
              v-for="(item, index) in majors"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="考试日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="examinationform.examDate"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addExaminationsubmitoff">取 消</el-button>
        <el-button type="primary" @click="addExaminationsubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改考试信息 -->
    <el-dialog title="修改考试" :visible.sync="updataExamination">
      <el-form
        ref="examinationform"
        :model="examinationform"
        label-width="80px"
      >
        <el-form-item label="考试编号">
          <el-input
            v-model="examinationform.id"
            placeholder="请输入考试编号"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="考试名称">
          <el-input
            v-model="examinationform.examName"
            placeholder="请输入考试名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="examinationform.examGrade"
            placeholder="请选择年级"
          >
            <el-option
              v-for="(item, index) in grades"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select
            v-model="examinationform.examMajor"
            placeholder="请选择专业"
          >
            <el-option
              v-for="(item, index) in majors"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="考试日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="examinationform.examDate"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataExaminationsubmitoff">取 消</el-button>
        <el-button type="primary" @click="updataExaminationsubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import moment from "moment";

import {
  getClassList,
  getGradeList,
  getClassListBygradeId,
  getMajorByclassId,
  getGradeByclassId,
} from "@/api/class";
import { getSubjectList } from "@/api/course";
import { getMajorList } from "@/api/major";
import {
  getExaminationPage,
  addExamination,
  removeExamination,
  updataExamination,
} from "@/api/examination";
export default {
  name: "Student",
  data() {
    const searchOptions = ["考试编号", "考试名称", "年级", "专业", "考试日期"];
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      courses: [], //科目集合
      checkedcourses: [], //选中的科目
      checkedsearchs: ["考试编号"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      searchString: "",
      addExamination: false, //新增考试弹框
      updataExamination: false, //修改学生弹窗
      examinationform: {
        id: "", //考试id
        examName: "", //考试名称
        examGrade: "", //考试年级
        examMajor: "", //考试专业
        examDate: "", //考试日期
      },
      selectedId: [], //选中的列表id
      grades: [],
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
      const res = await getExaminationPage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    // 获取年级、科目、专业等数据
    async getsomeList() {
      const res1 = await getSubjectList();
      const res2 = await getGradeList();
      const res3 = await getMajorList();
      if (res1.code == 200) {
        this.courses = res1.data;
      }
      if (res2.code == 200) {
        this.grades = res2.data;
      }
      if (res3.code == 200) {
        this.majors = res3.data;
      }
    },
    //取消添加考试信息
    addExaminationsubmitoff() {
      this.addExamination = false;
      this.examinationform = {};
    },
    //添加考试信息
    async addExaminationsubmit() {
      this.examinationform.examDate = moment(this.examinationform.examDate).add(1, 'day')
      const data = {
        examination: this.examinationform,
        courses: this.checkedcourses,
      };
      const res = await addExamination(data);
      if (res.code == 200) {
        this.$message.success("添加成功");
        this.addExaminationsubmitoff();
        this.load();
      } else {
        this.$message.error(res.msg);
      }
    },
    //打开更改考试信息窗口
    async updataExaminationfunc(row) {
      this.examinationform = row;
      this.updataExamination = true;
    },
    //取消更改考试信息
    updataExaminationsubmitoff() {
      this.examinationform = {};
      this.updataExamination = false;
    },
    //更新考试信息
    async updataExaminationsubmit() {
      const dateObj = new Date(this.examinationform.examDate);
      this.examinationform.examDate = dateObj.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const [year, month, day] = this.examinationform.examDate.split("/");
      this.examinationform.examDate = `${year}-${month}-${day}`;
      this.examinationform.examDate = moment(this.examinationform.examDate).add(1, 'day')
      let examination = this.examinationform;
      const res = await updataExamination(examination);
      if (res.code == 200) {
        this.$message.success("修改成功！");
      } else {
        this.$message.error("修改失败！");
      }
      this.updataExaminationsubmitoff();
      this.load();
    },
    handExcelleImportSuccess() {
      this.$message.success("导入成功");
      this.load();
    },
    handleExcelleImportError() {
      this.$message.error("导入失败");
      this.load();
    },
    //导出接口
    exportBtn() {
      // console.log("导出");
      window.open("http://localhost:9001/sms/admin/examination/export");
    },
    //重置
    reset() {
      this.handlecheckedsearchsChange();
      this.handleSearch();
      this.searchString = "";
      this.checkedsearchs = ["考试编号"];
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
    //将选中的科目变成空
    handlecheckedcoursesChange() {
      this.checkedcourses = [];
    },

    //批量选中
    handleSelectionChange(val) {
      // [{},{}] =>[1,2,3]
      this.selectedId = val.map((element) => element.id);
    },

    //批量删除
    batchDeletion() {
      this.selectedId.forEach((id) => {
        this.delExamination(id);
      });
    },
    async delExamination(id) {
      const res = await removeExamination(id);
      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }
      this.load();
    },

    //添加考试信息
    addExaminationFunc() {
      this.checkedcourses = [];
      this.examinationform = {};
      this.addExamination = true;
    },

    //搜索条件
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
                : "&exam_name=" + this.searchContent[index];
            break;
          case this.searchs[2]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&exam_grade=" + this.searchContent[index];
            break;
          case this.searchs[3]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&exam_major=" + this.searchContent[index];
            break;
          case this.searchs[4]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&exam_date=" + this.searchContent[index];
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