<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="新增招聘"
    :before-close="beforeClose"
  >
    <el-form :model="form">
      <el-form-item label="岗位名称" :label-width="formLabelWidth">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="岗位描述" :label-width="formLabelWidth">
        <el-input v-model="form.jobDesc" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="岗位要求" :label-width="formLabelWidth">
        <el-input v-model="form.requirement" type="textarea"></el-input>
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
import { apiAddRecruit, apiSetRecruit } from "../../api";

const formLabelWidth = "140px";
const dialogFormVisible = ref(false);

const form = reactive({
  id: "",
  name: "",
  jobDesc: "",
  requirement: "",
  date: "",
});
const modifyId = ref(0);

const emits = defineEmits(["success"]);

const show = (info?: any) => {
  dialogFormVisible.value = true;
  if (info) {
    Object.assign(form, {
      ...info,
    });
    modifyId.value = info.id;
  }
};
const beforeClose = (done: () => void) => {
  clearDialog();
  done();
};
const close = () => {
  dialogFormVisible.value = false;
  modifyId.value = 0;
  clearDialog();
};

const clearDialog = () => {
  form.name = "";
  form.jobDesc = "";
  form.requirement = "";
  modifyId.value = 0;
};
const submit = () => {
  if (modifyId.value > 0) {
    apiSetRecruit({
      id: form.id,
      name: form.name,
      jobDesc: form.jobDesc,
      requirement: form.requirement,
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
    apiAddRecruit({
      ...form,
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
