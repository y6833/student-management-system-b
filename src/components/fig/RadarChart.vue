<!-- 雷达图 -->
<template>
  <div>
    <div id="main" style="width: 500px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "RadarChart",
  data() {
    return {};
  },
  mounted() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      legend: {
        data: ["班级平均分", "个人成绩"],
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: "语文", max: 100 },
          { name: "数学", max: 100 },
          { name: "英语", max: 100 },
          { name: "Java", max: 100 },
          { name: "C语言", max: 100 },
          { name: "Python", max: 100 },
        ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: [60, 60, 60, 60, 60, 60],
              name: "班级平均分",
            },
            {
              value: [50, 80, 78, 78, 86, 65],
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