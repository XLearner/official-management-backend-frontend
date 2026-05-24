<template>
    <el-dialog
        v-model="visible"
        :title="isEdit ? '编辑客户' : '新增客户'"
        width="680px"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="公司名称" prop="company_name">
                        <el-input v-model="form.company_name" placeholder="请输入公司名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="对接人" prop="contact_name">
                        <el-input v-model="form.contact_name" placeholder="请输入对接人姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职位" prop="position">
                        <el-input v-model="form.position" placeholder="如：业务经理" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="form.phone" placeholder="手机/座机" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="邮箱地址" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="公司地址" prop="address">
                        <el-input v-model="form.address" placeholder="详细地址" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="营业执照" prop="license_pic">
                        <div class="pic-upload">
                            <el-image
                                v-if="form.license_pic"
                                :src="getImgUrl(form.license_pic)"
                                :preview-src-list="[getImgUrl(form.license_pic)]"
                                fit="cover"
                                class="pic-thumb"
                                preview-teleported
                                :z-index="99999"
                            />
                            <el-upload
                                class="pic-uploader"
                                :action="uploadUrl"
                                :headers="uploadHeaders"
                                :show-file-list="false"
                                :on-success="handleLicenseSuccess"
                                :before-upload="beforeUpload"
                            >
                                <el-icon v-if="!form.license_pic" class="pic-uploader-icon"><Plus /></el-icon>
                                <span v-if="!form.license_pic" class="pic-tip">点击上传</span>
                            </el-upload>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="名片照片" prop="card_pic">
                        <div class="pic-upload">
                            <el-image
                                v-if="form.card_pic"
                                :src="getImgUrl(form.card_pic)"
                                :preview-src-list="[getImgUrl(form.card_pic)]"
                                fit="cover"
                                class="pic-thumb"
                                preview-teleported
                                :z-index="99999"
                            />
                            <el-upload
                                class="pic-uploader"
                                :action="uploadUrl"
                                :headers="uploadHeaders"
                                :show-file-list="false"
                                :on-success="handleCardSuccess"
                                :before-upload="beforeUpload"
                            >
                                <el-icon v-if="!form.card_pic" class="pic-uploader-icon"><Plus /></el-icon>
                                <span v-if="!form.card_pic" class="pic-tip">点击上传</span>
                            </el-upload>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="备注信息" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="saving" @click="handleSubmit">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { apiGetCustomer, apiAddCustomer, apiSetCustomer } from '../../api/index';
import { baseURL } from '../../api/index';
import { useImgBaseUrl } from '../../utils/useImgBaseUrl';

const emit = defineEmits<{ (e: 'success'): void }>();

const visible = ref(false);
const saving = ref(false);
const editingId = ref<number | null>(null);
const isEdit = computed(() => editingId.value !== null);
const formRef = ref<FormInstance>();
const { getImgUrl, extractImgBaseUrl, imgBaseUrl } = useImgBaseUrl();

const uploadUrl = `${baseURL}/v1/upload`;
const uploadHeaders = { zhtoken: localStorage.getItem('zh_token') || '' };

const form = reactive({
    company_name: '',
    contact_name: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    license_pic: '',
    card_pic: '',
    remark: '',
});

const rules: FormRules = {
    company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
};

const resetForm = () => {
    Object.assign(form, {
        company_name: '', contact_name: '', position: '',
        phone: '', email: '', address: '',
        license_pic: '', card_pic: '', remark: '',
    });
    formRef.value?.resetFields();
};

const show = (id?: number | string) => {
    resetForm();
    if (id) {
        editingId.value = Number(id);
        apiGetCustomer(String(id)).then((res: any) => {
            if (res.code >= 0 && res.data) {
                const d = res.data;
                Object.assign(form, {
                    company_name: d.company_name || '',
                    contact_name: d.contact_name || '',
                    position: d.position || '',
                    phone: d.phone || '',
                    email: d.email || '',
                    address: d.address || '',
                    license_pic: d.license_pic || '',
                    card_pic: d.card_pic || '',
                    remark: d.remark || '',
                });
                extractImgBaseUrl(res);
            }
        });
    } else {
        editingId.value = null;
    }
    visible.value = true;
};

const handleClose = () => {
    visible.value = false;
};

const handleSubmit = async () => {
    const valid = await formRef.value?.validate().catch(() => false);
    if (!valid) return;

    saving.value = true;
    const api = isEdit.value
        ? apiSetCustomer({ id: editingId.value, ...form })
        : apiAddCustomer(form);

    api.then((res: any) => {
        if (res.code >= 0) {
            ElMessage.success(isEdit.value ? '更新成功' : '添加成功');
            emit('success');
            handleClose();
        } else {
            ElMessage.error(res.msg || '操作失败');
        }
    }).finally(() => {
        saving.value = false;
    });
};

const beforeUpload = () => { /* noop */ };

const handleLicenseSuccess: any = (res: any) => {
    if (res.code >= 0) {
        form.license_pic = res.data?.imgurl || '';
        extractImgBaseUrl(res);
    }
};

const handleCardSuccess: any = (res: any) => {
    if (res.code >= 0) {
        form.card_pic = res.data?.imgurl || '';
        extractImgBaseUrl(res);
    }
};

defineExpose({ show });
</script>

<style scoped>
.pic-upload {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.pic-thumb {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    border: 1px solid var(--el-border-color);
}

.pic-uploader {
    width: 80px;
    height: 80px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s;
}

.pic-uploader:hover {
    border-color: var(--el-color-primary);
}

.pic-uploader-icon {
    font-size: 20px;
    color: #8c939d;
}

.pic-tip {
    font-size: 11px;
    color: #999;
    margin-top: 2px;
}
</style>