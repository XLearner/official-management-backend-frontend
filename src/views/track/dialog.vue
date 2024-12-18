<template>
    <el-dialog v-model="dialogFormVisible" title="订单编辑" :before-close="beforeClose" :width="800">
        <el-form :model="form">
            <el-form-item label="订单号" :label-width="formLabelWidth">
                <el-input v-model="form.orderId"></el-input>
            </el-form-item>
            <el-form-item label="当前状态" :label-width="formLabelWidth">
                <el-select v-model="form.state" placeholder="状态" size="large" style="width: 240px">
                    <el-option v-for="item in stateOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="日期" :label-width="formLabelWidth">
                <el-date-picker v-model="form.time" type="datetime" placeholder="选择日期和时间"
                    format="YYYY/MM/DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="目的国" :label-width="formLabelWidth">
                <el-select v-model="form.destination" filterable placeholder="目的国" size="large" style="width: 240px">
                    <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh"
                        :value="item.code" />
                </el-select>
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
import { ElMessage } from 'element-plus';
import { reactive, ref, defineEmits, defineExpose } from "vue";
import { apiAddTrack, apiSetTrack } from "../../api";
import countryOption from './country';

const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const modifyId = ref(0);
const stateOptions = [
    {
        id: '0',
        name: "待上网"
    },
    {
        id: '1',
        name: "运输中"
    },
    {
        id: '2',
        name: "派送中"
    },
    {
        id: '3',
        name: "投递失败"
    },
    {
        id: '4',
        name: "成功签收"
    },
    {
        id: '5',
        name: "可能异常"
    },
]

const form = reactive({
    orderId: "",
    state: '0',
    time: new Date(),
    destination: "",
});
const emits = defineEmits(["success"]);

const show = () => {
    dialogFormVisible.value = true;
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
    form.orderId = "";
    form.state = "0";
    form.time = new Date();
    form.destination = "";
};

const submit = () => {
    if (!form.orderId || !form.state || !form.destination || !form.time) {
        ElMessage.error('信息填写不完整');
        return;
    }
    apiAddTrack({
        id: form.orderId,
        state: form.state,
        updateTime: form.time.getTime().toString(),
        origin: "CN",
        destination: form.destination
    }).then(res => {
        if (res.code === 0) {
            ElMessage.success('新增成功');
            clearDialog();
            emits("success");
            close();
        } else {
            ElMessage.info(res.msg);
        }
    })
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