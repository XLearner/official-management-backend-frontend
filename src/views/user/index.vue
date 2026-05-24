<template>
    <div class="container">
        <NewDialog ref="NewRef" @success="getUsers"></NewDialog>
        <PermissionDialog ref="PermRef" @success="getUsers"></PermissionDialog>
        <div class="box">
            <div class="btn-box">
                <el-button class="btn" type="primary" @click="showDialog">添加用户</el-button>
            </div>
            <div class="table-box">
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column prop="account" label="用户名" sortable align="center" />
                    <el-table-column prop="role_name" label="角色" align="center">
                        <template #default="scope">
                            <el-tag v-if="scope.row.role_name" type="success">{{ scope.row.role_name }}</el-tag>
                            <span v-else style="color: #999;">未分配</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" label="创建时间" align="center" />
                    <el-table-column prop="ps" label="备注" align="center" />
                    <el-table-column label="操作" width="200">
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
import { onMounted, ref, onBeforeMount } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { apiDeleteUser, apiGetUsers, apiGetRoles } from '../../api';
import NewDialog from './newDialog.vue';
import PermissionDialog from './permission.vue';

const tableData = ref<any[]>([]);
const NewRef = ref<any>(null);
const PermRef = ref<any>(null);
const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};

// 加载角色列表用于映射
const roleMap = ref<Record<number, string>>({});

const loadRoleMap = async () => {
    const res: any = await apiGetRoles();
    if (res.code >= 0) {
        const map: Record<number, string> = {};
        for (const r of res.data || []) {
            map[r.id] = r.name;
        }
        roleMap.value = map;
    }
};

const getUsers = async () => {
    const res: any = await apiGetUsers();
    if (res.code >= 0 && res.data && res.data.length > 0) {
        // 注入角色名称
        tableData.value = res.data.map((u: any) => ({
            ...u,
            role_name: u.role_id ? (roleMap.value[u.role_id] || '未知') : undefined,
        }));
    } else {
        tableData.value = [];
    }
};

const showDialog = () => {
    NewRef.value.show();
};

const edit = (row: any) => {
    NewRef.value.show(row.id);
};

const modifyPermission = (row: any) => {
    PermRef.value.show(row);
};

const deleteUser = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    apiDeleteUser({ id }).then(res => {
        if (res.code >= 0) {
            ElMessage.success("成功删除一项");
            getUsers();
        }
    }).finally(() => {
        loading.close();
    });
};

onBeforeMount(() => {
    loadRoleMap();
});

onMounted(() => {
    getUsers();
});
</script>

<style scoped>
.tree-wrapper {
    max-width: 500px;
}

.label {
    font-size: 14px;
}
</style>