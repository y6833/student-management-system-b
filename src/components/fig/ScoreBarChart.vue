<!-- 柱状图 -->
<!-- 成绩柱状图 -->
<template>
    <div>
      <div v-bind:id="scoreId" style="width: 500px; height: 400px"></div>
    </div>
  </template>

<script>
import * as echarts from "echarts";
export default {
  name: "ScoreBarChart",
  props:{
    stuScores:{}
  },
  data() {
    return {
      classAve:[],
      gradeAve:[],
      scores:[],
      scoreId:""
    };
  },
  beforeMount(){
   this.scoreId = this.stuScores.scoreId
  },
  mounted() {
    var app = {};
    var chartDom = document.getElementById(this.scoreId);
    var myChart = echarts.init(chartDom);
    var option;
    let scoreee = [["product", "班级平均分", "年级平均分","得分"],[],[]];
    let keys = Object.keys(this.stuScores.scores);
    keys.forEach((index,value) => {
        scoreee[value+1][0] = index;
        scoreee[value+1][1] =  this.stuScores.classAve[index];
        scoreee[value+1][2] = this.stuScores.gradeAve[index];
        scoreee[value+1][3] = this.stuScores.scores[index];
    })
    option = {
      legend: {},
      tooltip: {},
      dataset: {
        source: scoreee
      },
      xAxis: { type: "category" },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
    };

    option && myChart.setOption(option);
  },
};
</script>

<style scoped>
</style>