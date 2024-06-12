<template>
  
    <el-dialog v-model="dialogFormVisible" title="新增banner" :before-close="beforeClose">
        <el-form :model="form">
          <el-form-item label="图片" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              :action="uploadImgUrl"
              name="files"
              :headers="imgHeader"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit"> 保存 </el-button>
          </span>
        </template>
      </el-dialog>
  
  </template>
  
  <script setup lang="ts">
  // @ts-ignore
  import { UploadProps } from 'element-plus';
  import { reactive, ref, defineEmits, defineExpose } from 'vue';
  import { apiSaveBanner, baseURL } from '../../api';
  
  const uploadImgUrl = `${baseURL}/v1/upload`;
  const formLabelWidth = "140px";
  const dialogFormVisible = ref(false);
  const imageUrl = ref("");
  const imgHeader = ref({
    zhtoken: localStorage.getItem("zh_token"),
  });
  
  const form = reactive({
    title: "",
    description: "",
    imgurl: "",
  });
  
  const emits = defineEmits(['success'])
  
  const show = () => {
    dialogFormVisible.value = true
  }
  const close = () => {
    dialogFormVisible.value = false
    clearDialog();
  }
  const beforeClose = (done: () => void) => {
    clearDialog();
    done()
  };
  
  const clearDialog = () => {
    form.title = "";
    form.description = "";
    form.imgurl = "";
    imageUrl.value = "";
  };
  const handleAvatarSuccess: UploadProps["onSuccess"] = (
    response: any,
    uploadFile: any
  ) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    if (response.code >= 0) {
      form.imgurl = response.data.imgurl;
    }
  };
  const submit = () => {
    apiSaveBanner(form).then((res) => {
      if (res.code >= 0) {
        dialogFormVisible.value = false;
        clearDialog();
        emits('success')
      }
    });
  };
  
  defineExpose({show, close})
  </script>
  
  <style scoped>
  
  .avatar-uploader .avatar {
    /* width: 178px; */
    height: 178px;
    display: block;
  }
  </style>
  
  <style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  </style>