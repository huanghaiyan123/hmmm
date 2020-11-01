<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="imgUrl"
      :data="urlObj"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <video v-else-if="videoUrl" :src="videoUrl" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'UploadFile',
  props: {
    type: String, //是video或者是image
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
 
  watch: {
    obj () {
      if (
        (this.type === 'image' || this.type === 'video') &&
        (this.obj.image === '' || this.obj.video === '')
      ) {
        this.imageUrl = ''
        this.videoUrl = ''
      } else if (this.type === 'image' && this.obj.image) {
        this.imageUrl = process.env.VUE_APP_BASEURL + this.obj.image
      } else if (this.type === 'video' && this.obj.video) {
        this.videoUrl = process.env.VUE_APP_BASEURL + this.obj.video
      }
    }
  },

  data () {
    return {
      imageUrl: '',
      videoUrl: '',
      urlObj: {
        file: ''
      },
      //  action：上传的地址，它上传跟axios没有关系，它是自己封装的，地址要写全
      imgUrl: process.env.VUE_APP_BASEURL + '/question/upload' // 上传头像的地址
    }
  },
  methods: {
    // 上传以前
    beforeAvatarUpload (file) {
      // 第二就是把上传的data属性里面进行赋值
      this.urlObj.file = file
      // 在上传以前需要做两件事,第一文件上传需要限定格式
      if (this.type === 'image') {
        const isJPG =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是JPEG或者PNG或者GIF')
        }

        if (!isLt2M) {
          this.$message.error('上传头像图片只能小于或者等于2M')
        }

        return isLt2M && isJPG
      } else {
        const isVideo = file.type === 'video/mp4' || file.type === 'video/avi'
        const isLt2M = file.size / 1024 < 1024 / 2

        if (!isVideo) {
          this.$message.error('上传的视频只能是MP4,AVI格式')
        }
        if (!isLt2M) {
          this.$message.error('上传视频大小不能超过2MB')
        }
        return isLt2M && isVideo
      }
    },
    // 上传成功以后
    handleAvatarSuccess (res, file) {
      console.log(file)
      if (this.type === 'image') {
        // 第一个就是头像上传进行赋值
        // 第二个就是把传递过来的模型赋值

        this.imageUrl = process.env.VUE_APP_BASEURL + res.data.url
        this.obj.image = res.data.url
      } else {
        // 为了实现预览
        this.videoUrl = process.env.VUE_APP_BASEURL + res.data.url
        this.obj.video = res.data.url
      }
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
