<template>
    <el-dialog v-model="dialogFormVisible" title="用户编辑" :before-close="beforeClose" :width="800">
        <el-form :model="form">
            <!-- <el-form-item label="订单号" :label-width="formLabelWidth">
                <el-input v-model="form.orderId"></el-input>
            </el-form-item> -->
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.account" :disabled="!!form.id"></el-input>
            </el-form-item>
            <el-form-item v-if="!form.id" label="密码（默认密码）" :label-width="formLabelWidth">
                <el-input disabled placeholder="Abc@13579"></el-input>
            </el-form-item>
            <el-form-item label="权限等级" :label-width="formLabelWidth">
                <el-select v-model="form.permission" placeholder="权限" size="large" style="width: 240px">
                    <el-option v-for="item in permissionOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.ps"></el-input>
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
import { reactive, ref } from "vue";
import { apiAddUser, apiGetUsers, apiSetUser } from "../../api";
import md5 from 'md5';

const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const permissionOptions = [
    {
        id: '1',
        name: "管理员"
    },
    {
        id: '2',
        name: "普通用户"
    },
]

const form = reactive({
    id: "",
    account: '',
    date: new Date(),
    permission: "",
    ps: "",
    pwd: "Abc@13579",
});
const emits = defineEmits(["success"]);

const show = (id: string) => {
    dialogFormVisible.value = true;
    if (id) {
        apiGetUsers(id).then(res => {
            form.account = res.data[0].account;
            form.date = res.data[0].date;
            form.id = res.data[0].id;
            form.permission = res.data[0].permission;
            form.ps = res.data[0].ps;
        })
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
    form.id = "";
    form.account = "";
    form.date = new Date();
    form.permission = "";
    form.ps = "";
};

const submit = () => {
    if (!form.permission || !form.account) {
        ElMessage.error('信息填写不完整');
        return;
    }
    if (form.id) {
        apiSetUser({
            id: form.id,
            account: form.account,
            permission: form.permission,
            ps: form.ps,
        }).then(res => {
            if (res.code === 0) {
                ElMessage.success('修改成功');
                clearDialog();
                emits("success");
                close();
            } else {
                ElMessage.info(res.msg);
            }
        })
    } else {
        apiAddUser({
            account: form.account,
            date: form.date.getTime().toString(),
            pwd: md5(form.pwd),
            permission: form.permission,
            ps: form.ps || ''
        }).then((res: IResp) => {
            if (res.code === 0) {
                ElMessage.success('新增成功');
                clearDialog();
                emits("success");
                close();
            } else {
                ElMessage.info(res.msg);
            }
        })
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