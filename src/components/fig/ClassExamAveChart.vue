<!-- 折线图 -->
<template>
  <div>
    <div id="ClassExamAveChart" style="width: 1650px; height: 350px"></div>
  </div>
</template>
  
  <script>
import * as echarts from "echarts";
import { getCourseMax } from "@/api/course";
export default {
  name: "ClassExamAveChart",
  props: ["choiceSubject", "examClassAve"],
  data() {
    return {
      borName: "平均分",
      maxnum: 800,
      interval: 100,
      examList: [],
      examScores: [],
    };
  },
  watch: {
    choiceSubject: {
      handler(newValue, oldValue) {
        this.borName = newValue + "平均分";
        this.showChart();
      },
      deep: true,
    },

    examClassAve: {
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
      var chartDom = document.getElementById("ClassExamAveChart");
      var myChart = echarts.init(chartDom);
      var option;
      let map = new Map(Object.entries(this.examClassAve));
      let reversedMap = new Map([...map.entries()].reverse());
      this.examList  = Array.from(reversedMap.keys());
      this.examScores = Array.from(reversedMap.values());
      if (this.choiceSubject == "总分") {
        this.maxnum = Math.ceil(Math.max(...this.examScores) / 10) * 10;
        this.interval = 100;
      } else {
        this.getCourseMax(this.choiceSubject);
        this.interval = 20;
      }
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
        xAxis: {
          type: "category",
          data: this.examList,
        },
        yAxis: {
          name: "平均分",
          type: "value",
          max: this.maxnum,
          interval: this.interval,
        },
        series: [
          {
            name: this.borName,
            data: this.examScores,
            type: "bar",
            itemStyle: {
              color: "#17ead9", // 修改这里
            },
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