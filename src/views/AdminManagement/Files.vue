<template>
  <div>
    <div style="padding: 10px 0">
      <el-input
        style="width: 200px; margin-right: 10px"
        placeholder="请输入名称"
        suffix-icon="el-icon-search"
        v-model="name"
      ></el-input>
      <el-select
        v-model="fileType"
        placeholder="文件类型"
        style="margin-right: 10px"
      >
        <el-option
          v-for="(item, index) in fileTypeList"
          :key="index"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="load" :disabled="!authority.includes(4)">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-upload
        action="http://localhost:9001/sms/file/upload"
        :show-file-list="false"
        :on-success="handleFileUploadSuccess"
        style="display: inline-block"
      >
        <el-button type="primary"
        :disabled="!authority.includes(1)"
          >上传文件<i class="el-icon-top" style="margin-left: 5px;"></i
        ></el-button>
      </el-upload>
      <el-popconfirm
        style="margin-left: 10px"
        confirm-button-text="确定"
        cancel-button-text="我再想想"
        icon="el-icon-info"
        icon-color="red"
        title="您确定要删除这些内容吗？"
        @confirm="delBatch"
      >
        <el-button type="danger" slot="reference"
        :disabled="!authority.includes(2)"
          >批量删除<i class="el-icon-remove-outline" style="margin-left: 5px;"></i
        ></el-button>
      </el-popconfirm>
    </div>

    <el-table
      v-if="imageIf == false && videoIf == false"
      :data="tableData"
      border
      stripe
      :header-cell-calss-name="'headerBg'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="文件名称"></el-table-column>
      <el-table-column prop="type" label="文件类型"></el-table-column>
      <el-table-column prop="size" label="文件大小(kb)"></el-table-column>
      <el-table-column label="下载">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)"
          :disabled="!authority.includes(6)"
            >下载</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-color="#13ce66"
            inactive-color="#ccc"
            @change="changeEnable(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-popconfirm
            style="margin-left: 10px"
            confirm-button-text="确定"
            cancel-button-text="我再想想"
            icon="el-icon-info"
            icon-color="red"
            title="您确定要删除吗？"
            @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" slot="reference"
            :disabled="!authority.includes(2)"
              >删除<i class="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 图片展示 -->
    <el-row v-if="imageIf">
      <el-col
        :span="4"
        v-for="(item, index) in tableData"
        :key="index"
        :offset="index % 5 == 0 ? 0 : 1"
        style="position: relative;"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <el-checkbox
            id="myCheckbox"
            v-model="multipleSelection"
            :label="item.id"
            multiple
            style="position: absolute; top: -3px"
          >
            <label for="myCheckbox" style="display: none"></label>
          </el-checkbox>
          <img :src="item.url" class="teaAvatar" />

        </el-card>
      </el-col>
    </el-row>
    <!-- 视频展示 -->
    <el-row v-if="videoIf">
      <el-col
        :span="4"
        v-for="(item, index) in tableData"
        :key="index"
        :offset="index % 5 == 0 ? 0 : 1"
        style="position: relative;"
      >
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <el-checkbox
            id="myCheckbox"
            v-model="multipleSelection"
            :label="item.id"
            multiple
            style="position: absolute; top: -3px"
          >
            <label for="myCheckbox" style="display: none"></label>
          </el-checkbox>
          <video :src="item.url" class="teaAvatar" />

        </el-card>
      </el-col>
    </el-row>

    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 4, 6, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getPage,
  deleteFile,
  deleteFiles,
  updateFileStatus,
  getFiletypeList,
} from "@/api/files";
import {getUserPermission} from "@/api/userpermission";
export default {
  name: "File",
  data() {
    return {
      tableData: [],
      imageIf: false,
      videoIf:false,
      fileType: "",
      fileTypeList: [],
      imagefile: ["jpeg", "png", "gif", "bmp", "jpg"],
      videofile:["mp4","mp3","wav"],
      name: "",
      multipleSelection: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      authority:[]//权限
    };
  },
  created() {
    this.load();
    this.getfiletypelist();
        //获取权限
        this.getauthority();
  },
  methods: {
    async load() {
      this.tableData = [];
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.name,
        type: this.fileType,
      };
      const res = await getPage(params);
      if (res.code == 200) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        if (this.imagefile.includes(this.fileType)) {
          this.imageIf = true;
        }else{
          this.imageIf = false;
        }
        if (this.videofile.includes(this.fileType)) {
          this.videoIf = true;
        }else{
          this.videoIf = false;
        }

        // if (this.fileType == "") {
        //   this.tableData = res.data.records;
        //   this.total = res.data.total;
        // } else {
        //   res.data.records.forEach((element) => {
        //     if (element.type == this.fileType) {
        //       this.tableData.push(element);
        //     }
        //   });
        //   if(this.imagefile.includes(this.fileType)){
        //     this.imageIf=true
        //   }
        //   this.total = this.tableData.length
        // }
      }
    },
        //获取权限列表
        async getauthority(){
     let user = JSON.parse(localStorage.getItem("user"))
     //获取权限列表
     const props={
      roleId:user.roleId
     }
     const res = await getUserPermission(props);
     if(res.code == 200){
      this.authority = res.data
     }
    },
    async getfiletypelist() {
      const res = await getFiletypeList();
      if (res.code == 200) {
        this.fileTypeList = res.data;
      }
    },
    //启用
    async changeEnable(data) {
      const res = await updateFileStatus(data);
      if (res.code == 200) {
        this.$message.success("操作成功");
      }
      this.reset();
    },

    async handleDelete(id) {
      const res = await deleteFile(id);
      if (res.code === "200") {
        this.$message.success("删除成功");
        this.load();
      } else {
        this.$message.error("删除失败！");
      }
      this.reset();
    },
    async delBatch() {
      let ids = this.multipleSelection.map((v) => v.id); //把对象数组转化为id数组【1,2,3】
      const res = await deleteFiles(ids);
      if (res.code === "200") {
        this.$message.success("批量删除成功!");
        this.load();
      } else {
        this.$message.error("批量删除失败！");
      }
      this.reset();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    reset() {
      this.name = "";
      this.fileType = "";
      this.imageIf = false;
      this.videoIf = false;
      this.getfiletypelist();
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
    handleFileUploadSuccess(res) {
      // console.log(res);
      this.load();
    },
    download(url) {
      window.open(url);
    },
  },
};
</script>

<style scoped>
.teaAvatar {
    width: 280px;
    height: 240px
}
</style>
