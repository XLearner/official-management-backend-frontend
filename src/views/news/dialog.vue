<template>
  <el-dialog v-model="dialogFormVisible" title="编辑新闻" :before-close="beforeClose" :width="800">
    <el-form :model="form">
      <el-form-item label="封面图" :label-width="formLabelWidth">
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
      <el-form-item label="日期" :label-width="formLabelWidth">
        <el-date-picker
          v-model="form.time"
          type="date"
          placeholder="选择日期"
          size="default"
        />
      </el-form-item>
      <el-form-item label="内容" :label-width="formLabelWidth">
        <!-- <el-input v-model="form.content" type="textarea"></el-input> -->
        <Editor ref="editorRef"></Editor>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
    <!-- <Editor></Editor> -->
  </el-dialog>
</template>

<script setup lang="ts">
import Editor from '../../components/editor.vue';
// @ts-ignore
import { ElMessage, UploadProps } from 'element-plus';
import { reactive, ref, defineEmits, defineExpose, onMounted } from "vue";
import { apiAddNews, apiSetNews, baseURL } from "../../api";

const uploadImgUrl = `${baseURL}/v1/upload`;
const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const imageUrl = ref("");
const editorRef = ref(null);
const imgHeader = ref({
  zhtoken: localStorage.getItem("zh_token"),
});
const modifyId = ref(0);

const transTime = (date: Date) => {
  const time = new Date(date);
  return "" + time.getFullYear() + (time.getMonth() + 1).toString().padStart(2, "0") + time.getDate().toString().padStart(2, '0');
}
const transDate = (date: string) => {
  const year = +date.slice(0, 4);
  const month = +date.slice(4, 6) - 1;
  const day = +date.slice(6);
  return new Date(year, month, day);
}

const form = reactive({
  id: "",
  title: "",
  outImg: "",
  time: new Date(),
  content: "",
});
const emits = defineEmits(["success"]);

const show = (info?: any) => {
  dialogFormVisible.value = true;
  if (info) {
    Object.assign(form, {
      ...info,
      time: transDate(info.time),
      outImg: new URL(info.outImg).pathname,
    });
    imageUrl.value = info.outImg;
    modifyId.value = info.id;

    // console.log((editorRef as any).value, (editorRef as any).value.setHtml);
    // (editorRef as any).value.setHtml(form.description);
    setTimeout(() => {
      (editorRef as any).value.setHtml(form.content);
    }, 100)
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
  form.title = "";
  form.outImg = "";
  form.time = new Date();
  form.content = "";
  imageUrl.value = "";
  modifyId.value = 0;
  
  (editorRef as any).value.clear();
};
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  if (response.code >= 0) {
    form.outImg = response.data.imgurl;
  }
};

const submit = () => {
  const content = (editorRef as any).value.getHtml();
  if (modifyId.value > 0) {
    // const imgurl = new URL(form.outImg).pathname;
    apiSetNews({
      id: form.id,
      outImg: form.outImg,
      title: form.title,
      time: transTime(form.time),
      content: content,
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
    apiAddNews({
      ...form,
      time: transTime(form.time),
      content,
    }).then((res) => {
      if (res.code >= 0) {
        dialogFormVisible.value = false;
        clearDialog();
        emits("success");
      }
    });
  }
  // console.log(transTime(form.time as any as Date), content);
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
