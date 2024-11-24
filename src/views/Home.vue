<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 class="welcome-title">欢迎使用学习管理系统</h1>
      <p class="welcome-subtitle">让学习变得更简单、更高效</p>
    </div>

    <div class="video-section">
      <el-button class="nav-button prev-button" @click="upSlide" icon="el-icon-arrow-left" circle></el-button>
      
      <div class="carousel-container">
        <carousel :per-page="1" :navigate-to="currentIndex" :mouse-drag="true" :pagination="true">
          <slide v-for="(video, index) in videos" :key="index">
            <div class="video-wrapper">
              <video 
                v-if="index == currentIndex" 
                :src="video" 
                controls
                class="video-player"
              ></video>
            </div>
          </slide>
        </carousel>
      </div>
      
      <el-button class="nav-button next-button" @click="nextSlide" icon="el-icon-arrow-right" circle></el-button>
    </div>

    <div class="features-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="feature-card">
            <i class="el-icon-reading feature-icon"></i>
            <h3>课程管理</h3>
            <p>轻松管理课程内容和学习进度</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-card">
            <i class="el-icon-data-analysis feature-icon"></i>
            <h3>成绩分析</h3>
            <p>实时跟踪学习成果和表现</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="feature-card">
            <i class="el-icon-connection feature-icon"></i>
            <h3>在线互动</h3>
            <p>促进师生之间的交流与互动</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import { getPage } from "@/api/files";
export default {
  components: {
    Carousel,
    Slide,
  },
  name: "Home",
  data() {
    return {
      videos: [],
      currentIndex: 0,
    };
  },
  created() {
    this.getVideoList();
  },
  methods: {
    async getVideoList() {
      const params = {
        pageNum: 1,
        pageSize: 10,
        name: "",
        type: "mp4",
      };
      const res = await getPage(params);
      if (res.code == 200) {
        res.data.records.forEach(element => {
          this.videos.push(element.url);
        });
        // console.log(this.videos);
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.videos.length;
    },
    upSlide() {
      this.currentIndex = (this.currentIndex - 1) % this.videos.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #fff 100%);
  min-height: calc(100vh - 60px);
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  
  .welcome-title {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 16px;
    font-weight: 600;
    background: linear-gradient(to right, #1890ff, #36b9fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .welcome-subtitle {
    font-size: 18px;
    color: #666;
    margin: 0;
  }
}

.video-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  
  .carousel-container {
    width: 800px;
    margin: 0 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .video-wrapper {
    padding: 20px;
    
    .video-player {
      width: 100%;
      border-radius: 4px;
    }
  }
}

.nav-button {
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 16px;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &.prev-button {
    margin-right: 10px;
  }
  
  &.next-button {
    margin-left: 10px;
  }
}

.features-section {
  padding: 40px 0;
  
  .feature-card {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s;
    height: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 48px;
      color: #1890ff;
      margin-bottom: 20px;
    }
    
    h3 {
      font-size: 20px;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      margin: 0;
      line-height: 1.6;
    }
  }
}

// 自定义 carousel 样式
::v-deep .VueCarousel-pagination {
  .VueCarousel-dot {
    margin-top: 20px;
    
    button {
      width: 8px !important;
      height: 8px !important;
      border-radius: 50% !important;
      background-color: #d9d9d9 !important;
      
      &:focus {
        outline: none;
      }
    }
    
    &.VueCarousel-dot--active button {
      background-color: #1890ff !important;
    }
  }
}
</style>