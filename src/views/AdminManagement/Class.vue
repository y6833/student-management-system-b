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
          @click="addclassFunc"
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
          action="http://localhost:9001/sms/admin/classs/import"
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

    <!-- 班级管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="classId"
        label="班级ID"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="className"
        label="班级名称"
        width="100"
      ></el-table-column>
      <el-table-column prop="gradeId" label="年级" width="80">
      </el-table-column>
      <el-table-column prop="majorId" label="专业" width="160">
      </el-table-column>
      <el-table-column prop="headTeacherId" label="班主任ID" width="100">
      </el-table-column>
      <el-table-column prop="teacherName" label="班主任名称" width="160">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="phone" label="手机号" width="140">
      </el-table-column>
      <el-table-column prop="address" label="地址" width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="updataclassfunc(scope.row)"
            :disabled="!authority.includes(3)"
            >编辑</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit" @click="updataclassfunc(scope.row)" circle></el-button> -->
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delclass(scope.row.classId)"
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

    <el-dialog title="新增班级" :visible.sync="addclass">
      <el-form ref="classform" :model="classform" label-width="80px">
        <el-form-item label="班级id">
          <el-input
            v-model="classform.classId"
            placeholder="请输入班级ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input
            v-model="classform.className"
            placeholder="请输入班级名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="班主任ID">
          <el-input
            v-model="classform.headTeacherId"
            placeholder="请输入ID"
          ></el-input>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="classform.gradeId"
            placeholder="请选择年级"
            @change="choiceGradeFunc"
          >
            <el-option
              v-for="(item, index) in grades"
              :key="index"
              :label="item"
              :value="item"
              :default-value="classform.gradeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="classform.majorId" placeholder="请选择专业">
            <el-option
              v-for="(item, index) in majors"
              :key="index"
              :label="item"
              :value="item"
              :default-value="classform.majorId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addclasssubmitoff">取 消</el-button>
        <el-button type="primary" @click="addclasssubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改班级信息 -->
    <el-dialog title="修改班级信息" :visible.sync="updataclass">
      <el-form ref="classform" :model="classform" label-width="80px">
        <el-form-item label="班级id">
          <el-input
            v-model="classform.classId"
            placeholder="请输入学号"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input
            v-model="classform.className"
            placeholder="请输入班级名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="班主任ID">
          <el-input
            v-model="classform.headTeacherId"
            placeholder="请输入ID"
          ></el-input>
        </el-form-item>

        <el-form-item label="年级">
          <el-select
            v-model="classform.gradeId"
            placeholder="请选择年级"
            @change="choiceGradeFunc"
          >
            <el-option
              v-for="(item, index) in grades"
              :key="index"
              :label="item"
              :value="item"
              :default-value="classform.gradeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="classform.majorId" placeholder="请选择专业">
            <el-option
              v-for="(item, index) in majors"
              :key="index"
              :label="item"
              :value="item"
              :default-value="classform.majorId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataclasssubmitoff">取 消</el-button>
        <el-button type="primary" @click="updataclasssubmit">确 定</el-button>
      </div>
    </el-dialog>
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
  getclassPage,
  addClass,
  updataClass,
  removeclass,
} from "@/api/class";
import { getMajorList } from "@/api/major";
import { getTeacherByRoleId } from "@/api/teacher";
import { getUserPermission } from "@/api/userpermission";
export default {
  name: "class",
  data() {
    const searchOptions = [
      "班级id", //0
      "班级名称", //1
      "年级", //2
      "专业", //3
      "班主任", //4
    ];
    return {
      tableData: [],
      tableData1: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      checkedsearchs: ["班级id"], //选择的条件
      searchs: searchOptions,
      searchContent: [], //输入的条件
      searchString: "",
      addclass: false, //新增班级弹框
      updataclass: false, //修改班级弹窗
      selectedId: [], //选中的列表id
      classform: {
        classId: "",
        className: "",
        headTeacherId: "",
        gradeId: "",
        majorId: "",
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
    async load() {
      this.tableData = [];
      //请求分页查询数据
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchString: this.searchString,
      };
      const res = await getclassPage(params);
      if (res.code == 200) {
        this.tableData1 = res.data.records;
        this.total = res.data.total;
        // 根据教师id获取教师信息并重新渲染页面
        this.getTeachersAndRender();
      }
    },
    //根据教师id获取教师信息并重新渲染页面
    async getTeachersAndRender() {
      for (const item of this.tableData1) {
        const res = await getTeacherByRoleId(item.headTeacherId);
        if (res.code == 200) {
          item.teacherName = res.data.name;
          item.email = res.data.email;
          item.phone = res.data.phone;
          item.address = res.data.address;
        }
      }
      // 重新渲染页面的逻辑，例如更新表格数据等
      this.renderTable();
    },
    renderTable(){
      this.tableData = this.tableData1
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
      window.open("http://localhost:9001/sms/admin/classs/export");
    },
    reset() {
      this.checkedsearchs = ["班级id"];
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
        this.delclass(id);
      });
    },
    //选择年级
    async choiceGradeFunc() {
      const params = {
        gradeId: this.classform.grade,
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
        classId: this.classform.classId,
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
    addclassFunc() {
      this.classform = {};
      //调用接口获得年级、班级、专业列表
      this.getsomeList();

      this.addclass = true;
    },
    addclasssubmitoff() {
      this.classform = {};
      this.userform = {};
      this.addclass = false;
      this.load();
    },
    async addclasssubmit() {
      this.addclass = false;
      console.log(this.classform);
      const res = await addClass(this.classform);
      if (res.code == 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      this.load();
    },

    //删除班级
    async delclass(id) {
      const res = await removeclass(id);

      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }

      this.load();
    },
    updataclassfunc(row) {
      this.updataclass = true;
      this.classform = row;
    },
    updataclasssubmitoff() {
      this.classform = {};
      this.userform = {};
      this.updataclass = false;
      this.load();
    },
    async updataclasssubmit() {
      this.updataclass = false;
      const res = await updataClass(this.classform);
      if (res.code == 200) {
        this.$message.success("修改成功");
      } else {
        this.$message.error("修改失败");
      }
    },
    handleSearch() {
      this.searchString = "";
      for (let index = 0; index < this.checkedsearchs.length; index++) {
        switch (this.checkedsearchs[index]) {
          case this.searchs[0]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&class_id=" + this.searchContent[index];
            break;
          case this.searchs[1]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&class_name=" + this.searchContent[index];
            break;
          case this.searchs[4]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&head_teacher_id=" + this.searchContent[index];
            break;
          case this.searchs[2]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&grade_id=" + this.searchContent[index];
            break;
          case this.searchs[3]:
            this.searchString +=
              this.searchContent[index] === undefined
                ? ""
                : "&major_id=" + this.searchContent[index];
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