<template>
  <div class="question-type">
    <div v-if="formLine.type === 1">
      <!-- 遍历生成一行一行的数据 -->
      <div
        class="item"
        v-for="item in formLine.select_options"
        :key="item.label"
      >
        <!-- el-radio的v-model要绑定同一个值 -->
        <el-radio v-model="formLine.single_select_answer" :label="item.label">
        </el-radio>
        <!-- 要双向绑定的是 每一项的item -->
        <el-input v-model="item.text"></el-input>
        <!-- 这个要传递item，因为上传成功之后，要给每一项的image -->
        <upload-file type="image" :obj="item" />
      </div> 
    </div>
    <div v-else-if="formLine.type === 2">
      <div
        class="item"
        v-for="item in formLine.select_options"
        :key="item.label"
      >
      
        <el-checkbox
          v-model="formLine.multiple_select_answer"
          :label="item.label"
          ></el-checkbox
        >
        <el-input v-model="item.text"> </el-input>
        <upload-file type="image" :obj="item" />
      </div>
    </div>
    <div v-else-if="formLine.type === 3">
      <el-input type="textarea" rows="10" v-model="formLine.short_answer">
      </el-input>
    </div>
  </div>
</template>
<script>
import UploadFile from './Upload-file'

export default {
  name: 'QuestionType',
  components: {
    UploadFile
  },
  props: {
    formLine: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>

<style lang="less">
.question-type {
  .el-input {
    color: #606266;
    cursor: pointer;
    margin-left: 20px;
    margin-right: 20px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
