<template>
  <div>
    <el-form :inline="true" :model="formInline" ref="form">
      <el-form-item label="学科" prop="subject">
        <el-select v-model="formInline.subject" placeholder="请选择学科">
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in subjectList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阶段" prop="step">
        <el-select v-model="formInline.step" placeholder="请选择阶段">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in stepObj"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业" prop="enterprise">
        <el-select v-model="formInline.enterprise" placeholder="请选择企业">
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in enterpriseList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题型" prop="type">
        <el-select v-model="formInline.type" placeholder="请选择题型">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in typeObj"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-select v-model="formInline.difficulty" placeholder="请选择难度">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in degreeObj"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者" prop="username">
        <el-input
          v-model="formInline.username"
          placeholder="请输入作者"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formInline.status" placeholder="请选择状态">
          <el-option
            :label="item.status"
            :value="item.value"
            v-for="item in statuses"
            :key="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="create_date">
        <el-date-picker
          v-model="formInline.create_date"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formInline.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="info" @click="clear">清除</el-button>
        <el-button type="primary" @click="add">+新增试题</el-button>
      </el-form-item>
    </el-form>

    <!-- 下面列表 -->

    <el-table :data="tableData" style="width: 100%">
      <!-- 通过给 type=index 的列传入 index 属性，可以自定义索引。该属性传入数字时，将作为索引的起始值。 -->
      <el-table-column type="index" :index="indexMethod"> </el-table-column>
      <el-table-column prop="title" label="标题" width="300">
        <!-- 插槽的功能是替换和传值,这里row是因为子组件table里面绑定的是row -->
        <template slot-scope="scope">
          <span v-html="scope.row.title"></span>
        </template>
      </el-table-column>
      <!-- 这里直接使用formatter格式化,使用模板引擎思路会比较复杂 -->
      <el-table-column label="学科.阶段" :formatter="getSubjectStep">
      </el-table-column>
      <el-table-column prop="type" label="题型" :formatter="getSubjectType">
      </el-table-column>
      <el-table-column label="企业" prop="enterprise_name"> </el-table-column>
      <el-table-column label="创建者" prop="username"> </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.status == 0 ? 'red' : '#ccc' }">{{
            scope.row.status == 0 ? '禁用' : '启用'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问量" prop="reads"> </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button
            :type="scope.row.status == 0 ? 'success' : 'info'"
            @click="changeStatus(scope.row.id)"
            >{{ scope.row.status == 0 ? '启用' : '禁用' }}</el-button
          >
          <el-button @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页插件 -->
    <div class="block" style="text-align:center;margin-top:40px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[1, 2, 4, 5]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sum"
      >
      </el-pagination>
    </div>

    <!-- 子组件 -->
    <add-or-update
      ref="formRef"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepObj="stepObj"
      :typeObj="typeObj"
      :degreeObj="degreeObj"
    />
  </div>
</template>

<script>
import AddOrUpdate from './Add-or-update'
export default {
  name:'Question',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      subjectList: [], //学科
      enterpriseList: [],

      tableData: [], //列表

      // 阶段
      stepObj: [
        { label: '初级', value: 1 },
        { label: '中级', value: 2 },
        {
          label: '高级',
          value: 3
        }
      ],
      // 类型
      typeObj: [
        { label: '单选', value: 1 },
        { label: '多选', value: 2 },
        {
          label: '简答',
          value: 3
        }
      ],
      // 难度
      degreeObj: [
        { label: '简单', value: 1 },
        { label: '一般', value: 2 },
        {
          label: '困难',
          value: 3
        }
      ],
      statuses: [
        { status: '禁用', value: 0 },
        { status: '启用', value: 1 }
      ],
      formInline: {
        enterprise: '',
        type: '',
        step: '',
        username: '',
        status: '',
        difficulty: '',
        create_date: '',
        subject: '',
        title: ''
      },
      page: 1,
      limit: 2,
      sum: 0
    }
  },

  methods: {
    // 获取学科数据
    async subjectListData () {
      const res = await this.$http.get('/subject/list')

      this.subjectList = res.data.items
    },
    // 获取企业数据
    async enterpriseListData () {
      const res = await this.$http.get('/enterprise/list')

      this.enterpriseList = res.data.items
    },
    // 列表数据
    async listData () {
      const res = await this.$http.get('/question/list', {
        params: {
          // 传入表单的值
          ...this.formInline,
          page: this.page,
          limit: this.limit
        }
      })

      this.tableData = res.data.items
      this.sum = res.data.pagination.total
    },
    // 学习阶段
    getSubjectStep (row) {
      // console.log(row)
      let stepName = ''
      // 判断
      switch (row.step) {
        case 1:
          stepName = '初级'
          break
        case 2:
          stepName = '中级'
          break
        case 3:
          stepName = '高级'
          break

        default:
          break
      }
      return `${row.subject_name}.${stepName}`
    },
    // 题型
    getSubjectType (row) {
      // console.log(row)
      let typeName = ''
      // 判断是
      switch (row.type) {
        case 1:
          typeName = '单选'
          break
        case 2:
          typeName = '多选'
          break
        case 3:
          typeName = '简答'
          break

        default:
          break
      }
      return typeName
    },
    // 索引
    indexMethod (index) {
      return index + 1
    },
    // 改变limit
    handleSizeChange (val) {
      console.log(val)
      this.page = 1
      this.limit = val
      this.listData()
    },
    // 改变page
    handleCurrentChange (val) {
      console.log(val)
      this.page = 1
      this.listData()
    },
    // 搜索
    search () {
      this.page = 1
      this.listData()
    },
    // 新增
    add () {
      this.$refs.formRef.mode = 'add'
      this.$refs.formRef.dialogVisible = true
      this.$refs.formRef.formLine = {
        // 这里面写的就是将来提交给后台的属性，要根据接口文档写
        subject: '', // 学科id
        step: '', // 阶段1、初级 2、中级 3、高级
        enterprise: '', // 企业
        city: [], // 城市
        type: 1, // 题型 1单选 、2多选 、3简答
        difficulty: 1, // 题目难度 1简单 、2一般 、3困难
        title: '', // 标题
        answer_analyze: '', // 答案解析
        remark: '', // 试题备注
        video: '', // 视频url
        single_select_answer: 'A', // 单选答案，默认是A
        multiple_select_answer: [], // 多选答案
        short_answer: '', // 简答答案
        select_options: [
          // 单选、多选的选项
          {
            label: 'A',
            text: '选项A',
            image: ''
          },
          {
            label: 'B',
            text: '选项B',
            image: ''
          },
          {
            label: 'C',
            text: '选项C',
            image: ''
          },
          {
            label: 'D',
            text: '选项D',
            image: ''
          }
        ]
      }
      // 清除校验规则
      this.$nextTick(() => {
        this.$refs.formRef.$refs.form.clearValidate()
      })
    },
    // 清除
    clear () {
      this.$refs.form.resetFields()
      this.listData()
    },
    // 改变状态
    async changeStatus (id) {
      const res = await this.$http.post('/question/status', { id })
      if (res.code == 200) {
        this.$message({
          type: 'success',
          message: '状态修改成功'
        })
        this.listData()
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除
    del (id) {
      this.$confirm('此操作将该数据删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.post('/question/remove', { id })
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message.error(res.message)
          }

          this.listData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑
    edit (row) {
      console.log(row)
      this.$refs.formRef.mode = 'edit'
      this.$refs.formRef.dialogVisible = true

      // this.$refs.formRef.formLine={...row}只能拷贝一层
      this.$refs.formRef.formLine = JSON.parse(JSON.stringify(row))

      //城市和多选要单独处理转换成数组
      this.$refs.formRef.formLine.city = row.city.split(',')
      this.$refs.formRef.formLine.multiple_select_answer = row.multiple_select_answer.split(
        ','
      )
    }
  },
  mounted () {
    this.subjectListData()
    this.enterpriseListData()
    this.listData()
  }
}
</script>
