<template>
  <div class="question-edit">
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" fullscreen center>
      <div class="title" slot="title">
        {{ mode === 'add' ? '新增题目' : '修改题目' }}
      </div>
      <el-form
        :model="formLine"
        ref="form"
        :rules="rules"
        label-width="120px"
        :inline="false"
        size="normal"
        class="form"
        label-position="left"
      >
        <el-form-item label="学科" prop="subject">
          <el-select
            v-model="formLine.subject"
            placeholder="请选择学科"
            class="select"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in subjectList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select
            class="select"
            v-model="formLine.step"
            placeholder="请选择阶段"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in stepObj"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select
            class="select"
            v-model="formLine.enterprise"
            placeholder="请选择企业"
          >
            <el-option
              :label="item.name"
              :value="item.eid"
              v-for="item in enterpriseList"
              :key="item.eid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <!-- 城市 -->
          <el-cascader
            class="select"
            :options="options"
            :props="{value:'label'}"
            v-model="formLine.city"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="题型" prop="type" @change="typeChange">
          <el-radio-group v-model="formLine.type">
            <el-radio
              :label="item.value"
              v-for="item in typeObj"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="formLine.difficulty">
            <el-radio
              :label="item.value"
              v-for="item in degreeObj"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <hr class="hrMargin" />

        <el-form-item label="试题标题" prop="title" class="setMargin">
          <!-- 富文本编辑器 -->
          <quill-editor
            v-model="formLine.title"
            :options="{ placeholder: '请输入试题标题' }"
            
            @blur="onEditorBlur('title')"
          >
          </quill-editor>
        </el-form-item>

        <!-- 题型 -->
        <el-form-item
          :prop="propTypeObj[formLine.type]"
          :label="questionTypeObj[formLine.type]"
        >
          <!-- 向子组件传值 -->
          <question-type :formLine="formLine"></question-type>
        </el-form-item>

        <hr class="hrMargin" />
        <!-- 解析视频 -->
        <el-form-item label="解析视频">
          <upload-file type="video" :obj="formLine"></upload-file>
        </el-form-item>

        <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
          <!-- 富文本编辑器 -->
          <quill-editor
            v-model="formLine.answer_analyze"
            :options="{ placeholder: '请输入答案解析...' }"
            @blur="onEditorBlur('answer_analyze')"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="试题备注" prop="remark">
          <el-input v-model="formLine.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 导入城市
import { regionData } from 'element-china-area-data'

// 富文本编辑器
import { quillEditor } from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入子组件questionType
import QuestionType from './Question-type'

// 导入子组件upload-file
import UploadFile from './Upload-file'

export default {
  name: 'QuestionUpdate',
  components: {
    quillEditor,
    QuestionType,
    UploadFile
  },
  props: {
    subjectList: {
      type: Array,
      default: function () {
        return []
      }
    },
    enterpriseList: {
      type: Array,
      default: function () {
        return []
      }
    },
    stepObj: {
      type: Array,
      default: function () {
        return []
      }
    },
    typeObj: {
      type: Array,
      default: function () {
        return []
      }
    },
    degreeObj: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      mode: '', //模块提示'add';'edit'
      dialogVisible: false,
      options: regionData,
      formLine: {
        id: '',
        title: '',
        subject: '',
        step: '',
        enterprise: '',
        city: [],
        type: 1,
        difficulty: 1,
        single_select_answer: '', //单选
        // 这里要定义为数组,因为是多选
        multiple_select_answer: [], //多选
        short_answer: '', //简答
        video: '', //视频
        answer_analyze: '', //答案
        remark: '', //备注
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
      },
      questionTypeObj: {
        // 题型切换的时候，显示不同的标题
        1: '单选',
        2: '多选',
        3: '简答'
      },
      propTypeObj: {
        // 校验类型的对象（校验单选答案、多选答案、简答答案）
        1: 'single_select_answer',
        2: 'multiple_select_answer',
        3: 'short_answer'
      },

      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        subject: [
          { required: true, message: '学科不能为空', trigger: 'change' }
        ],
        step: [{ required: true, message: '阶段不能为空', trigger: 'change' }],
        city: [{ required: true, message: '城市不能为空', trigger: 'change' }],
        enterprise: [
          { required: true, message: '企业不能为空', trigger: 'change' }
        ],
        type: [{ required: true, message: '题型不能为空', trigger: 'change' }],
        difficulty: [
          { required: true, message: '难度不能为空', trigger: 'change' }
        ],

        answer_analyze: [
          { required: true, message: '答案解析不能为空', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        single_select_answer: [
          { required: true, message: '单选不能为空', trigger: 'change' }
        ],
        multiple_select_answer: [
          { required: true, message: '多选不能为空', trigger: 'change' }
        ],
        short_answer: [
          { required: true, message: '简答不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击提交
    submit () {
      // 提交进行全局校验,发送请求,页面显示隐藏,表单数据清空,上传的照片清空
      this.$refs.form.validate(async valid => {
        if (!valid) return

        let url = ''
        let message = ''
        if (this.mode === 'add') {
          delete this.formLine.id
          url = '/question/add'
          message = '新增成功'
        } else {
         // 修改的时候城市要传递字符串
          this.formLine.city=this.formLine.city.join(',')
          url = '/question/edit'
          message = '编辑成功'
        }
        const res = await this.$http.post(url, this.formLine)

        if (res.code === 200) {
          this.$message({
            type: 'success',
            message
          })

          this.dialogVisible = false

          // 父组件的search方法要调用
          this.$parent.search()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 编辑器失去焦点的时候触发，其实在模拟element-ui中的el-input
    onEditorBlur (fieldName) {
      // 富文本校验需要手动的开始校验
      this.$refs.form.validateField(fieldName)
    },
    // 切换类型
    typeChange () {
      this.$refs.form.clearValidate([
        'single_select_answer',
        'multiple_select_answer',
        'short_answer'
      ])
    }
  },
  // 监听
  watch: {
    dialogVisible (newValue) {
      if (!newValue) {
        this.$refs.form.clearValidate()
      }
    }
  }
}
</script>

<style lang="less">
// 如果有直接更改第三方的样式，不要加scoped
.question-edit {
  .el-dialog__header {
    padding: 0;
    text-align: left;
  }
  .title {
    color: #fff;
    padding-left: 15px;
    height: 54px;
    line-height: 54px;
    background-color: #04bcfa;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
    .select {
      width: 300px;
    }
  }
  .hrMargin {
    margin-bottom: 20px;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .ql-editor {
    height: 200px;
  }
}
</style>
