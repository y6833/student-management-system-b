<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div class="card-header">
            <span>总学生数</span>
            <el-tag type="success">实时</el-tag>
          </div>
          <div class="card-body">
            <div class="number">{{ statistics.studentCount }}</div>
            <div class="text">较上月 {{ statistics.studentIncrease > 0 ? '+' : '' }}{{ statistics.studentIncrease }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="card-header">
            <span>总班级数</span>
            <el-tag type="warning">实时</el-tag>
          </div>
          <div class="card-body">
            <div class="number">{{ statistics.classCount }}</div>
            <div class="text">较上月 {{ statistics.classIncrease > 0 ? '+' : '' }}{{ statistics.classIncrease }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="card-header">
            <span>总课程数</span>
            <el-tag type="info">实时</el-tag>
          </div>
          <div class="card-body">
            <div class="number">{{ statistics.courseCount }}</div>
            <div class="text">较上月 {{ statistics.courseIncrease > 0 ? '+' : '' }}{{ statistics.courseIncrease }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="card-header">
            <span>总教师数</span>
            <el-tag type="danger">实时</el-tag>
          </div>
          <div class="card-body">
            <div class="number">{{ statistics.teacherCount }}</div>
            <div class="text">较上月 {{ statistics.teacherIncrease > 0 ? '+' : '' }}{{ statistics.teacherIncrease }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="chart-card">
          <div class="card-header">
            <span>学生性别比例</span>
          </div>
          <div class="chart" ref="genderChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div class="card-header">
            <span>各专业学生分布</span>
          </div>
          <div class="chart" ref="majorChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="chart-card">
          <div class="card-header">
            <span>近6个月学生增长趋势</span>
          </div>
          <div class="chart" ref="trendChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getStatistics, getGenderRatio, getMajorDistribution, getStudentTrend } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      statistics: {
        studentCount: 0,
        studentIncrease: 0,
        classCount: 0,
        classIncrease: 0,
        courseCount: 0,
        courseIncrease: 0,
        teacherCount: 0,
        teacherIncrease: 0
      },
      genderChart: null,
      majorChart: null,
      trendChart: null
    }
  },
  mounted() {
    this.initData()
    // 监听窗口大小变化，重绘图表
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.genderChart) this.genderChart.dispose()
    if (this.majorChart) this.majorChart.dispose()
    if (this.trendChart) this.trendChart.dispose()
  },
  methods: {
    async initData() {
      try {
        // 获取统计数据
        const statisticsRes = await getStatistics()
        if (statisticsRes.code === 200) {
          this.statistics = statisticsRes.data
        }

        // 初始化图表
        this.initGenderChart()
        this.initMajorChart()
        this.initTrendChart()
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败，请稍后重试')
      }
    },
    async initGenderChart() {
      try {
        const res = await getGenderRatio()
        if (res.code === 200) {
          this.genderChart = echarts.init(this.$refs.genderChart)
          this.genderChart.setOption({
            title: {
              text: '学生性别比例',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '性别比例',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: res.data.male, name: '男生' },
                  { value: res.data.female, name: '女生' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          })
        }
      } catch (error) {
        console.error('获取性别比例数据失败:', error)
      }
    },
    async initMajorChart() {
      try {
        const res = await getMajorDistribution()
        if (res.code === 200) {
          this.majorChart = echarts.init(this.$refs.majorChart)
          this.majorChart.setOption({
            title: {
              text: '专业分布',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: res.data.map(item => item.name)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: res.data.map(item => item.count),
                type: 'bar'
              }
            ]
          })
        }
      } catch (error) {
        console.error('获取专业分布数据失败:', error)
      }
    },
    async initTrendChart() {
      try {
        const res = await getStudentTrend()
        if (res.code === 200) {
          this.trendChart = echarts.init(this.$refs.trendChart)
          this.trendChart.setOption({
            title: {
              text: '学生增长趋势',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: res.data.map(item => item.month)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: res.data.map(item => item.count),
                type: 'line',
                smooth: true
              }
            ]
          })
        }
      } catch (error) {
        console.error('获取学生增长趋势数据失败:', error)
      }
    },
    handleResize() {
      if (this.genderChart) this.genderChart.resize()
      if (this.majorChart) this.majorChart.resize()
      if (this.trendChart) this.trendChart.resize()
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.box-card {
  height: 180px;
}

.chart-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header span {
  font-size: 16px;
  font-weight: bold;
}

.card-body {
  text-align: center;
}

.number {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0;
}

.text {
  font-size: 14px;
  color: #909399;
}

.chart {
  height: 300px;
}
</style>
