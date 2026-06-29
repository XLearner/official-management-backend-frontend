<template>
    <el-dialog v-model="dialogFormVisible" title="用户编辑" :before-close="beforeClose" :width="500">
        <el-form :model="form" label-width="100px">
            <el-form-item label="用户名">
                <el-input v-model="form.account" :disabled="!!form.id" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item v-if="!form.id" label="密码（默认密码）">
                <el-input disabled placeholder="Abc@13579" />
            </el-form-item>
            <el-form-item label="分配角色">
                <el-select v-model="form.role_id" placeholder="请选择角色" style="width: 100%;" clearable>
                    <el-option
                        v-for="role in roleList"
                        :key="role.id"
                        :label="role.name + (role.remark ? ' - ' + role.remark : '')"
                        :value="role.id"
                    >
                        <span>{{ role.name }}</span>
                        <el-tag v-if="isBuiltIn(role)" size="small" type="info" style="margin-left: 8px;">内置</el-tag>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.ps" type="textarea" :rows="2" placeholder="备注信息" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" :loading="saving" @click="submit">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref } from "vue";
import { apiAddUser, apiGetUsers, apiSetUser, apiGetRoles } from "../../api";
import md5 from 'md5';

const dialogFormVisible = ref(false);
const saving = ref(false);
const roleList = ref<any[]>([]);

const form = reactive({
    id: "",
    account: '',
    date: new Date(),
    role_id: null as number | null,
    ps: "",
    pwd: "Abc@13579",
});

const emits = defineEmits(["success"]);

const isBuiltIn = (role: any) => {
    return ['R000000001', 'R000000002', 'R000000003'].includes(role.role_no);
};

const loadRoles = async () => {
    const res: any = await apiGetRoles();
    if (res.code >= 0) {
        roleList.value = res.data || [];
    }
};

const show = async (id: string) => {
    dialogFormVisible.value = true;
    await loadRoles();

    if (id) {
        const res: any = await apiGetUsers(id);
        if (res.code >= 0 && res.data && res.data.length > 0) {
            const user = res.data[0];
            form.id = user.id;
            form.account = user.account;
            form.date = new Date(user.date);
            form.role_id = user.role_id || null;
            form.ps = user.ps || '';
        }
    } else {
        clearDialog();
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
    form.role_id = null;
    form.ps = "";
};

const submit = async () => {
    if (!form.account) {
        ElMessage.error('用户名不能为空');
        return;
    }

    saving.value = true;

    try {
        if (form.id) {
            const res: any = await apiSetUser({
                id: form.id,
                account: form.account,
                role_id: form.role_id?.toString() || '',
                ps: form.ps || '',
            });

            if (res.code >= 0) {
                ElMessage.success('修改成功');
                emits("success");
                close();
            } else {
                ElMessage.error(res.msg || '修改失败');
            }
        } else {
            const res: any = await apiAddUser({
                account: form.account,
                date: form.date.getTime().toString(),
                pwd: md5(form.pwd),
                role_id: form.role_id?.toString() || '',
                ps: form.ps || '',
            });

            if (res.code >= 0) {
                ElMessage.success('新增成功');
                emits("success");
                close();
            } else {
                ElMessage.error(res.msg || '新增失败');
            }
        }
    } catch (err) {
        console.error(err);
        ElMessage.error('操作失败');
    } finally {
        saving.value = false;
    }
};

defineExpose({ show, close });
</script>

<style scoped>
.avatar-uploader .avatar {
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