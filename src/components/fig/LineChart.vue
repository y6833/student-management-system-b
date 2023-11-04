<!-- 折线图 -->
<template>
    <div>
        <div id="main" style="width: 500px; height: 400px"></div>
    </div>

</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "LineChart",
  data() {
    return {};
  },
  mounted() {
    var chartDom = document.getElementById("main");
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    };

    option && myChart.setOption(option);
  },
};
</script>

<style scoped>
</style>