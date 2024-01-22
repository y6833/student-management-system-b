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
          <el-input
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
          @click="addcourseFunc"
          :disabled="!authority.includes(1)"
          >新增 <i course="el-icon-circle-plus-outline"></i
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
            >批量删除 <i course="el-icon-remove-outline"></i
          ></el-button>
        </el-popconfirm>
      </div>
    </div>
    <!-- 搜索end -->

    <!-- 课程管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="courseId"
        label="课程ID"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="课程名称"
        width="100"
      ></el-table-column>
      <el-table-column prop="teacher" label="教师名称" width="80">
      </el-table-column>
      <el-table-column prop="teacherId" label="教师ID" width="160">
      </el-table-column>
      <el-table-column prop="fullmarks" label="满分" width="100">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="160">
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? "考试" : "考察"}}
        </template></el-table-column
      >
      <el-table-column prop="remark" label="备注" width="160">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="updatacoursefunc(scope.row)"
            :disabled="!authority.includes(3)"
            >编辑</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit" @click="updatacoursefunc(scope.row)" circle></el-button> -->
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delcourse(scope.row.courseId)"
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

    <el-dialog title="新增课程" :visible.sync="addcourse">
      <el-form ref="courseform" :model="courseform" label-width="80px">
        <el-form-item label="课程id">
          <el-input
            v-model="courseform.courseId"
            placeholder="请输入课程ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input
            v-model="courseform.name"
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="教师ID">
          <el-select
            v-model="courseform.teacherId"
            placeholder="请选择教师"
            @change="choiceTeacherFunc"
          >
            <el-option
              v-for="(item, index) in teachers"
              :key="index"
              :label="item"
              :value="item"
              :default-value="courseform.teacherId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师姓名">
          <div>{{ teacherName }}</div>
        </el-form-item>
        <el-form-item label="满分">
          <el-input
            v-model="courseform.fullmarks"
            placeholder="请输入课程满分"
          ></el-input>
        </el-form-item>
        <el-form-item label="模式">
          <el-radio v-model="courseform.type" label="1">考试</el-radio>
          <el-radio v-model="courseform.type" label="0">考查</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="courseform.remark"
            placeholder="请输入课程信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" course="dialog-footer">
        <el-button @click="addcoursesubmitoff">取 消</el-button>
        <el-button type="primary" @click="addcoursesubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改课程信息 -->
    <el-dialog title="修改课程信息" :visible.sync="updatacourse">
      <el-form ref="courseform" :model="courseform" label-width="80px">
        <el-form-item label="课程id">
          <el-input
            v-model="courseform.courseId"
            placeholder="请输入课程ID"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input
            v-model="courseform.name"
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="教师ID">
          <el-select
            v-model="courseform.teacherId"
            placeholder="请选择教师"
            @change="choiceTeacherFunc"
          >
            <el-option
              v-for="(item, index) in teachers"
              :key="index"
              :label="item"
              :value="item"
              :default-value="courseform.teacherId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师姓名">
          <div>{{ teacherName }}</div>
        </el-form-item>
        <el-form-item label="满分">
          <el-input
            v-model="courseform.fullmarks"
            placeholder="请输入课程满分"
          ></el-input>
        </el-form-item>
        <el-form-item label="模式">
          <el-radio v-model="courseform.type" label="1">考试</el-radio>
          <el-radio v-model="courseform.type" label="0">考查</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="courseform.remark"
            placeholder="请输入课程信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" course="dialog-footer">
        <el-button @click="updatacoursesubmitoff">取 消</el-button>
        <el-button type="primary" @click="updatacoursesubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import moment from "moment";
import {
  getcoursePage,
  addcourse,
  updatacourse,
  deletecourse,
} from "@/api/course";
import {
  getTeacherByRoleId,
  getTeacherList,
  getTeacherNameById,
} from "@/api/teacher";
import { getUserPermission } from "@/api/userpermission";
export default {
  name: "course",
  data() {
    const searchOptions = [
      "课程id", //0
      "课程名称", //1
      "课程教师", //2
      "教师id", //3
    ];
    return {
      tableData: [],
      tableData1: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      checkedsearchs: ["课程id"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      searchString: "",
      addcourse: false, //新增课程弹框
      updatacourse: false, //修改课程弹窗
      selectedId: [], //选中的列表id
      courseform: {
        courseId: "",
        name: "",
        teacher: "",
        teacherId: "",
        fullmarks: "",
        remark: "",
        type: -1, // 1表示考试，0表示考察
      },
      authority: [], //权限
      teachers: [],
      teacherName: "",
    };
  },

  created() {
    //请求分页查询数据
    this.load();
    //获取教师列表
    this.getTeacherList();
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
      const res = await getcoursePage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
    },

    async getTeacherList() {
      const res = await getTeacherList();
      if (res.code == 200) {
        this.teachers = res.data;
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
    reset() {
      this.checkedsearchs = ["课程id"];
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
      console.log(val);
      this.selectedId = val.map((element) => element.courseId);
    },

    //批量删除
    batchDeletion() {
      this.selectedId.forEach((id) => {
        this.delcourse(id);
      });
    },

    addcourseFunc() {
      this.teacherName = "";
      this.courseform = {};
      this.addcourse = true;
    },
    addcoursesubmitoff() {
      this.courseform = {};
      this.userform = {};
      this.addcourse = false;
      this.load();
    },
    //添加课程
    async addcoursesubmit() {
      this.addcourse = false;
      const res = await addcourse(this.courseform);
      if (res.code == 200) {
        this.$message.success("添加成功");
      } else {
        this.$message.error("添加失败");
      }
      this.load();
    },

    //删除课程
    async delcourse(id) {
      const res = await deletecourse(id);

      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }

      this.load();
    },
    updatacoursefunc(row) {
      this.updatacourse = true;
      this.courseform = row;
      this.choiceTeacherFunc();
    },
    //选择教师
    async choiceTeacherFunc() {
      const res = await getTeacherNameById(this.courseform.teacherId);
      if (res.code == 200) {
        this.teacherName = res.data;
        this.courseform.teacher = this.teacherName;
      }
    },
    updatacoursesubmitoff() {
      this.courseform = {};
      this.userform = {};
      this.updatacourse = false;
      this.load();
    },
    //修改课程
    async updatacoursesubmit() {
      this.updatacourse = false;
      const res = await updatacourse(this.courseform);
      if (res.code == 200) {
        this.$message.success("修改成功");
      } else {
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
                : "&course_id=" + this.searchContent[index];
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
                : "&teacher=" + this.searchContent[index];
            break;
          case this.searchs[3]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&teacher_id=" + this.searchContent[index];
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