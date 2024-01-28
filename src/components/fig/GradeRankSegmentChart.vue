<!-- 折线图 -->
<template>
  <div>
    <div id="GradeRankSegmentChart" style="width: 1650px; height: 350px"></div>
  </div>
</template>
  
  <script>
import * as echarts from "echarts";
export default {
  name: "GradeRankSegmentChart",
  props: ["tableData"],
  data() {
    return {
      maxnum: 100,
      classNum: [], //班级人数
      classProportion: [], //班级占比
      classList: [
        "计科2001",
        "计科2002",
        "计科2003",
        "计科2004",
        "计科2005",
        "计科2006",
        "计科2007",
        "计科2008",
      ], //班级列表
    };
  },
  watch: {
    tableData: {
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
    showChart() {
      this.classProportion = [];
      this.classList = [];
      this.classNum = [];
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById("GradeRankSegmentChart");
      let myChart = echarts.init(chartDom);
      let option;
      // 使用reduce方法将对象集合转换为Map对象，并计算id字段出现的次数
      const resultMap = this.tableData.reduce((acc, cur) => {
        acc.set(cur.student.classId, (acc.get(cur.student.classId) || 0) + 1);
        return acc;
      }, new Map());
      this.classList = Array.from(resultMap.keys());
      this.classNum = Array.from(resultMap.values());
      this.maxnum = Math.max(...this.classNum);
      const sum = this.classNum.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      resultMap.forEach((value, key) => {
        this.classProportion.push(value / sum);
      });

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
            data: this.classList,
          },
        ],
        yAxis: [
          {
            name: "班级人数",
            type: "value",
            max: this.maxnum,
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
          },
          {
            name: "班级占比",
            type: "line",
            yAxisIndex: 1,
            data: this.classProportion,
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
};
</script>
  
  <style scoped>
</style>