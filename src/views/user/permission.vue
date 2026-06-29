<template>
	<el-dialog v-model="dialogFormVisible" title="分配角色" :before-close="beforeClose" width="500">
		<div v-if="currentUser" class="user-info">
			<span class="label">当前用户：</span>
			<strong>{{ currentUser.account }}</strong>
		</div>

		<el-form label-width="80px" style="margin-top: 16px;">
			<el-form-item label="选择角色">
				<el-select v-model="selectedRoleId" placeholder="请选择角色" style="width: 100%;">
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
		</el-form>

		<template #footer>
			<el-button @click="close">取消</el-button>
			<el-button type="primary" :loading="saving" @click="submit">保存</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { apiGetRoles, apiSetUser } from '../../api/index';

const dialogFormVisible = ref(false);
const currentUser = ref<any>(null);
const selectedRoleId = ref<number | null>(null);
const roleList = ref<any[]>([]);
const saving = ref(false);

const emit = defineEmits(["success"]);

const isBuiltIn = (role: any) => {
	return ['R000000001', 'R000000002', 'R000000003'].includes(role.role_no);
};

const loadRoles = async () => {
	const res: any = await apiGetRoles();
	if (res.code >= 0) {
		roleList.value = res.data || [];
	}
};

const show = async (user: any) => {
	currentUser.value = user;
	selectedRoleId.value = user.role_id || null;
	dialogFormVisible.value = true;

	await loadRoles();
};

const close = () => {
	dialogFormVisible.value = false;
	currentUser.value = null;
	selectedRoleId.value = null;
};

const beforeClose = (done: () => void) => {
	close();
	done();
};

const submit = async () => {
	if (!currentUser.value) return;

	saving.value = true;
	const res: any = await apiSetUser({
		id: currentUser.value.id.toString(),
		role_id: selectedRoleId.value?.toString() || '',
		account: currentUser.value.account,
		date: currentUser.value.date,
		permission: currentUser.value.permission,
		ps: currentUser.value.ps,
	}).finally(() => {
		saving.value = false;
	});

	if (res.code >= 0) {
		ElMessage.success('角色分配成功');
		emit('success');
		close();
	} else {
		ElMessage.error(res.msg || '分配失败');
	}
};

defineExpose({ show });
</script>

<style scoped>
.user-info {
	padding: 8px 12px;
	background: #f5f7fa;
	border-radius: 4px;
}

.label {
	color: #909399;
	margin-right: 8px;
}
</style>