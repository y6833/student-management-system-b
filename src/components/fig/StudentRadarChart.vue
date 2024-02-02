<!-- 折线图 -->
<template>
  <div>
    <div id="StudentRadarChart" style="width: 500px; height: 400px"></div>
  </div>
</template>
    
  <script>
import * as echarts from "echarts";
export default {
  name: "StudentRadarChart",
  props: ["subRankList", "examValue"],
  data() {
    return {
      studentScoreList: [], //学生成绩
      ScoreAveList: [], //平均成绩
      courseMAxList: [],
    };
  },
  watch: {
    subRankList: {
      handler(newValue, oldValue) {
        this.showChart();
      },
      deep: true,
    },
    examValue: {
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
      this.studentScoreList = []; //学生成绩
      this.ScoreAveList = []; //平均成绩
      this.courseMAxList = [];
      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById("StudentRadarChart");
      let myChart = echarts.init(chartDom);
      let option;

      if (this.subRankList.length > 0) {
        this.subRankList.forEach((element) => {
          let courseMax = {
            name: "",
            max: 0,
          };
          if (element.course != "总分") {
            this.studentScoreList.push(element.subject);
            this.ScoreAveList.push(element.average);
            courseMax.name = element.course;
            courseMax.max = element.max;
            this.courseMAxList.push(courseMax);
          }
        });

        option = {
          title: {
            text: "多维雷达",
            textStyle: {
              color: "#fff",
              align: "center",
            },
            subtext: "成绩多维雷达",
          },
          backgroundColor: "#fff",
          tooltip: {},
          legend: {
            data: ["学生成绩", "年级平均成绩"],
            show: true,
            right: 20,
            textStyle: {
              color: "#000",
            },
          },
          radar: {
            splitLine: {
              lineStyle: {
                color: ["#fff", "#a00"], //一个一个圈的线条颜色
              },
            },
            splitArea: {
              areaStyle: {
                // color: ['#FF884C','#9A47FF']   //分隔区域颜色
              },
            },
            axisLine: {
              lineStyle: {
                color: "orange", //轴颜色
              },
            },
            shape: "polygon", //形状,支持 'polygon' 和 'circle'
            name: {
              textStyle: {
                color: "#fff",
                backgroundColor: "#898989",
                borderRadius: 3,
                padding: [3, 5, 5],
              },
            },
            indicator: this.courseMAxList || [],
            backgroundColor: "#000",
          },
          series: [
            {
              name: "学生成绩 vs 年级平均成绩",
              type: "radar",
              // areaStyle: {normal: {}},   //显示面积
              data: [
                {
                  value: this.studentScoreList,
                  name: "学生成绩",
                },
                {
                  value: this.ScoreAveList,
                  name: "年级平均成绩",
                },
              ],
            },
          ],
        };
        option && myChart.setOption(option);
      }
    },
  },
};
</script>
    
    <style scoped>
</style>