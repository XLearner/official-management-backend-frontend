<template>
    <div class="container">
        <CustomerDialog ref="dialogRef" @success="loadCustomers" />

        <div class="box">
            <h3>客户管理</h3>
            <div class="toolbar">
                <el-input
                    v-model="keyword"
                    placeholder="搜索公司名称/对接人/客户编号"
                    style="width: 280px; margin-right: 10px;"
                    clearable
                    @keyup.enter="loadCustomers"
                    @clear="loadCustomers"
                >
                    <template #prefix>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
                <el-button type="primary" @click="showAddDialog">新增客户</el-button>
            </div>

            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号" width="70" align="center" />
                <el-table-column prop="customer_no" label="客户编号" width="150" align="center" />
                <el-table-column prop="company_name" label="公司名称" min-width="180" />
                <el-table-column prop="contact_name" label="对接人" width="100" align="center" />
                <el-table-column prop="position" label="职位" width="100" align="center" />
                <el-table-column prop="phone" label="联系电话" width="140" align="center" />
                <el-table-column prop="email" label="邮箱" min-width="160" />
                <el-table-column label="操作" width="160" fixed="right">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除该客户？" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button link type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50]"
                :total="total"
                background
                layout="total, sizes, prev, pager, next"
                @size-change="loadCustomers"
                @current-change="loadCustomers"
                style="margin-top: 16px;"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { apiGetCustomers, apiDeleteCustomer } from '../../api/index';
import CustomerDialog from './dialog.vue';

const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<any[]>([]);
const loading = ref(false);
const dialogRef = ref<any>(null);

const loadCustomers = () => {
    loading.value = true;
    apiGetCustomers(keyword.value || undefined, currentPage.value, pageSize.value)
        .then((res: any) => {
            if (res.code >= 0 && res.data) {
                tableData.value = res.data.list || [];
                total.value = res.data.total || 0;
            }
        })
        .finally(() => {
            loading.value = false;
        });
};

const showAddDialog = () => {
    dialogRef.value?.show();
};

const showEditDialog = (row: any) => {
    dialogRef.value?.show(row.id);
};

const handleDelete = (id: string) => {
    const loading = ElLoading.service({ lock: true, text: '删除中...', background: 'rgba(0,0,0,0.7)' });
    apiDeleteCustomer({ id }).then((res: any) => {
        if (res.code >= 0) {
            ElMessage.success('删除成功');
            loadCustomers();
        } else {
            ElMessage.error(res.msg || '删除失败');
        }
    }).finally(() => loading.close());
};

onMounted(() => {
    loadCustomers();
});
</script>

<style scoped>
.container {
    min-width: 900px;
}

.box h3 {
    margin-bottom: 12px;
}

.toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}
</style>