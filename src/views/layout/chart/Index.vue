<template>
  <div class="chart">
    <!-- 上面的面板数据接口 -->
    <el-card>
      <ul class="list">
        <li>
          <div class="itemContent color1">{{ increment_users }}</div>
          <p>今日新增用户</p>
        </li>
        <li>
          <div class="itemContent color1">{{ total_users }}</div>
          <p>总用户量</p>
        </li>
        <li>
          <div class="itemContent color2">{{ increment_questions }}</div>
          <p>新增试题</p>
        </li>
        <li>
          <div class="itemContent color2">{{ total_questions }}</div>
          <p>总试题量</p>
        </li>
        <li>
          <div class="itemContent color2">{{ total_done_questions }}</div>
          <p>总刷题量</p>
        </li>
        <li>
          <div class="itemContent color2">{{ personal_questions }}</div>
          <p>人均刷题量</p>
        </li>
      </ul>
    </el-card>
    <!--下面柱形图  -->
    <el-card>
      <div class="echarts" ref="pieRef"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      total_done_questions: '',
      personal_questions: '',
      total_users: '',
      increment_users: '',
      increment_questions: '',
      total_questions: ''
    }
  },
  mounted () {
    this.getTitleData()
    this.getEchartsData()
  },
  methods: {
       // 这个地方使用post是为了防止缓存
    async getTitleData () {
      const res = await this.$http.post('/data/title')
      this.total_done_questions = res.data.total_done_questions
      this.personal_questions = res.data.personal_questions
      this.total_users = res.data.total_users
      this.increment_users = res.data.increment_users
      this.increment_questions = res.data.increment_questions
      this.total_questions = res.data.total_questions
    },
    async getEchartsData () {
      const res = await this.$http.post('/data/statistics')


      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.pieRef)

      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          data: res.data.map(item=>item.name)
        },
        series: [
          {
            name: '题量占比',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: res.data
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less">
.chart {
  .list {
    //弹性例子布局
    display: flex;
    //主轴分布
    justify-content: space-around;
    //侧轴分布
    align-items: center;
    //文本居中
    text-align: center;
    //颜色处理
    .color1 {
      border: 3px solid #0086fa;
      color: #0086fa;
    }
    .color2 {
      border: 3px solid #f76137;
      color: #f76137;
    }
    .color3 {
      border: 3px solid #55cd78;
      color: #55cd78;
    }
    //画圈圈
    .itemContent {
      border-radius: 50%;
      width: 99px;
      height: 99px;
      line-height: 99px;
    }
  }
  .echarts {
    height: 500px;
  }
}
</style>
