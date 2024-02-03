<template>
  <div>
    <!-- 搜索 start-->
    <div style="margin: 10px 0; position: relative">
      <div style="display: flex">
        <el-input
          v-model="searchString"
          placeholder="请输入用户编号"
          suffix-icon="el-icon-search"
        ></el-input>

        <el-button type="primary" style="margin-left: 5px" @click="load"
          >搜索</el-button
        >
        <el-button type="warning" @click="reset">重置</el-button>
      </div>
    </div>
    <!-- 搜索end -->

    <!-- 用户权限管理 -->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="userId"
        label="用户编号"
        width="140"
      ></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column
        prop="identity"
        label="身份"
        width="100"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="display: flex">
            <div
              class="permission"
              :class="
                scope.row.permission.includes(1)
                  ? 'permissionOn'
                  : 'permissionOff'
              "
              @click="
                updataPermission(
                  scope.row.userId,
                  1,
                  scope.row.permission.includes(1)
                )
              "
            >
              增加
            </div>
            <div
              class="permission"
              :class="
                scope.row.permission.includes(2)
                  ? 'permissionOn'
                  : 'permissionOff'
              "
              @click="
                updataPermission(
                  scope.row.userId,
                  2,
                  scope.row.permission.includes(2)
                )
              "
            >
              删除
            </div>
            <div
              class="permission"
              :class="
                scope.row.permission.includes(3)
                  ? 'permissionOn'
                  : 'permissionOff'
              "
              @click="
                updataPermission(
                  scope.row.userId,
                  3,
                  scope.row.permission.includes(3)
                )
              "
            >
              修改
            </div>
            <div
              class="permission"
              :class="
                scope.row.permission.includes(4)
                  ? 'permissionOn'
                  : 'permissionOff'
              "
              @click="
                updataPermission(
                  scope.row.userId,
                  4,
                  scope.row.permission.includes(4)
                )
              "
            >
              查看
            </div>
            <div
              class="permission"
              :class="
                scope.row.permission.includes(5)
                  ? 'permissionOn'
                  : 'permissionOff'
              "
              @click="
                updataPermission(
                  scope.row.userId,
                  5,
                  scope.row.permission.includes(5)
                )
              "
            >
              导入
            </div>
            <div
              class="permission"
              :class="
                scope.row.permission.includes(6)
                  ? 'permissionOn'
                  : 'permissionOff'
              "
              @click="
                updataPermission(
                  scope.row.userId,
                  6,
                  scope.row.permission.includes(6)
                )
              "
            >
              导出
            </div>
          </div>
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
  </div>
</template>
  
  <script>
import moment from "moment";
import { getPermissionList,deletePermission,addUserPermission } from "@/api/userpermission";

export default {
  name: "Student",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 2,
      searchString: "",
      selectedId: [], //选中的列表id
    };
  },
  created() {
    //请求分页查询数据
    this.load();
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
      const res = await getPermissionList(params);
      if (res.code == 200) {
        this.tableData = res.data.userPermissionDTOList;
        this.total = res.data.total;
      }
    },

     async updataPermission(userId, permission, isPermission) {
      // console.log(userId, permission, isPermission);
      const props = {
        userId: userId,
        permissionId:permission
      }
        if(isPermission){
            //删除
            const res = await deletePermission(props);
            if(res.code != 200){
                this.$message.error("修改失败");
            }
        }else{
            //添加
            const res = await addUserPermission(props);
            if(res.code != 200){
                this.$message.error("修改失败");
            }
            
        }
        this.load();
    },

    reset() {
      this.searchString = "";
      this.load();
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
  },
};
</script>
  
  <style scoped>
.permissionOn {
  background-color: #409eff;
}

.permissionOff {
  background-color: #948f8f57;
}

.permission {
  height: 30px;
  width: 60px;
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  cursor: pointer;
}
</style>