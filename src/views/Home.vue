<template>
  <div>
    <div style="font-size: 100px; text-align: center">欢迎使用此系统</div>
    <div style="display: flex; justify-content: center; align-items: center">
      <!-- <video
        src="http://localhost:9001/sms/file/337ca427d2b64e8c8d83825a85ad5cb9.mp4"
        controls
      ></video> -->

      <button @click="upSlide">上一个视频</button>
      <carousel>
        <slide v-for="(video, index) in videos" :key="index">
          <video v-if="index == currentIndex" :src="video" controls></video>
        </slide>
      </carousel>
      <button @click="nextSlide">下一个视频</button>
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

<style scoped>
</style>