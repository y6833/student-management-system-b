<!-- 折线图 -->
<template>
  <div>
    <div id="AveLineChart" style="width: 1150px; height: 300px"></div>
  </div>
</template>

<script>
import { getCourseMax } from "@/api/course";
import * as echarts from "echarts";
export default {
  name: "AveLineChart",
  props: ["AveTableData", "choiceSubject"],
  data() {
    return {
      subjectList: [],
      maxnum: 800,
      interval: 100,
      averageClass: [], //班级平均分
      averageGrade: [], //年级平均分
    };
  },
  watch: {
    choiceSubject: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
    AveTableData: {
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
      this.subjectList = [];
      this.averageClass = [];
      this.averageGrade = [];
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById("AveLineChart");
      let myChart = echarts.init(chartDom);
      let option;
      this.AveTableData.forEach((element) => {
        this.subjectList.push(element.classs);
        this.averageClass.push(element.averageClass);
        this.averageGrade.push(element.averageGrade);
      });
      if (this.choiceSubject == "总分") {
        this.maxnum =
          Math.round(
            Math.max(...this.averageClass, ...this.averageGrade) / 10
          ) * 10;
        this.interval = 100;
      } else {
        this.getCourseMax(this.choiceSubject);
        this.interval = 30;
      }
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["bar", "line"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["班级平均分", "年级平均分"],
        },
        xAxis: [
          {
            type: "category",
            data: this.subjectList, //各班级
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "各班各科排名",
            min: 0,
            max: this.maxnum, //动态
            interval: this.interval, //动态
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "班级平均分",
            type: "bar",
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.averageClass,
          },
          {
            name: "年级平均分",
            type: "line",
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              },
            },
            data: this.averageGrade,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    //获取科目最大值
    async getCourseMax(name) {
      const res = await getCourseMax(name);
      if (res.code == 200) {
        this.maxnum = res.data;
      }
    },
  },
};
</script>

<style scoped>
</style>