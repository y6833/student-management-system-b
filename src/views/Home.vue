<template>
  <div>
      <h1>这是主页</h1>
      <LineChart style="width: 100%; height: 100%;"/>
  </div>
</template>

<script>
import LineChart from '../components/fig/LineChart.vue'
export default {
  components: { LineChart },
  name: "Home",
  data(){
    return {

    }
  }
}
</script>

<style scoped>

</style>