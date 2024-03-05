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
      <el-form-item label="宣传图片" label-width="120px">
        <el-upload
          class="avatar-uploader"
          :action="uploadImgUrl"
          name="files"
          :headers="imgHeader"
          :show-file-list="false"
          :on-success="handlePubSuccess"
        >
          <img v-if="pubImageUrl" :src="pubImageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
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
import { ElMessage, ElLoading, UploadProps } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { apiGetBaseInfo, apiSaveBaseInfo } from "../api";

const FormRef = ref<any>(null);
const imageUrl = ref("");
const pubImageUrl = ref("");
// const uploadImgUrl = "http://43.139.70.11:8903/v1/upload";
const uploadImgUrl = "http://localhost:8903/v1/upload";
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
  descImg: "",
  description: "",
});
let loading: any = null;

const getBaseInfo = () => {
  apiGetBaseInfo("中瀚").then((res) => {
    if (res.code >= 0) {
      Object.assign(form, res.data);
      imageUrl.value = form.logo;
      pubImageUrl.value = form.descImg;
      form.logo = new URL(form.logo).pathname;
      form.descImg = new URL(form.descImg).pathname;
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
const handlePubSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  pubImageUrl.value = URL.createObjectURL(uploadFile.raw!);
  if (response.code >= 0) {
    form.descImg = response.data.imgurl;
  }
};
const submitForm = () => {
  loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  apiSaveBaseInfo({
    ...form,
  })
    .then((res) => {
      if (res.code >= 0) {
        ElMessage.success("更新成功");
        getBaseInfo();
      } else {
        ElMessage.error(res.msg);
      }
    })
    .finally(() => {
      loading.close();
    });
};

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
