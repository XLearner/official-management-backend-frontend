<template>
  <el-dialog v-model="dialogFormVisible" title="新增相关服务" :before-close="beforeClose" :width="800">
    <el-form :model="form">
      <el-form-item label="图片" :label-width="formLabelWidth">
        <el-upload class="avatar-uploader" :action="uploadImgUrl" name="files" :headers="imgHeader"
          :show-file-list="false" :on-success="handleAvatarSuccess">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="英文" :label-width="formLabelWidth">
        <el-input v-model="form.engTit"></el-input>
      </el-form-item>
      <el-form-item label="是否展示" :label-width="formLabelWidth">
        <el-switch v-model="form.ifShow" />
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <!-- <el-input v-model="form.description" type="textarea"></el-input> -->
        <Editor ref="editorRef"></Editor>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submit"> Confirm </el-button>
      </span>
    </template>
    <!-- <Editor></Editor> -->
  </el-dialog>
</template>

<script setup lang="ts">
import Editor from '../../components/editor.vue';
import { ElMessage, UploadProps } from "element-plus";
import { reactive, ref, defineEmits, defineExpose, onMounted } from "vue";
import { apiAddRelative, apiSetRelative, baseURL } from "../../api";

const uploadImgUrl = `${baseURL}/v1/upload`;
const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const imageUrl = ref("");
const editorRef = ref(null);
const imgHeader = ref({
  zhtoken: localStorage.getItem("zh_token"),
});
const modifyId = ref(0);

const form = reactive({
  id: "",
  img: "",
  title: "",
  engTit: "",
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
      img: new URL(info.img).pathname,
    });
    imageUrl.value = info.img;
    modifyId.value = info.id;

    // console.log((editorRef as any).value, (editorRef as any).value.setHtml);
    // (editorRef as any).value.setHtml(form.description);
    setTimeout(() => {
      (editorRef as any).value.setHtml(form.description);
    }, 100)
  }
};
const close = () => {
  dialogFormVisible.value = false;
  clearDialog();
  (editorRef as any).value.clear();
};
const beforeClose = (done: () => void) => {
  clearDialog();
  done();
};

const clearDialog = () => {
  form.title = "";
  form.engTit = "";
  form.description = "";
  form.img = "";
  form.ifShow = true;
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
  const description = (editorRef as any).value.getHtml();
  if (modifyId.value > 0) {
    // const imgurl = new URL(form.img).pathname;
    apiSetRelative({
      id: form.id,
      img: form.img,
      title: form.title,
      engTit: form.engTit,
      description: description,
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
    apiAddRelative({
      ...form,
      description,
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
