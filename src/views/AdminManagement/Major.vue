<template>
  <div>
    <div style="margin: 10px 0">
      <div style="position: relative">
        <el-input
          v-model="searchString"
          placeholder="请输入专业名称"
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
            @click="addmajorFunc"
            :disabled="!authority.includes(1)"
            >新增 <i major="el-icon-circle-plus-outline"></i
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
              >批量删除 <i major="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
        </span>
      </div>
    </div>
    <!-- 搜索end -->

    <!-- 专业管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="majorId"
        label="专业ID"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="majorName"
        label="专业名称"
        width="220"
      ></el-table-column>
      <el-table-column
        prop="academicYear"
        label="学年"
        width="220"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="updatamajorfunc(scope.row)"
            :disabled="!authority.includes(3)"
            >编辑</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-edit" @click="updatamajorfunc(scope.row)" circle></el-button> -->
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="再想想"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="delmajor(scope.row.majorId)"
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

    <el-dialog title="新增专业" :visible.sync="addmajor">
      <el-form ref="majorform" :model="majorform" label-width="80px">
        <el-form-item label="专业id">
          <el-input
            v-model="majorform.majorId"
            placeholder="请输入专业ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="专业名称">
          <el-input
            v-model="majorform.majorName"
            placeholder="请输入专业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="学年">
          <el-input-number
            v-model="majorform.academicYear"
            :min="1"
            :max="10"
            label="请输入学年"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" major="dialog-footer">
        <el-button @click="addmajorsubmitoff">取 消</el-button>
        <el-button type="primary" @click="addmajorsubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改专业信息 -->
    <el-dialog title="修改专业信息" :visible.sync="updatamajor">
      <el-form ref="majorform" :model="majorform" label-width="80px">
        <el-form-item label="专业id">
          <el-input
            v-model="majorform.majorId"
            placeholder="请输入专业id"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="专业名称">
          <el-input
            v-model="majorform.majorName"
            placeholder="请输入专业名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="学年">
          <el-input-number
            v-model="majorform.academicYear"
            :min="1"
            :max="10"
            label="请输入学年"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" major="dialog-footer">
        <el-button @click="updatamajorsubmitoff">取 消</el-button>
        <el-button type="primary" @click="updatamajorsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import moment from "moment";
import { getmajorPage, updatamajor, deletemajor, addmajor } from "@/api/major";
import { getUserPermission } from "@/api/userpermission";
export default {
  name: "major",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      searchString: "",
      addmajor: false, //新增专业弹框
      updatamajor: false, //修改专业弹窗
      selectedId: [], //选中的列表id
      majorform: {
        majorId: "",
        majorName: "",
        academicYear: 0,
      },
      authority: [], //权限
    };
  },
  created() {
    //请求分页查询数据
    this.load();
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
      const res = await getmajorPage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
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

    handlecheckedsearchsChange() {
      this.searchContent = [];
    },

    //批量选中
    handleSelectionChange(val) {
      // [{},{}] =>[1,2,3]
      this.selectedId = val.map((element) => element.majorId);
    },

    //批量删除
    batchDeletion() {
      this.selectedId.forEach((id) => {
        this.delmajor(id);
      });
    },

    addmajorFunc() {
      this.majorform = {};
      this.addmajor = true;
    },
    addmajorsubmitoff() {
      this.majorform = {};
      this.userform = {};
      this.addmajor = false;
      this.load();
    },
    async addmajorsubmit() {
      this.addmajor = false;

      const res = await addmajor(this.majorform);
      if (res.code == 200) {
        this.$message.success("添加成功");
      } else {
        this.$message.error("添加失败");
      }
      this.load();
    },

    //删除专业
    async delmajor(id) {
      const res = await deletemajor(id);

      if (res.code == 200) {
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }

      this.load();
    },
    updatamajorfunc(row) {
      this.updatamajor = true;
      this.majorform = row;
    },
    updatamajorsubmitoff() {
      this.majorform = {};
      this.userform = {};
      this.updatamajor = false;
      this.load();
    },
    async updatamajorsubmit() {
      this.updatamajor = false;
      const res = await updatamajor(this.majorform);
      if (res.code == 200) {
        this.$message.success("修改成功");
      } else {
        this.$message.error("修改失败");
      }
    },
    handleSearch() {
      this.load();
      this.searchString = "";
    },
  },
};
</script>
  
<style scoped>
</style>