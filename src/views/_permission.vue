<template>
	<div class="container">
		<div class="plugins-tips">通过 v-permiss 自定义指令实现权限管理，使用非 admin 账号登录，可查看效果。</div>
		<div class="mgb20">
			<span class="label">角色：</span>
			<el-select v-model="role" @change="handleChange">
				<el-option label="管理员" value="admin"></el-option>
				<el-option label="普通用户" value="user"></el-option>
			</el-select>
		</div>
		<div class="mgb20 tree-wrapper">
			<el-tree ref="tree" :data="data" node-key="id" default-expand-all show-checkbox
				:default-checked-keys="checkedKeys" />
		</div>
		<el-button type="primary" @click="onSubmit">保存权限</el-button>
		<el-button type="primary" @click="checkNode">check</el-button>
	</div>
</template>

<script setup lang="ts" name="permission">
import { onMounted, ref } from 'vue';
import { ElMessage, ElTree } from 'element-plus';
import { usePermissStore } from '../store/permiss';
import { apiGetNav } from '../api';

const role = ref<string>('admin');

interface Tree {
	id: string;
	label: string;
	children?: Tree[];
}

const data = ref([]);
// const data: Tree[] = [
// 	{
// 		id: '1',
// 		label: '系统首页'
// 	},
// 	{
// 		id: '2',
// 		label: '基础表格',
// 		children: [
// 			{
// 				id: '15',
// 				label: '编辑'
// 			},
// 			{
// 				id: '16',
// 				label: '删除'
// 			}
// 		]
// 	},
// 	{
// 		id: '3',
// 		label: 'tab选项卡'
// 	},
// 	{
// 		id: '4',
// 		label: '表单相关',
// 		children: [
// 			{
// 				id: '5',
// 				label: '基本表单'
// 			},
// 			{
// 				id: '6',
// 				label: '文件上传'
// 			},
// 			{
// 				id: '7',
// 				label: '三级菜单',
// 				children: [
// 					{
// 						id: '8',
// 						label: '富文本编辑器'
// 					},
// 					{
// 						id: '9',
// 						label: 'markdown编辑器'
// 					}
// 				]
// 			}
// 		]
// 	},
// 	{
// 		id: '10',
// 		label: '自定义图标'
// 	},
// 	{
// 		id: '11',
// 		label: 'schart图表'
// 	},

// 	{
// 		id: '13',
// 		label: '权限管理'
// 	},
// 	{
// 		id: '14',
// 		label: '支持作者'
// 	}
// ];

const permiss = usePermissStore();

// 获取当前权限
const checkedKeys = ref<string[]>([]);
const getPremission = () => {
	// 请求接口返回权限
	checkedKeys.value = permiss.defaultList[role.value];
};
getPremission();

// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
	// 获取选中的权限
	console.log(tree.value!.getCheckedKeys(false));
};

const handleChange = (val: string[]) => {
	getNav();
};

const checkNode = () => {
	console.log(tree.value!.getCheckedNodes());
}

const originChecked = ref([]);
const getNav = () => {
	apiGetNav(role.value).then(res => {
		if (res.code >= 0) {
			data.value = res.data.treeData;
			tree.value!.setCheckedKeys(res.data.checked);
			originChecked.value = res.data.checked;
		} else {
			ElMessage.warning({
				message: res.msg
			})
		}
	})
}

onMounted(() => {
	getNav()
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
