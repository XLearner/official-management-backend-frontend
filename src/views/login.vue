<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="username">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						type="password"
						placeholder="password"
						v-model="param.password"
						@keyup.enter="submitForm(login)"
					>
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<p class="login-tips">Tips : 用户名和密码随便填。</p>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import md5 from 'md5';
import { apiLogin, checkLogin, apiGetUsers, apiGetRoles } from '../api/index';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';

interface LoginInfo {
	username: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	username: 'admin',
	password: ''
});

const rules: FormRules = {
	username: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			apiLogin({
				account: param.username,
				password: md5(param.password)
			}).then(async (res: any) => {
				if (res.code >= 0) {
					ElMessage.success('登录成功');
					localStorage.setItem('ms_username', param.username);
					localStorage.setItem('zh_token', res.data.token);

					// 从后端获取角色权限
					try {
						const [usersRes, rolesRes]: any[] = await Promise.all([
							apiGetUsers(),
							apiGetRoles(),
						]);

						// 找到当前用户关联的角色
						const user = (usersRes?.data || []).find((u: any) => u.account === param.username);
						const role = user?.role_id
							? (rolesRes?.data || []).find((r: any) => r.id === user.role_id)
							: null;

						let keys: string[] = [];
						if (role) {
							try { keys = JSON.parse(role.keys); } catch {}
						}

						// 无角色用户给予最小权限兜底（只能看首页）
						if (keys.length === 0) {
							keys = ['1'];
						}

						permiss.handleSet(keys);
						localStorage.setItem('ms_keys', JSON.stringify(keys));
					} catch (err) {
						console.error('获取角色权限失败', err);
						// 兜底最小权限
						permiss.handleSet(['1']);
						localStorage.setItem('ms_keys', JSON.stringify(['1']));
					}

					router.push('/');
				} else {
					ElMessage.error(res.msg);
				}
			}).catch(err => {
				console.log('err login', err);
			});
		} else {
			ElMessage.error('账号密码填写有误');
			return false;
		}
	});
};

const tags = useTagsStore();
tags.clearTags();

onMounted(() => {
	checkLogin().then(res => {
		if (res.code >= 0) {
			router.push('/')
		}
	}).catch(console.log)
})
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-bg.jpg);
	background-size: 100%;
}
.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}
.ms-content {
	padding: 30px 30px;
}
.login-btn {
	text-align: center;
}
.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}
.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
