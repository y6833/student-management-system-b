<template>
  <div>
    <p>当前时间：{{ time }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
    };
  },
  mounted() {
    this.timeId = setInterval(() => {
      this.time = new Date().toLocaleString();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeId);
  },
};
</script>
