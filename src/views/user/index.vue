<template>
    <div class="container">
        <NewDialog ref="NewRef" @success="getUsers"></NewDialog>
        <div class="box">
            <div class="btn-box">
                <el-button class="btn" type="primary" @click="showDialog">添加用户</el-button>

            </div>
            <div class="table-box">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column prop="account" label="用户名" sortable align="center" />
                    <el-table-column prop="permission" label="权限等级" align="center" :formatter="formatter" />
                    <el-table-column prop="date" label="创建时间" align="center" />
                    <el-table-column prop="ps" label="备注" align="center" />
                    <el-table-column label="Operations" width="160">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="edit(scope.row)"
                                :disabled="scope.row.account == 'admin'">编辑</el-button>
                            <el-button link type="primary" size="small" :disabled="scope.row.account == 'admin'"
                                @click="modifyPermission(scope.row)">权限</el-button>
                            <el-popconfirm title="确认删除？" @confirm="deleteUser(scope.row.id.toString())">
                                <template #reference>
                                    <el-button link type="primary" size="small"
                                        :disabled="scope.row.account == 'admin'">删除</el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="usermanage">
import { onMounted, ref } from 'vue';
import { ElLoading, ElMessage, ElTree } from 'element-plus';
import { apiDeleteUser, apiGetUsers } from '../../api';
import NewDialog from './newDialog.vue';


const tableData = ref([]);
const NewRef = ref<any>(null);
const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};

// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
    // 获取选中的权限
    console.log(tree.value!.getCheckedKeys(false));
};

const formatter = (row: { permission: Permission }) => {
    const i = ['超级管理员', '管理员', '普通用户'];
    return i[row.permission];
}

const getUsers = () => {
    apiGetUsers().then(res => {
        if (res.code >= 0 && res.data && res.data.length > 0) {
            tableData.value = res.data;
        }
    })
}

// 添加用户弹窗
const showDialog = () => {
    NewRef.value.show()
}

// 编辑用户
const edit = (row: any) => {
    NewRef.value.show(row.id)
}

// 修改权限弹窗
const modifyPermission = (id: string) => {

}

// 添加用户弹窗
const deleteUser = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    console.log(id);
    apiDeleteUser({ id }).then(res => {
        if (res.code >= 0) {
            ElMessage.success("成功删除一项");
            getUsers();
        }
    }).finally(() => {
        loading.close()
    });
}

onMounted(() => {
    getUsers()
})

</script>

<style scoped>
.tree-wrapper {
    max-width: 500px;
}

.label {
    font-size: 14px;
}
</style>
