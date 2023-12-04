<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="新增优势"
    :before-close="beforeClose"
  >
    <el-form :model="form">
      <el-form-item label="图片" :label-width="formLabelWidth">
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
      <el-form-item label="核心优势" :label-width="formLabelWidth">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="是否展示" :label-width="formLabelWidth">
        <el-switch v-model="form.ifShow" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, UploadProps } from "element-plus";
import { reactive, ref, defineEmits, defineExpose } from "vue";
import { apiAddAdvantage, apiSetAdvantage } from "../../api";

const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const imageUrl = ref("");
const imgHeader = ref({
  zhtoken: localStorage.getItem("zh_token"),
});
const modifyId = ref(0);

const form = reactive({
  id: "",
  img: "",
  title: "",
  description: "",
  ifShow: true,
});

const emits = defineEmits(["success"]);

const show = (info?: any) => {
  dialogFormVisible.value = true;
  if (info) {
    Object.assign(form, {
      ...info,
      ifShow: info.ifShow === "1" ? true : false,
    });
    imageUrl.value = info.img
    modifyId.value = info.id;
  }
};
const close = () => {
  dialogFormVisible.value = false;
  clearDialog();
};
const beforeClose = (done: () => void) => {
  clearDialog();
  done();
};

const clearDialog = () => {
  form.description = "";
  form.img = "";
  form.title = "";
  imageUrl.value = "";
  modifyId.value = 0;
};
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  if (response.code >= 0) {
    form.img = response.data.imgurl;
  }
};
const submit = () => {
  if (modifyId.value > 0) {
    apiSetAdvantage({
      id: form.id,
      img: form.img,
      title: form.title,
      description: form.description,
      ifShow: form.ifShow ? "1" : "0",
    }).then((res) => {
      if (res.code === 0) {
        ElMessage.success("更新成功");
        close();
        emits("success");
      } else {
        ElMessage.info(res.msg);
      }
    });
  } else {
    apiAddAdvantage({
      ...form,
      ifShow: form.ifShow ? "1" : "0",
    }).then((res) => {
      if (res.code >= 0) {
        dialogFormVisible.value = false;
        clearDialog();
        emits("success");
      }
    });
  }
};

defineExpose({ show, close });
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
