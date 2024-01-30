<!-- 折线图 -->
<template>
    <div>
      <div
        id="PreviousExamScores"
        style="width: 1650px; height: 350px"
      ></div>
    </div>
  </template>
        
        <script>
  import * as echarts from "echarts";
  import { getExamcompareChart } from "@/api/scores";
  export default {
    name: "PreviousExamScores",
    props: ["studentValue", "examValue", "choiceSubject"],
    data() {
      return {
        tableData: [], //数据
        scoreMax: 100, //最高分
        examList: [], //考试名称集合，x轴
        scores: [], //考试成绩
        gradeScores: [], //班级平均分
      };
    },
    watch: {
      choiceSubject: {
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
        // 基于准备好的dom，初始化echarts实例
        let chartDom = document.getElementById("PreviousExamScores");
        let myChart = echarts.init(chartDom);
        let option;
        this.examList = [];
        this.scores = [];
        this.gradeScores = [];
        await this.getExamcompareChart();
        this.tableData.forEach((element) => {
          this.examList.push(element.examName); //添加考试
          element.subRankDTO.forEach((subRank) => {
            if (subRank.course == this.choiceSubject) {
              this.scores.push(subRank.subject); //添加成绩
              this.gradeScores.push(subRank.average); //添加班级平均分
            }
          });
        });
        option = {
          title: {
            text: "历次考试排名",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985",
              },
            },
          },
          legend: {
            data: ["分数", "年级平均分"],
          },
          toolbox: {
            feature: {
              saveAsImage: {},
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: this.examList,
            },
          ],
          yAxis: [
            {
              type: "value",
              min: 1,
            },
          ],
          series: [
            {
              name: "分数",
              type: "line",
              smooth: true, 
              areaStyle: {},
              emphasis: {
                focus: "series",
              },
              label: {
                show: true, // 显示数据点的值
              },
              itemStyle: {
                color: "#acf848", // 修改这里
              },
              data: this.scores,
            },
            {
              name: "年级平均分",
              type: "line",
              smooth: true, 
              areaStyle: {},
              emphasis: {
                focus: "series",
              },
              label: {
                show: true, // 显示数据点的值
              },
              itemStyle: {
                color: "#17ead9", // 修改这里
              },
              data: this.gradeScores,
            },
          ],
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