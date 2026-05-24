<template>
    <div class="container">
        <div class="permission-layout">
            <!-- 左侧：角色列表 -->
            <div class="role-panel">
                <div class="panel-header">
                    <span class="panel-title">角色列表</span>
                    <el-button type="primary" size="small" @click="showAddRole">新增角色</el-button>
                </div>
                <el-scrollbar height="calc(100vh - 200px)">
                    <div
                        v-for="role in roleList"
                        :key="role.id"
                        class="role-item"
                        :class="{ active: currentRole?.id === role.id }"
                        @click="selectRole(role)"
                    >
                        <div class="role-info">
                            <span class="role-name">{{ role.name }}</span>
                            <el-tag v-if="isBuiltIn(role)" size="small" type="info">内置</el-tag>
                        </div>
                        <div v-if="!isBuiltIn(role)" class="role-actions">
                            <el-button link type="primary" size="small" @click.stop="editRole(role)">编辑</el-button>
                            <el-popconfirm title="确认删除该角色？" @confirm="deleteRole(role.id)">
                                <template #reference>
                                    <el-button link type="danger" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </div>
                </el-scrollbar>
            </div>

            <!-- 右侧：菜单权限配置 -->
            <div class="permission-panel">
                <div class="panel-header">
                    <span class="panel-title">
                        菜单权限配置
                        <span v-if="currentRole" class="current-role-name">— {{ currentRole.name }}</span>
                    </span>
                    <el-button
                        v-if="currentRole && !isBuiltIn(currentRole)"
                        type="primary"
                        @click="savePermission"
                        :loading="saving"
                    >
                        保存配置
                    </el-button>
                </div>

                <div v-if="!currentRole" class="empty-tip">
                    请从左侧选择一个角色进行权限配置
                </div>

                <div v-else class="menu-tree-wrapper">
                    <el-tree
                        ref="treeRef"
                        :data="menuData"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :default-checked-keys="checkedKeys"
                        :props="{ children: 'children', label: 'label' }"
                        @check-change="handleCheckChange"
                    />
                </div>
            </div>
        </div>

        <!-- 新增/编辑角色弹窗 -->
        <el-dialog
            v-model="roleDialogVisible"
            :title="editingRole ? '编辑角色' : '新增角色'"
            width="400px"
            :close-on-click-modal="false"
        >
            <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="roleForm.remark" type="textarea" :rows="2" placeholder="备注信息" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="roleDialogVisible = false">取消</el-button>
                <el-button type="primary" :loading="savingRole" @click="submitRole">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElTree, FormInstance, FormRules } from 'element-plus';
import { apiGetRoles, apiAddRole, apiSetRole, apiDeleteRole } from '../../api/index';

const roleList = ref<any[]>([]);
const currentRole = ref<any>(null);
const treeRef = ref<InstanceType<typeof ElTree>>();
const saving = ref(false);
const savingRole = ref(false);
const roleDialogVisible = ref(false);
const editingRole = ref<any>(null);
const roleFormRef = ref<FormInstance>();
const roleForm = ref({ name: '', remark: '' });
const roleRules: FormRules = { name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] };

// 菜单权限树定义（与前端路由 permiss key 对应）
const menuData = [
    {
        id: '1',
        label: '系统首页',
    },
    {
        id: '8',
        label: '内容设置',
        children: [
            { id: '8-1', label: '公司信息', pid: '8' },
            { id: '8-2', label: 'Banner设置', pid: '8' },
            { id: '8-3', label: '合作客户', pid: '8' },
            { id: '8-4', label: '产品服务', pid: '8' },
            { id: '8-5', label: '优势内容', pid: '8' },
            { id: '8-6', label: '新闻动态', pid: '8' },
            { id: '8-7', label: '招聘内容', pid: '8' },
        ],
    },
    {
        id: '11',
        label: '订单管理',
    },
    {
        id: '11-customer',
        label: '客户管理',
    },
    {
        id: '12',
        label: '财务报表',
    },
    {
        id: '13',
        label: '系统管理',
        children: [
            { id: '13-1', label: '用户管理', pid: '13' },
            { id: '13-2', label: '权限管理', pid: '13' },
        ],
    },
];

// 所有叶子节点 id
const allLeafKeys = computed(() => {
    const keys: string[] = [];
    const collect = (items: any[]) => {
        for (const item of items) {
            if (!item.children || item.children.length === 0) {
                keys.push(item.id);
            } else {
                collect(item.children);
            }
        }
    };
    collect(menuData);
    return keys;
});

// 当前角色选中的 keys（兼容旧格式：数字数组）
const checkedKeys = computed(() => {
    if (!currentRole.value) return [];
    const keys = currentRole.value.keys;
    if (!keys) return [];
    try {
        const parsed = typeof keys === 'string' ? JSON.parse(keys) : keys;
        if (Array.isArray(parsed)) {
            return parsed.map(k => String(k));
        }
    } catch {}
    return [];
});

const loadRoles = () => {
    apiGetRoles().then((res: any) => {
        if (res.code >= 0) {
            roleList.value = res.data || [];
            // 默认选中第一个
            if (roleList.value.length > 0 && !currentRole.value) {
                selectRole(roleList.value[0]);
            }
        }
    });
};

const selectRole = (role: any) => {
    currentRole.value = role;
};

const isBuiltIn = (role: any) => {
    return ['R000000001', 'R000000002', 'R000000003'].includes(role.role_no);
};

const handleCheckChange = () => {
    // 实时获取选中的 keys（叶子节点）
};

const savePermission = () => {
    if (!currentRole.value) return;

    // 获取所有选中的节点（包括父节点）
    const checkedNodes = treeRef.value?.getCheckedNodes() || [];
    const halfCheckedNodes = treeRef.value?.getCheckedKeys(true) || [];

    // 只保存叶子节点的 key
    const selectedLeafKeys = allLeafKeys.value.filter(key => {
        const node = treeRef.value?.getNode(key);
        return node?.checked === true;
    });

    saving.value = true;
    apiSetRole({
        id: currentRole.value.id,
        name: currentRole.value.name,
        keys: selectedLeafKeys,
        remark: currentRole.value.remark,
    }).then((res: any) => {
        if (res.code >= 0) {
            ElMessage.success('保存成功');
            loadRoles();
        } else {
            ElMessage.error(res.msg || '保存失败');
        }
    }).finally(() => {
        saving.value = false;
    });
};

const showAddRole = () => {
    editingRole.value = null;
    roleForm.value = { name: '', remark: '' };
    roleFormRef.value?.resetFields();
    roleDialogVisible.value = true;
};

const editRole = (role: any) => {
    editingRole.value = role;
    roleForm.value = { name: role.name, remark: role.remark || '' };
    roleDialogVisible.value = true;
};

const submitRole = async () => {
    const valid = await roleFormRef.value?.validate().catch(() => false);
    if (!valid) return;

    savingRole.value = true;
    const api = editingRole.value
        ? apiSetRole({ id: editingRole.value.id, ...roleForm.value, keys: [] })
        : apiAddRole({ ...roleForm.value, keys: [] });

    api.then((res: any) => {
        if (res.code >= 0) {
            ElMessage.success(editingRole.value ? '更新成功' : '添加成功');
            roleDialogVisible.value = false;
            loadRoles();
        } else {
            ElMessage.error(res.msg || '操作失败');
        }
    }).finally(() => {
        savingRole.value = false;
    });
};

const deleteRole = (id: number) => {
    apiDeleteRole({ id }).then((res: any) => {
        if (res.code >= 0) {
            ElMessage.success('删除成功');
            if (currentRole.value?.id === id) {
                currentRole.value = null;
            }
            loadRoles();
        } else {
            ElMessage.error(res.msg || '删除失败');
        }
    });
};

onMounted(() => {
    loadRoles();
});
</script>

<style scoped>
.container {
    min-width: 800px;
    height: calc(100vh - 120px);
}

.permission-layout {
    display: flex;
    height: 100%;
    gap: 16px;
}

.role-panel {
    width: 280px;
    min-width: 240px;
    background: #fff;
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.permission-panel {
    flex: 1;
    background: #fff;
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
}

.panel-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.current-role-name {
    font-weight: normal;
    color: #409eff;
    font-size: 13px;
}

.role-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
}

.role-item:hover {
    background: #f5f7fa;
}

.role-item.active {
    background: #ecf5ff;
    border-right: 3px solid #409eff;
}

.role-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.role-name {
    font-size: 14px;
    color: #333;
}

.role-actions {
    display: flex;
    gap: 4px;
}

.empty-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #999;
    font-size: 14px;
}

.menu-tree-wrapper {
    padding: 20px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}
</style>