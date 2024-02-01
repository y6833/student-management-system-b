<!-- 折线图 -->
<template>
  <div>
    <div id="ClassRankSegmentChart" style="width: 1650px; height: 350px"></div>
  </div>
</template>
  
  <script>
import * as echarts from "echarts";
import {ClassRankSegment} from "@/api/scores"
export default {
  name: "ClassRankSegmentChart",
  props: ["classValue", "rankingRange","choiceSubject1","semester"],
  data() {
    return {
      maxnum: 100,
      interval: 1,
      classNum: [], //班级人数
      classProportion: [], //班级占比
      examList: [],//考试列表
    };
  },
  watch: {
    classValue: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
    rankingRange: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
    choiceSubject1: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
    semester:{
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.showChart();
  },

  methods: {
    async showChart() {
      this.classProportion = [];
      this.examList = [];
      this.classNum = [];
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById("ClassRankSegmentChart");
      let myChart = echarts.init(chartDom);
      let option;
      console.log(this.classValue,this.rankingRange,this.choiceSubject1,this.semester);
      //班级，科目，范围
      await this.ClassRankSegment();

      this.maxnum = Math.max(...this.classNum);
      this.interval = Math.ceil(this.maxnum / 10);

      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765",
            },
          },
        },
        legend: {
          data: ["班级人数", "班级占比"],
          x: "left",
        },
        xAxis: [
          {
            type: "category",
            axisLine: { onZero: false },
            data: this.examList,
          },
        ],
        yAxis: [
          {
            name: "班级人数",
            type: "value",
            max: this.maxnum,
            interval: this.interval,
          },
          {
            name: "班级占比",
            nameLocation: "start",
            max: 1,
            type: "value",
            inverse: false,
          },
        ],
        series: [
          {
            name: "班级人数",
            type: "bar",
            data: this.classNum,
            itemStyle: {
              color: "#24b8ff", // 修改这里
            },
          },
          {
            name: "班级占比",
            type: "line",
            yAxisIndex: 1,
            data: this.classProportion,
            itemStyle: {
              color: "#17ead9", // 修改这里
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    async ClassRankSegment() {
      const params = {
        classValue: this.classValue,
        choiceSubject: this.choiceSubject1,
        rankingRange:this.rankingRange,
        semester:this.semester
      };
      const res = await ClassRankSegment(params);
      if(res.code == 200) {
        console.log(res.data);
        this.examList = res.data.examList
        this.classNum = res.data.classNum
        this.classProportion = res.data.classProportion
      }
    },
  },
};
</script>
  
  <style scoped>
</style>