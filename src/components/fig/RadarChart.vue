<!-- 雷达图 -->
<template>
  <div>
    <div v-bind:id="scoreId" style="width: 500px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "RadarChart",
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
    var chartDom = document.getElementById(this.scoreId);
    var myChart = echarts.init(chartDom);
    var option;
    this.classAve= Object.values(this.stuScores.classAve);
    this.gradeAve = Object.values(this.stuScores.gradeAve);
    this.scores = Object.values(this.stuScores.scores);
    option = {
      legend: {
        data: ["班级平均分","年级平均分", "个人成绩"],
      },
      radar: {
        // shape: 'circle',
        indicator: this.stuScores.maxScores
        // [
        //   { name: "语文", max: 100 },
        //   { name: "数学", max: 100 },
        //   { name: "英语", max: 100 },
        //   { name: "Java", max: 100 },
        //   { name: "C语言", max: 100 },
        //   { name: "Python", max: 100 },
        // ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: this.classAve,
              name: "班级平均分",
              symbol: "rect",
              symbolSize: 12,
              lineStyle: {
                type: "dashed",
              },
              label: {
                show: true,
                formatter: function (params) {
                  return params.value;
                },
              },
            },
            {
              value: this.gradeAve,
              name: "年级平均分",
              symbol: "rect",
              symbolSize: 12,
              lineStyle: {
                type: "dashed",
              },
              label: {
                show: true,
                formatter: function (params) {
                  return params.value;
                },
              },
            },
            {
              value: this.scores,
              name: "个人成绩",
              symbol: "rect",
              symbolSize: 12,
              lineStyle: {
                type: "dashed",
              },
              label: {
                show: true,
                formatter: function (params) {
                  return params.value;
                },
              },
            },
          ],
        },
      ],
    };

    option && myChart.setOption(option);
  },
};
</script>

<style scoped>
</style>