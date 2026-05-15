<template>
    <el-dialog v-model="dialogFormVisible" title="订单编辑" :before-close="beforeClose" :width="1100"
        :close-on-click-modal="false">
        <el-form :model="form">
            <p class="stit">订单信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="运单号" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.orderId" :disabled="disabledModify"></el-input>
                        <button @click="getId" v-show="!disabledModify">生成</button>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转单号" :label-width="formLabelWidth">
                        <el-input v-model="form.suplierId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="日期" :label-width="formLabelWidth" aria-required>
                        <el-date-picker :disabled="disabledModify" v-model="form.time" type="datetime"
                            placeholder="选择日期和时间" format="YYYY/MM/DD HH:mm:ss" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="当前状态" :label-width="formLabelWidth" aria-required>
                        <el-select :disabled="disabledModify" v-model="form.state" placeholder="状态" size="large"
                            style="width: 240px">
                            <el-option v-for="item in stateOptions" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="目的国" :label-width="formLabelWidth" aria-required>
                        <el-select :disabled="disabledModify" v-model="form.destination" filterable placeholder="目的国"
                            size="large" style="width: 240px">
                            <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.ps"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <p class="stit">入库信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="入库时间" :label-width="formLabelWidth">
                        <el-date-picker v-model="form.inHouseTime" type="datetime"
                            placeholder="选择日期和时间" format="YYYY/MM/DD HH:mm:ss" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="仓库信息" :label-width="formLabelWidth">
                        <el-input v-model="form.warehouse"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <p class="stit">发件人信息：</p>
            <div class="box">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系人" :label-width="formLabelWidth">
                            <el-input v-model="form.shipper.contactPeople"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司名称" :label-width="formLabelWidth">
                            <el-input v-model="form.shipper.companyName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话" :label-width="formLabelWidth">
                            <el-input v-model="form.shipper.tel"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址" :label-width="formLabelWidth">
                            <el-input v-model="form.shipper.addr"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <p class="stit">收件人信息：</p>
            <div class="box">
                <el-col :span="12">
                    <el-form-item label="联系人" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.contactPeople"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公司名称" :label-width="formLabelWidth">
                        <el-input v-model="form.receiver.companyName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.tel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.email"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="国家" :label-width="formLabelWidth">
                        <el-select v-model="form.receiver.country" filterable
                            placeholder="目的国" size="large">
                            <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮政编码" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.zipCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="详细地址" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.addr"></el-input>
                    </el-form-item>
                </el-col>
            </div>

            <p class="stit">货物信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="品名" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.goods.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="件数" :label-width="formLabelWidth">
                        <el-input-number controls-position="right" v-model="form.goods.number"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="长、宽、高" :label-width="formLabelWidth">
                        <el-input v-model="form.goods.length" style="width: 60px;margin-right:5px;"
                            placeholder="长"></el-input>
                        <el-input v-model="form.goods.width" style="width: 60px;margin-right:5px;"
                            placeholder="宽"></el-input>
                        <el-input v-model="form.goods.height" style="width: 60px;" placeholder="高"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="实际重量" :label-width="formLabelWidth" aria-required>
                        <el-input-number controls-position="right" v-model="form.goods.realWeight"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计费重量" :label-width="formLabelWidth" aria-required>
                        <el-input-number controls-position="right" v-model="form.goods.weight"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报关类型" :label-width="formLabelWidth" aria-required>
                        <el-select v-model="form.goods.ifCustoms" filterable
                            placeholder="报关类型" size="large">
                            <el-option label="单证报关" value="1" />
                            <el-option label="买单报关" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" :label-width="formLabelWidth" aria-required>
                        <el-input type="textarea" :row="5" v-model="form.goods.ps"
                            placeholder="海关编码、用途等描述信息"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="入库图片" :label-width="formLabelWidth">
                        <el-upload class="avatar-uploader" :action="uploadImgUrl" name="files" :headers="imgHeader"
                            :show-file-list="false" :on-success="handleAvatarSuccess">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出库图片" :label-width="formLabelWidth">
                        <el-input type="textarea" :row="5" v-model="form.goods.ps"
                            placeholder="海关编码、用途等描述信息"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">Cancel</el-button>
                <el-button type="primary" @click="submit"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, UploadProps } from 'element-plus';
import { reactive, ref } from "vue";
import { apiAddOrder, apiGetOrder, apiSetOrder, baseURL } from "../../api";
import countryOption from './country';


const uploadImgUrl = `${baseURL}/v1/upload`;
const imageUrl = ref("");
const imgHeader = ref({
    zhtoken: localStorage.getItem("zh_token"),
});
const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const stateOptions = [
    {
        id: '0',
        name: "待上网"
    },
    {
        id: '1',
        name: "运输中"
    },
    {
        id: '2',
        name: "派送中"
    },
    {
        id: '3',
        name: "投递失败"
    },
    {
        id: '4',
        name: "成功签收"
    },
    {
        id: '5',
        name: "可能异常"
    },
]

const form = reactive({
    orderId: "",
    suplierId: "",
    state: '0',
    time: new Date(),
    destination: "",
    ps: "",
    inHouseTime: "",
    warehouse: "",  // 仓库信息
    shipper: {
        contactPeople: "",
        companyName: "",
        tel: "",
        addr: "",
    },
    receiver: {
        contactPeople: "",
        companyName: "",
        tel: "",
        email: "",
        addr: "",
        zipCode: "",
        country: "",
    },
    goods: {
        name: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        number: '',
        realWeight: '',
        ifCustoms: '',
        ps: '',
        inPic: '',
        outPic: '',
    }
});
const disabledModify = ref(false);

const emits = defineEmits(["success"]);
const transDate = (date: string) => {
    return new Date(+date);
}
const show = (id?: string) => {
    if (id) {
        apiGetOrder(id).then(res => {
            if (res.code == 0) {
                Object.assign(form, {
                    ...res.data,
                    time: transDate(res.data.updateTime)
                })
            }
        })

        disabledModify.value = true;
    }
    dialogFormVisible.value = true;
};
const close = () => {
    dialogFormVisible.value = false;
    clearDialog();
};
const beforeClose = (done: () => void) => {
    clearDialog();
    done();
};

const getId = () => {
    let id = Math.floor(Math.random() * 100);
    const date = new Date();
    form.orderId = "ZHWL" + date.getFullYear() + date.getMonth() + date.getDate() + id;
}

const checkRequiredFields = () => {
    const requiredFields: any = {
        orderId: form.orderId,
        state: form.state,
        time: form.time,
        destination: form.destination,
        receiver: {
            contactPeople: form.receiver.contactPeople,
            tel: form.receiver.tel,
            addr: form.receiver.addr,
            zipCode: form.receiver.zipCode
        },
        goods: {
            name: form.goods.name,
            weight: form.goods.weight
        }
    };

    const emptyFields = [];
    for (const key in requiredFields) {
        if (requiredFields[key] === '' || requiredFields[key] === null) {
            emptyFields.push(key);
        } else if (typeof requiredFields[key] === 'object') {
            for (const subKey in requiredFields[key]) {
                if (requiredFields[key][subKey] === '' || requiredFields[key][subKey] === null) {
                    emptyFields.push(`${key}.${subKey}`);
                }
            }
        }
    }

    if (emptyFields.length > 0) {
        ElMessage.warning({
            message: '以下必填字段为空:' + emptyFields[0].toString()
        });
        return false;
    } else {
        return true;
    }
}

const clearDialog = () => {
    form.orderId = "";
    form.suplierId = "";
    form.state = "0";
    form.time = new Date();
    form.destination = "";
    form.ps = "";
    form.shipper = {
        contactPeople: "",
        companyName: "",
        tel: "",
        addr: "",
    };
    form.receiver = {
        contactPeople: "",
        companyName: "",
        email: "",
        tel: "",
        addr: "",
        zipCode: "",
        country: "",
    };
    form.goods = {
        name: '',
        length: '',
        width: '',
        height: '',
        realWeight: '',
        weight: '',
        number: '',
        ifCustoms: '',
        ps: '',
        inPic: '',
        outPic: '',
    };
    disabledModify.value = false;
};

const submit = () => {
    if (!form.orderId || form.state === "" || !form.destination || !form.time) {
        ElMessage.error('信息填写不完整');
        return;
    }
    if (!checkRequiredFields()) {
        return;
    }
    if (disabledModify.value) {
        apiSetOrder({
            id: form.orderId,
            goods: form.goods,
            createAccount: localStorage.getItem('ms_username')
        }).then(res => {
            if (res.code === 0) {
                ElMessage.success('更新成功');
                clearDialog();
                emits("success");
                close();
            } else {
                ElMessage.info(res.msg);
            }
        })
    } else {
        apiAddOrder({
            ...form,
            receiver: {
                ...form.receiver,
                country: form.destination,
            },
            id: form.orderId,
            updateTime: form.time.getTime().toString(),
            origin: "CN",
            createAccount: localStorage.getItem('ms_username')
        }).then(res => {
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
const handleAvatarSuccess: UploadProps["onSuccess"] = (
    response: any,
    uploadFile: any
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    if (response.code >= 0) {
        form.goods.inPic = response.data.imgurl;
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

.box {
    display: flex;
    flex-wrap: wrap;
}

.stit {
    padding: 8px;
    font-weight: 600;
    background-color: #f1f1f1;
    margin-bottom: 8px;
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

[aria-required] label::before {
    content: "*";
    color: var(--el-color-danger);
    margin-right: 4px;
}
</style>