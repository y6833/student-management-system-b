<template>
  <el-container style="height: 100vh">
    <el-aside
      :width="sideWidth + 'px'"
      style="
        background-color: rgb(238, 241, 246);
        box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
      "
    >
      <Aside :is-collapse="isCollapse" :logo-text-show="logoTextShow" />
    </el-aside>

    <el-container>
      <el-header
        style="
          background-color: #fff;
          font-size: 12px;
          border-bottom: 1px solid #ccc;
        "
      >
        <Header
        v-if="headshow"
          :collapse-btn-class="collapseBtnClass"
          :collapse="isCollapse"
          @callParentFunction="handleChildFunctionCall"
        />
      </el-header>

      <el-main>
        <!-- 当前页面的子路由会在rute-view里面展示 -->
        <router-view @refreshHeader="refreshHeader" />
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.el-header {
  box-shadow: none;
  padding: 0;
  height: 64px !important;
  line-height: 64px;
  background: transparent;
}

.el-aside {
  color: #333;
  background-color: rgb(238, 241, 246);
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
  transition: width 0.3s;
}
</style>
<script>
import Aside from "../components/Aside.vue";
import Header from "../components/Header.vue";
export default {
  components: { Aside, Header },
  data() {
    return {
      headshow: true,
      collapseBtnClass: "el-icon-s-fold",
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
    };
  },
  methods: {
    /**
    * 切换组件的收缩状态。
    */
    collapse() {
      //点击收缩
      // 切换收缩状态
      this.isCollapse = !this.isCollapse;

      if (this.isCollapse) {
        // 如果收缩，将侧边栏宽度设置为 64
        this.sideWidth = 64;
        // 更新收缩按钮的样式类
        this.collapseBtnClass = "el-icon-s-unfold";
        this.logoTextShow = false;
      } else {
        // 如果未收缩，将侧边栏宽度设置为 200
        this.sideWidth = 200;
        // 更新收缩按钮的样式类
        this.collapseBtnClass = "el-icon-s-fold";
        this.logoTextShow = true;
      }
    },
    handleChildFunctionCall(data) {
      this.collapse();
    },
    refreshHeader() {
      //删除节点
      this.headshow = false;
      let out = setTimeout(() => {
        //重新渲染节点
        this.headshow = true;
        clearTimeout(out);
      }, 0);
    },
    handleResize() {
      const width = window.innerWidth;
      if (width <= 768 && !this.isCollapse) {
        this.collapse();
      } else if (width > 768 && this.isCollapse) {
        this.collapse();
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>