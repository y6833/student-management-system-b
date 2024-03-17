<!-- 折线图 -->
<template>
  <div>
    <div id="ExamcompareChart" style="width: 1650px; height: 350px"></div>
  </div>
</template>
    
    <script>
import * as echarts from "echarts";
import { getExamcompareChart } from "@/api/scores";
export default {
  name: "ExamcompareChart",
  props: ["studentValue", "examValue"],
  data() {
    return {
      tableData: [], //数据
      examList: [], //考试名称集合，x轴
      scoreMax: 0, //最高分
      series: [],
      courseList: [],
    };
  },
  mounted() {
    this.showChart();
  },

  methods: {
    async showChart() {
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById("ExamcompareChart");
      let myChart = echarts.init(chartDom);
      let option;
      this.tableData = [];
      this.examList = [];
      const myMap = new Map();
      await this.getExamcompareChart();

      this.tableData.forEach((element) => {
        this.examList.push(element.examName); //添加考试
        element.subRankDTO.forEach((subRank) => {
          //添加科目的值
          if (subRank.course != "总分") {
            this.scoreMax =
              this.scoreMax > subRank.max ? this.scoreMax : subRank.max;
            myMap.set(subRank.course, []);
          }
        });
      });

      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index];
        element.subRankDTO.forEach((subRank) => {
          //添加科目的值
          if (subRank.course != "总分") {
            // myMap.get(subRank.course).push(subRank.subject);
            myMap.get(subRank.course)[index] = subRank.subject;
          }
        });
      }

      //循环map
      myMap.forEach((value, key) => {
        var serie = {
          name: "",
          type: "bar",
          itemStyle: {
            color: "#17ead9", // 修改这里
          },
          data: [],
        };
        this.courseList.push(key);
        serie.name = key;
        serie.type = "bar";
        (serie.itemStyle = {
          color: "#17ead9", // 修改这里
        }),
          (serie.data = value);
        this.series.push(serie);
      });

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
            magicType: { show: true, type: ["bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: this.courseList, //科目列表
        },
        xAxis: [
          {
            type: "category",
            data: this.examList,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "分数",
            min: 0,
            max: this.scoreMax,
            interval: 10,
          },
        ],
        series: this.series,
      };

      option && myChart.setOption(option);
    },
    async getExamcompareChart() {
      const params = {
        studentValue: this.studentValue,
        examValue: this.examValue,
      };
      const res = await getExamcompareChart(params);
      if (res.code == 200) {
        this.tableData = res.data;
      }
    },
  },
};
</script>
    
    <style scoped>
</style>