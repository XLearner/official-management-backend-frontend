<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="新增亮点"
    :before-close="beforeClose"
  >
    <el-form :model="form">
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="英文标题" :label-width="formLabelWidth">
        <el-input v-model="form.engTit"></el-input>
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
import { reactive, ref, defineExpose } from "vue";
import {
  apiAddHighlightBusi,
  apiSetHighlightBusi,
} from "../../api";

const formLabelWidth = "140px";
const dialogFormVisible = ref(false);

const form = reactive({
  id: "",
  title: "",
  engTit: "",
  description: "",
  ifShow: true,
});
const modifyId = ref(0);

const emits = defineEmits(["success"]);

const show = (info?: any) => {
  dialogFormVisible.value = true;
  if (info) {
    Object.assign(form, {
      ...info,
      ifShow: info.ifShow === "1" ? true : false,
    });
    modifyId.value = info.id;
  }
};
const beforeClose = (done: () => void) => {
  clearDialog();
  done()
};
const close = () => {
  dialogFormVisible.value = false;
  modifyId.value = 0
  clearDialog();
};

const clearDialog = () => {
  form.title = "";
  form.engTit = "";
  form.description = "";
  form.ifShow = true;
};
const submit = () => {
  if (modifyId.value > 0) {
    apiSetHighlightBusi({
      id: form.id,
      title: form.title,
      engTit: form.engTit,
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
    apiAddHighlightBusi({
      ...form,
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
  }
};

defineExpose({ show, close });
</script>

<style scoped></style>
