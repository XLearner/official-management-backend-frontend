<template>
  <div class="container">
    <h2>公司信息</h2>
    <el-form ref="FormRef" class="form-box" :model="form" label-width="120px">
      <el-form-item label="公司名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="公司logo" label-width="120px">
        <el-upload
          class="avatar-uploader"
          action="http://43.139.70.11:8903/v1/upload"
          name="files"
          :headers="imgHeader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="公司地址">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="公司电话">
        <el-input v-model="form.tel" />
      </el-form-item>
      <el-form-item label="公司邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.description" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item label="copyright">
        <el-input v-model="form.copyright" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()"> Create </el-button>
        <!-- <el-button @click="resetForm(FormRef)">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, UploadProps } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { apiGetBaseInfo, apiSaveBaseInfo } from "../api";

const FormRef = ref<any>(null);
const imageUrl = ref("");
const imgHeader = ref({
  zhtoken: localStorage.getItem("zh_token"),
});
// do not use same name with ref
const form = reactive({
  id: "",
  name: "",
  logo: "",
  address: "",
  tel: "",
  email: "",
  copyright: "",
  description: "",
});

const getBaseInfo = () => {
  apiGetBaseInfo("中瀚").then((res) => {
    if (res.code >= 0) {
      console.log(res);
      Object.assign(form, res.data);
      imageUrl.value = form.logo;
    }
  });
};
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  if (response.code >= 0) {
    form.logo = response.data.imgurl;
  }
};
const submitForm = () => {
  apiSaveBaseInfo({
    ...form
  }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("更新成功");
      getBaseInfo();
    } else {
      ElMessage.error(res.msg);
    }
  });
};
// const resetForm = (formEl?: FormInstance) => {
//   if (!formEl) return;
//   formEl.resetFields();
//   form.name = "";
//   form.logo = "";
//   form.address = "";
//   form.email = "";
//   form.tel = "";
//   form.copyright = "";
//   form.description = "";
// };

onMounted(() => {
  getBaseInfo();
});
</script>

<style scoped>
.form-box {
  margin-top: 20px;
}

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
