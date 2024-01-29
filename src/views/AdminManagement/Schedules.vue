<template>
  <div>
    <div style="margin: 10px 0">
      <div style="position: relative">
        <el-input
          v-model="searchString"
          placeholder="请输入课表名称"
          style="width: 200px"
        ></el-input>
        <el-button
          type="primary"
          style="margin-left: 5px"
          @click="handleSearch"
          :disabled="!authority.includes(4)"
          >搜索</el-button
        >
        <el-button type="warning" @click="reset">重置</el-button>
        <!-- 功能菜单 -->
        <span style="position: absolute; right: 0px; top: 0px">
          <el-button
            type="primary"
            @click="addscheduleFunc"
            :disabled="!authority.includes(1)"
            >新增 <i schedule="el-icon-circle-plus-outline"></i
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
              >批量删除 <i schedule="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
        </span>
      </div>
    </div>
    <!-- 搜索end -->

    <!-- 课表管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
      @expand-change="handleExpandChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="点击查看课表"
            placement="top"
          >
            <h2
              style="text-align: center; cursor: pointer"
              @click="getscheduleWorkList(scope.row.id)"
            >
              {{ scope.row.name }}
            </h2>
          </el-tooltip>

          <table class="schedule_table">
            <thead>
              <tr>
                <th>时间</th>
                <th>周一</th>
                <th>周二</th>
                <th>周三</th>
                <th>周四</th>
                <th>周五</th>
                <th>周六</th>
                <th>周天</th>
              </tr>
            </thead>
            <tbody>
              <!-- 课次 -->
              <tr v-for="n in 8" :key="n">
                <td style="width: 10px; text-align: center">第{{ n }}节课</td>
                <td v-for="m in 7" :key="m" class="schedule_td">
                  <div v-for="(item, index) in scheduleList" :key="index">
                    <div
                      v-if="item.week == m && item.section == n"
                      @click="updatascheduleInFoFunc(scope.row, item)"
                      style="cursor: pointer; margin-bottom: 10px"
                    >
                      <p>课程名称：{{ item.course }}</p>
                      <p>课程周次：{{ item.weekly }}</p>
                      <p>课程节次：第{{ item.section }}节</p>
                      <p>教室：{{ item.classroom }}</p>
                      <p>教师：{{ item.teacher }}</p>
                      <p>考试类型：{{item.type == 1 ? "考试" : "考察"}}</p>
                    </div>
                  </div>
                  <div class="add_sch">
                    <el-button
                      style="padding: 8px"
                      type="success"
                      icon="el-icon-check"
                      @click="savescheduleFunc(n, m, scope.row)"
                      >添加</el-button
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="课表ID" width="140"></el-table-column>
      <el-table-column
        prop="name"
        label="课表名称"
        width="220"
      ></el-table-column>
      <el-table-column prop="classs" label="班级" width="140"></el-table-column>
      <el-table-column prop="grade" label="年级" width="140"
        ><template slot-scope="scope">
          {{ gradeMenu[scope.row.grade - 1] }}
        </template></el-table-column
      >
      <el-table-column prop="stage" label="学期" width="140">
        <template slot-scope="scope">
          {{ scope.row.stage === 1 ? "上学期" : "下学期" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="updataschedulefunc(scope.row)"
            :disabled="!authority.includes(3)"
            >编辑</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit" @click="updataschedulefunc(scope.row)" circle></el-button> -->
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delschedule(scope.row.id)"
          >
            <el-button
              type="danger"
              size="mini"
              slot="reference"
              :disabled="!authority.includes(2)"
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

    <el-dialog title="新增课表" :visible.sync="addschedule">
      <el-form ref="scheduleform" :model="scheduleform" label-width="80px">
        <el-form-item label="课表id">
          <el-input
            v-model="scheduleform.id"
            placeholder="请输入课表ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="课表名称">
          <el-input
            v-model="scheduleform.name"
            placeholder="请输入课表名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级ID">
          <el-select
            v-model="scheduleform.classs"
            placeholder="请选择班级"
            @change="choiceClassFunc"
          >
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item"
              :value="item"
              :default-value="scheduleform.classs"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称">
          <div>{{ className }}</div>
        </el-form-item>
        <el-form-item label="年级阶段">
          <el-select v-model="scheduleform.grade" placeholder="请选择年级阶段">
            <el-option
              v-for="(item, index) in gradeMenu"
              :key="index"
              :label="item"
              :value="index + 1"
              :default-value="scheduleform.index + 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-radio v-model="scheduleform.stage" label="1">上学期</el-radio>
          <el-radio v-model="scheduleform.stage" label="2">下学期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" schedule="dialog-footer">
        <el-button @click="addschedulesubmitoff">取 消</el-button>
        <el-button type="primary" @click="addschedulesubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改课表信息 -->
    <el-dialog title="修改课表信息" :visible.sync="updataschedule">
      <el-form ref="scheduleform" :model="scheduleform" label-width="80px">
        <el-form-item label="课表id">
          <el-input
            v-model="scheduleform.id"
            placeholder="请输入课表id"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="课表名称">
          <el-input
            v-model="scheduleform.name"
            placeholder="请输入课表名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级ID">
          <el-select
            v-model="scheduleform.classs"
            placeholder="请选择班级"
            @change="choiceClassFunc"
          >
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item"
              :value="item"
              :default-value="scheduleform.classs"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称">
          <div>{{ className }}</div>
        </el-form-item>
        <el-form-item label="年级阶段">
          <el-select v-model="scheduleform.grade" placeholder="请选择年级阶段">
            <el-option
              v-for="(item, index) in gradeMenu"
              :key="index"
              :label="item"
              :value="index + 1"
              :default-value="scheduleform.index + 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-radio v-model="scheduleform.stage" label="1">上学期</el-radio>
          <el-radio v-model="scheduleform.stage" label="2">下学期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" schedule="dialog-footer">
        <el-button @click="updataschedulesubmitoff">取 消</el-button>
        <el-button type="primary" @click="updataschedulesubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 添加课表 -->
    <el-dialog title="添加课表信息" :visible.sync="savescheduleButton">
      <el-form
        ref="onescheduleform"
        :model="onescheduleform"
        label-width="80px"
      >
        <el-form-item label="课表id">
          <div>{{ onescheduleform.id }}</div>
        </el-form-item>
        <el-form-item label="课表名称">
          <div>{{ onescheduleform.name }}</div>
        </el-form-item>
        <el-form-item label="课程">
          <el-select
            v-model="onescheduleform.course"
            placeholder="请选择课程"
            @change="choiceCourseFunc"
          >
            <el-option
              v-for="(item, index) in subjectList"
              :key="index"
              :label="item"
              :value="item"
              :default-value="onescheduleform.course"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称">
          <div>{{ courseName }}</div>
        </el-form-item>
        <el-form-item label="课程周次">
          <el-checkbox-group
            v-model="weeklys"
            @change="handlecheckedsearchsChange"
          >
            <el-checkbox
              v-for="weekl in weeklyOptions"
              :label="weekl"
              :key="weekl"
              :disabled="disabledWeek().includes(weekl)"
              >{{ weekl }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="教室">
          <el-input
            v-model="onescheduleform.classroom"
            placeholder="请输入教室"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" schedule="dialog-footer">
        <el-button @click="saveschedulesubmitoff">取 消</el-button>
        <el-button type="primary" @click="saveschedulesubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改课表 -->
    <el-dialog title="添加课表信息" :visible.sync="updatascheduleInFoButton">
      <el-form
        ref="onescheduleform"
        :model="onescheduleform"
        label-width="80px"
      >
        <el-form-item label="课表id">
          <div>{{ onescheduleform.id }}</div>
        </el-form-item>
        <el-form-item label="课表名称">
          <div>{{ onescheduleform.name }}</div>
        </el-form-item>
        <el-form-item label="课程">
          <el-select
            v-model="onescheduleform.course"
            placeholder="请选择课程"
            @change="choiceCourseFunc"
          >
            <el-option
              v-for="(item, index) in subjectList"
              :key="index"
              :label="item"
              :value="item"
              :default-value="onescheduleform.course"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称">
          <div>{{ courseName }}</div>
        </el-form-item>
        <el-form-item label="课程周次">
          <el-checkbox-group
            v-model="weeklys"
            @change="handlecheckedsearchsChange"
          >
            <el-checkbox
              v-for="weekl in weeklyOptions"
              :label="weekl"
              :key="weekl"
              >{{ weekl }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="教室">
          <el-input
            v-model="onescheduleform.classroom"
            placeholder="请输入教室"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" schedule="dialog-footer">
        <el-button type="danger" @click="deleteScheduleInFo(onescheduleform)"
          >删除</el-button
        >
        <el-button @click="updatascheduleInFosubmitoff">取 消</el-button>
        <el-button type="primary" @click="updatascheduleInFosubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
    
    <script>
import moment from "moment";
import {
  getschedulePage,
  updataschedule,
  deleteschedule,
  addschedule,
  saveschedule,
  getscheduleWorkList,
  updatascheduleInFo,
  deleteScheduleInFo,
} from "@/api/schedule";
import {
  getCourseIdList,
  getCourseNameById,
  getCourseIdByName,
} from "@/api/course";
import { getUserPermission } from "@/api/userpermission";
import {
  getClassIdList,
  getClassNameById,
  getClassIdbyName,
} from "@/api/class";
export default {
  name: "schedule",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      searchString: "",
      addschedule: false, //新增课表弹框
      updataschedule: false, //修改课表弹窗
      selectedId: [], //选中的列表id
      savescheduleButton: false,
      updatascheduleInFoButton: false,
      className: "",
      courseName: "", //课程名称
      oldData: {},
      classList: [],
      subjectList: [],
      weeklyOptions: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      ],
      gradeMenu: [
        "一年级",
        "二年级",
        "三年级",
        "四年级",
        "五年级",
        "六年级",
        "初一",
        "初二",
        "初三",
        "高一",
        "高二",
        "高三",
        "大一",
        "大二",
        "大三",
        "大四",
      ],
      teachers: [],
      weeklys: [],
      scheduleform: {
        id: "",
        name: "",
        classs: "",
        grade: -1,
        stage: 1,
      },
      onescheduleform: {
        id: "",
        course: "",
        week: 0,
        weekly: [],
        section: 0,
        classroom: "",
      },
      authority: [], //权限
      scheduleList: [
        // {
        //   course: "java",
        //   week: 2,
        //   weekly: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        //   section: 1,
        //   classroom: "101",
        //   teacher: "里斯",
        // },
        // {
        //   course: "python",
        //   week: 2,
        //   weekly: [15, 16],
        //   section: 1,
        //   classroom: "102",
        //   teacher: "里斯",
        // },
      ], //课表
    };
  },
  created() {
    //请求分页查询数据
    this.load();
    //获取班级、课程列表
    this.getDataListFunc();
    //获取权限
    this.getauthority();
  },
  methods: {
    async load() {
      this.tableData = [];
      //请求分页查询数据
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchString: this.searchString,
      };
      const res = await getschedulePage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },
    handleExpandChange(row, expandedRows) {
      this.scheduleList=[]
      this.getscheduleWorkList(row.id);
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
    //选择课程
    async choiceCourseFunc() {
      //通过课程id获取课程名称
      const res = await getCourseNameById(this.onescheduleform.course);
      if (res.code == 200) {
        this.courseName = res.data;
      }
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
    //获取班级、课程列表
    async getDataListFunc() {
      //获取班级列表
      const res = await getClassIdList();
      //获取课程列表
      const res1 = await getCourseIdList();
      if (res1.code == 200) {
        this.subjectList = res1.data;
      }
      if (res.code == 200) {
        this.classList = res.data;
      }
    },
    //通过班级id获取班级名称
    async choiceClassFunc() {
      const res = await getClassNameById(this.scheduleform.classs);
      if (res.code == 200) {
        this.className = res.data;
      }
    },
    handlecheckedsearchsChange() {
      this.searchContent = [];
      this.onescheduleform.weekly = [];
    },

    //批量选中
    handleSelectionChange(val) {
      // [{},{}] =>[1,2,3]
      this.selectedId = val.map((element) => element.id);
    },

    //批量删除
    batchDeletion() {
      this.selectedId.forEach((id) => {
        this.delschedule(id);
      });
    },

    //添加课表
    addscheduleFunc() {
      this.scheduleform = {};
      this.className = "";
      this.addschedule = true;
    },
    //修改课表内容按钮
    updatascheduleInFoFunc(row, item) {
      this.onescheduleform = {};
      this.weeklys = [];
      this.courseName = "";
      this.onescheduleform = item;
      this.onescheduleform.id = row.id;
      this.onescheduleform.name = row.name;
      this.courseName = item.course;
      this.getCourseIdByName(item.course);
      this.weeklys = this.onescheduleform.weekly;
      this.oldData = {
        scheduleId: this.onescheduleform.id,
        section: this.onescheduleform.section,
        week: this.onescheduleform.week,
        weekly: this.weeklys,
        classroom: this.onescheduleform.classroom,
        course: this.onescheduleform.course,
      };
      this.updatascheduleInFoButton = true;
    },
    //添加课表取消按钮
    addschedulesubmitoff() {
      this.scheduleform = {};
      this.userform = {};
      this.addschedule = false;
      this.load();
    },
    //添加课表内容取消按钮
    saveschedulesubmitoff() {
      this.onescheduleform = {};
      this.weeklys = [];
      this.savescheduleButton = false;
      this.load();
    },
    //修改课表内容取消按钮
    updatascheduleInFosubmitoff() {
      this.onescheduleform = {};
      this.weeklys = [];
      this.updatascheduleInFoButton = false;
      // this.load();
    },
    //添加课表
    async addschedulesubmit() {
      this.addschedule = false;
      const res = await addschedule(this.scheduleform);
      if (res.code == 200) {
        this.$message.success("添加成功");
      } else {
        this.$message.error("添加失败");
      }
      this.load();
    },
    //获取课表内容
    async getscheduleWorkList(id) {
      // 在这里编写你的扩展按钮触发的方法逻辑
      const res = await getscheduleWorkList(id);
      if (res.code == 200) {
        this.scheduleList = res.data;
      }
    },
    //通过课程名称获取课程id
    async getCourseIdByName(course) {
      const res = await getCourseIdByName(course);
      if (res.code == 200) {
        this.onescheduleform.course = res.data;
      }
    },
    //保存课表内容信息
    async saveschedulesubmit() {
      this.savescheduleButton = false;

      const data = {
        scheduleId: this.onescheduleform.id,
        section: this.onescheduleform.section,
        week: this.onescheduleform.week,
        weekly: this.weeklys,
        classroom: this.onescheduleform.classroom,
        course: this.onescheduleform.course,
      };
      console.log(data);
      const res = await saveschedule(data);
      if (res.code == 200) {
        this.$message.success("添加成功");
      } else {
        this.$message.error(res.mes);
      }
      this.weeklys = [];
      this.getscheduleWorkList(this.onescheduleform.id);
    },
    //删除课表内容
    async deleteScheduleInFo(data) {
      data.course = this.courseName;
      // console.log(data);

      const res = await deleteScheduleInFo(data);
      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }
      this.updatascheduleInFoButton = false;
      this.getscheduleWorkList(data.id);
    },
    //修改课表内容信息
    async updatascheduleInFosubmit() {
      this.updatascheduleInFoButton = false;

      const data = {
        scheduleId: this.onescheduleform.id,
        section: this.onescheduleform.section,
        week: this.onescheduleform.week,
        weekly: this.weeklys,
        classroom: this.onescheduleform.classroom,
        course: this.onescheduleform.course,
      };
      const resdel = await deleteScheduleInFo(this.oldData);
      if (resdel.code == 200) {
        const res = await saveschedule(data);
        if (res.code == 200) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.mes);
        }
      }

      this.weeklys = [];
      this.oldData = {};
      this.getscheduleWorkList(this.onescheduleform.id);
    },

    //删除课表
    async delschedule(id) {
      const res = await deleteschedule(id);

      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }

      this.load();
    },
    disabledWeek() {
      let allWeeklyValues = [];
      this.scheduleList.forEach((element) => {
        if (
          this.onescheduleform.week == element.week &&
          this.onescheduleform.section == element.section
        ) {
          allWeeklyValues = allWeeklyValues.concat(element.weekly);
        }
      });

      return allWeeklyValues;
    },
    //添加课表内容按钮
    savescheduleFunc(n, m, row) {
      this.onescheduleform = {};
      this.weeklys = [];
      this.courseName = "";
      this.onescheduleform.id = row.id;
      this.onescheduleform.name = row.name;
      this.onescheduleform.week = m;
      this.onescheduleform.section = n;
      this.savescheduleButton = true;
    },
    //确认修改课表内容按钮
    async updataschedulefunc(row) {
      //通过班级名称获取班级id
      const res = await getClassIdbyName(row.classs);
      row.classs = res.data;
      this.scheduleform = row;
      this.choiceClassFunc();
      this.updataschedule = true;
    },
    //修改课表按钮
    updataschedulesubmitoff() {
      this.scheduleform = {};
      this.userform = {};
      this.updataschedule = false;
      this.load();
    },
    //修改课表
    async updataschedulesubmit() {
      this.updataschedule = false;
      const res = await updataschedule(this.scheduleform);
      if (res.code == 200) {
        this.$message.success("修改成功");
      } else {
        this.$message.error("修改失败");
      }
      this.load();
    },
    handleSearch() {
      this.load();
      this.scheduleList = [];
      this.searchString = "";
    },
  },
};
</script>
    
  <style scoped>
.schedule_table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.schedule_td {
  width: 12%;
}
.add_sch {
  cursor: pointer;
  text-align: center;
}
</style>