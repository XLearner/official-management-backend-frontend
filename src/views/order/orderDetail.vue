<template>
    <div class="container">
        <div class="process">
            <el-steps :space="200" :active="6" finish-status="success">
                <el-step title="已提交"></el-step>
                <el-step title="已入库"></el-step>
                <el-step title="已出库"></el-step>
                <el-step title="国内报关"></el-step>
                <el-step title="干线运输"></el-step>
                <el-step title="国外清关"></el-step>
                <el-step title="海外仓入库"></el-step>
                <el-step title="海外派送"></el-step>
                <el-step title="已签收"></el-step>
            </el-steps>
        </div>
        <div class="tab">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="订单预报信息" name="first">
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
                                <el-select :disabled="disabledModify" v-model="form.destination" filterable
                                    placeholder="目的国" size="large" style="width: 240px">
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
                                <el-date-picker v-model="form.inHouseTime" type="datetime" placeholder="选择日期和时间"
                                    format="YYYY/MM/DD HH:mm:ss" />
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
                                <el-select v-model="form.receiver.country" filterable placeholder="目的国" size="large">
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
                    <el-button type="primary" size="small" @click="startAddGoods" style="margin-bottom: 10px;">添加货物</el-button>
                    <el-table :data="goodsList" border size="small">
                        <el-table-column prop="name" label="品名" align="center" />
                        <el-table-column prop="number" label="件数" align="center" />
                        <el-table-column label="尺寸(长x宽x高)" align="center">
                            <template #default="scope">
                                {{ scope.row.length }}x{{ scope.row.width }}x{{ scope.row.height }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="realWeight" label="实际重量" align="center" />
                        <el-table-column prop="weight" label="计费重量" align="center" />
                        <el-table-column prop="ifCustoms" label="报关类型" align="center" :formatter="customsFormatter" />
                        <el-table-column prop="ps" label="备注" align="center" />
                        <el-table-column label="操作" width="150" align="center">
                            <template #default="scope">
                                <el-button link type="primary" size="small"
                                    @click="editGoodsRow(scope.row, scope.$index)">编辑</el-button>
                                <el-popconfirm title="确认删除？" @confirm="deleteGoodsRow(scope.row, scope.$index)">
                                    <template #reference>
                                        <el-button link type="primary" size="small">删除</el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div v-if="showGoodsForm" class="goods-form">
                        <el-divider />
                        <p class="stit">{{ editingGoodsIndex >= 0 ? '编辑货物' : '添加货物' }}</p>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="品名" :label-width="formLabelWidth" aria-required>
                                    <el-input v-model="goodsForm.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="件数" :label-width="formLabelWidth">
                                    <el-input-number controls-position="right" v-model="goodsForm.number" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="长、宽、高" :label-width="formLabelWidth">
                                    <el-input v-model="goodsForm.length" style="width: 60px; margin-right: 5px;"
                                        placeholder="长" />
                                    <el-input v-model="goodsForm.width" style="width: 60px; margin-right: 5px;"
                                        placeholder="宽" />
                                    <el-input v-model="goodsForm.height" style="width: 60px;" placeholder="高" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="实际重量" :label-width="formLabelWidth" aria-required>
                                    <el-input-number controls-position="right" v-model="goodsForm.realWeight" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="计费重量" :label-width="formLabelWidth" aria-required>
                                    <el-input-number controls-position="right" v-model="goodsForm.weight" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报关类型" :label-width="formLabelWidth" aria-required>
                                    <el-select v-model="goodsForm.ifCustoms" filterable placeholder="报关类型" size="large">
                                        <el-option label="单证报关" value="1" />
                                        <el-option label="买单报关" value="0" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注" :label-width="formLabelWidth">
                                    <el-input type="textarea" :rows="5" v-model="goodsForm.ps"
                                        placeholder="海关编码、用途等描述信息" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="入库图片" :label-width="formLabelWidth">
                                    <el-upload class="avatar-uploader" :action="uploadImgUrl" name="files"
                                        :headers="imgHeader" :show-file-list="false"
                                        :on-success="handleInPicSuccess">
                                        <img v-if="inPicUrl" :src="inPicUrl" class="avatar" />
                                        <el-icon v-else class="avatar-uploader-icon">
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="出库图片" :label-width="formLabelWidth">
                                    <el-upload class="avatar-uploader" :action="uploadImgUrl" name="files"
                                        :headers="imgHeader" :show-file-list="false"
                                        :on-success="handleOutPicSuccess">
                                        <img v-if="outPicUrl" :src="outPicUrl" class="avatar" />
                                        <el-icon v-else class="avatar-uploader-icon">
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-button type="success" @click="submitGoods">{{ editingGoodsIndex >= 0 ? '更新' : '添加' }}</el-button>
                        <el-button @click="cancelGoodsEdit">取消</el-button>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="库内信息" name="second">
                    <p class="stit">订单信息</p>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="运单号" :label-width="formLabelWidth" aria-required>
                                <el-input v-model="form.orderId" :disabled="disabledModify"></el-input>
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
                                <el-select :disabled="disabledModify" v-model="form.destination" filterable
                                    placeholder="目的国" size="large" style="width: 240px">
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
                </el-tab-pane>

                <el-tab-pane label="轨迹信息" name="third">
                    <el-form-item label="运单号" :label-width="formLabelWidth">
                        <el-input v-model="form.orderId" disabled style="width: 200px;"></el-input>
                        <el-button link type="primary" size="small" @click="toTrack(form.orderId)">轨迹查询</el-button>
                    </el-form-item>
                    <el-form-item label="转单号" :label-width="formLabelWidth">
                        <el-input v-model="form.suplierId" disabled style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="目的国" :label-width="formLabelWidth">
                        <el-select disabled v-model="form.destination" filterable placeholder="目的国" size="large"
                            style="width: 240px">
                            <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.ps"></el-input>
                    </el-form-item>
                    <el-form-item label="当前状态" :label-width="formLabelWidth">
                        <el-select v-model="form.trackState" placeholder="状态" size="large" style="width: 240px">
                            <el-option v-for="item in stateOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <div class="track-history">
                        <div class="option-box">
                            <el-date-picker v-model="newTrack.updateTime" type="datetime" placeholder="日期和时间"
                                format="YYYY/MM/DD HH:mm:ss" class="option-btn" />
                            <el-input v-model="newTrack.txt" placeholder="轨迹信息" class="option-btn"></el-input>
                            <el-button type="success" :icon="Check" circle @click="pushTrack" />
                        </div>
                        <ul class="list">
                            <li v-for="(item, index) in trackHistory" :key="index">
                                <span>{{ transTime(item.updateTime) }} </span>
                                <span>{{ item.txt }}</span>
                                <el-popconfirm title="确认删除？" @confirm="deleteTrack(index)">
                                    <template #reference>
                                        <el-button type="danger" class="del" :icon="Delete" size="small" circle />
                                    </template>
                                </el-popconfirm>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div style="margin-top: 20px;">
                <el-button type="primary" @click="submit">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, TabsPaneContext, UploadProps } from 'element-plus';
import { Check, Delete, Plus } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import {
    apiAddOrder, apiGetOrder, apiSetOrder,
    apiGetGoods, apiAddGoods, apiSetGoods, apiDeleteGoods,
    apiSetTrack, baseURL,
} from '../../api';
import countryOption from './country';
import { useImgBaseUrl } from '../../utils/useImgBaseUrl';

const activeName = ref('first');
const uploadImgUrl = `${baseURL}/v1/upload`;
const imgHeader = ref({ zhtoken: localStorage.getItem('zh_token') });
const formLabelWidth = '140px';
const dialogFormVisible = ref(false);

const stateOptions = [
    { id: '0', name: '待上网' },
    { id: '1', name: '运输中' },
    { id: '2', name: '派送中' },
    { id: '3', name: '投递失败' },
    { id: '4', name: '成功签收' },
    { id: '5', name: '可能异常' },
];

const transTime = (date: string | Date) => {
    const time = new Date(typeof date === 'string' ? parseInt(date) : date);
    return `${time.getFullYear()}/${(time.getMonth() + 1).toString().padStart(2, '0')}/${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
};

const customsFormatter = (row: any) => row.ifCustoms === '1' ? '单证报关' : '买单报关';

const form = reactive({
    orderId: '',
    suplierId: '',
    state: '0',
    time: new Date(),
    destination: '',
    ps: '',
    inHouseTime: null as Date | null,
    warehouse: '',
    trackState: '0',
    shipper: {
        contactPeople: '',
        companyName: '',
        tel: '',
        addr: '',
    },
    receiver: {
        contactPeople: '',
        companyName: '',
        tel: '',
        email: '',
        addr: '',
        zipCode: '',
        country: '',
    },
});
const disabledModify = ref(false);

// Goods state
const goodsList = ref<any[]>([]);
const showGoodsForm = ref(false);
const editingGoodsIndex = ref(-1);
const { imgBaseUrl, extractImgBaseUrl, getImgUrl } = useImgBaseUrl();
const inPicUrl = ref('');
const outPicUrl = ref('');

const goodsForm = reactive({
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
});

const clearGoodsForm = () => {
    goodsForm.name = '';
    goodsForm.length = '';
    goodsForm.width = '';
    goodsForm.height = '';
    goodsForm.weight = '';
    goodsForm.number = '';
    goodsForm.realWeight = '';
    goodsForm.ifCustoms = '';
    goodsForm.ps = '';
    goodsForm.inPic = '';
    goodsForm.outPic = '';
    inPicUrl.value = '';
    outPicUrl.value = '';
};

const startAddGoods = () => {
    editingGoodsIndex.value = -1;
    clearGoodsForm();
    showGoodsForm.value = true;
};

const editGoodsRow = (row: any, index: number) => {
    editingGoodsIndex.value = index;
    Object.assign(goodsForm, {
        name: row.name,
        length: row.length,
        width: row.width,
        height: row.height,
        weight: row.weight,
        number: row.number,
        realWeight: row.realWeight,
        ifCustoms: row.ifCustoms,
        ps: row.ps,
        inPic: row.inPic || '',
        outPic: row.outPic || '',
    });
    inPicUrl.value = getImgUrl(row.inPic);
    outPicUrl.value = getImgUrl(row.outPic);
    showGoodsForm.value = true;
};

const cancelGoodsEdit = () => {
    showGoodsForm.value = false;
    editingGoodsIndex.value = -1;
    clearGoodsForm();
};

const fetchGoods = () => {
    if (!form.orderId) return;
    apiGetGoods(form.orderId).then((res) => {
        if (res.code >= 0 && res.data) {
            imgBaseUrl.value = extractImgBaseUrl(res) || imgBaseUrl.value;
            goodsList.value = Array.isArray(res.data) ? res.data : (res.data.goods || res.data.list || []);
        }
    });
};

const submitGoods = () => {
    if (!goodsForm.name) {
        ElMessage.warning('请填写品名');
        return;
    }
    const payload = { ...goodsForm, orderId: form.orderId };
    if (editingGoodsIndex.value >= 0) {
        const existing = goodsList.value[editingGoodsIndex.value];
        if (existing.id) {
            apiSetGoods({ ...payload, id: existing.id }).then((res) => {
                if (res.code >= 0) {
                    ElMessage.success('货物更新成功');
                    fetchGoods();
                    cancelGoodsEdit();
                } else {
                    ElMessage.info(res.msg);
                }
            });
        } else {
            apiAddGoods(payload).then((res) => {
                if (res.code >= 0) {
                    ElMessage.success('货物添加成功');
                    fetchGoods();
                    cancelGoodsEdit();
                } else {
                    ElMessage.info(res.msg);
                }
            });
        }
    } else {
        apiAddGoods(payload).then((res) => {
            if (res.code >= 0) {
                ElMessage.success('货物添加成功');
                fetchGoods();
                cancelGoodsEdit();
            } else {
                ElMessage.info(res.msg);
            }
        });
    }
};

const deleteGoodsRow = (row: any, index: number) => {
    if (row.id) {
        apiDeleteGoods({ id: row.id }).then((res) => {
            if (res.code >= 0) {
                ElMessage.success('货物删除成功');
                fetchGoods();
            }
        });
    } else {
        goodsList.value.splice(index, 1);
        ElMessage.success('货物已移除');
    }
};

const handleInPicSuccess: UploadProps['onSuccess'] = (response, file) => {
    inPicUrl.value = URL.createObjectURL(file.raw!);
    imgBaseUrl.value = extractImgBaseUrl(response) || imgBaseUrl.value;
    if (response.code >= 0) {
        goodsForm.inPic = response.data?.imgurl || '';
    }
};
const handleOutPicSuccess: UploadProps['onSuccess'] = (response, file) => {
    outPicUrl.value = URL.createObjectURL(file.raw!);
    imgBaseUrl.value = extractImgBaseUrl(response) || imgBaseUrl.value;
    if (response.code >= 0) {
        goodsForm.outPic = response.data?.imgurl || '';
    }
};

// Track state
const trackHistory = ref<any[]>([]);
const newTrack = ref({
    updateTime: new Date(),
    txt: '',
});

const pushTrack = () => {
    if (!newTrack.value.txt) {
        ElMessage.info('信息输入为空');
        return;
    }
    trackHistory.value.push({
        updateTime: new Date(newTrack.value.updateTime).getTime().toString(),
        txt: newTrack.value.txt,
    });
    newTrack.value = { updateTime: new Date(), txt: '' };
};

const deleteTrack = (index: number) => {
    trackHistory.value.splice(index, 1);
};

const toTrack = (id: string) => {
    window.open('http://www.zhonghanlogistics.cn/track/?' + 'order_id=' + id, 'blank');
};

const emits = defineEmits(['success']);

const show = (id?: string) => {
    if (id) {
        apiGetOrder(id).then((res) => {
            if (res.code == 0 && res.data) {
                const data = res.data;
                Object.assign(form, {
                    orderId: data.orderId || String(data.id || ''),
                    suplierId: data.suplierId || '',
                    state: String(data.state) || '0',
                    time: new Date(+data.updateTime || Date.now()),
                    destination: data.destination || '',
                    ps: data.ps || '',
                    inHouseTime: data.inHouseTime ? new Date(parseInt(data.inHouseTime)) : null,
                    warehouse: data.warehouse || '',
                    trackState: String(data.state) || '0',
                    shipper: {
                        contactPeople: data.shipper?.contactPeople || '',
                        companyName: data.shipper?.companyName || '',
                        tel: data.shipper?.tel || '',
                        addr: data.shipper?.addr || '',
                    },
                    receiver: {
                        contactPeople: data.receiver?.contactPeople || '',
                        companyName: data.receiver?.companyName || '',
                        tel: data.receiver?.tel || '',
                        email: data.receiver?.email || '',
                        addr: data.receiver?.addr || '',
                        zipCode: data.receiver?.zipCode || '',
                        country: data.receiver?.country || '',
                    },
                });
                if (data.history) {
                    try {
                        trackHistory.value = typeof data.history === 'string' ? JSON.parse(data.history) : data.history;
                    } catch { trackHistory.value = []; }
                }
            }
        });
        fetchGoods();
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
    const id = Math.floor(Math.random() * 100);
    const date = new Date();
    form.orderId = 'ZHWL' + date.getFullYear() + date.getMonth() + date.getDate() + id;
};

const clearDialog = () => {
    form.orderId = '';
    form.suplierId = '';
    form.state = '0';
    form.time = new Date();
    form.destination = '';
    form.ps = '';
    form.inHouseTime = null;
    form.warehouse = '';
    form.trackState = '0';
    form.shipper = { contactPeople: '', companyName: '', tel: '', addr: '' };
    form.receiver = { contactPeople: '', companyName: '', tel: '', email: '', addr: '', zipCode: '', country: '' };
    goodsList.value = [];
    showGoodsForm.value = false;
    editingGoodsIndex.value = -1;
    clearGoodsForm();
    trackHistory.value = [];
    disabledModify.value = false;
};

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
            zipCode: form.receiver.zipCode,
        },
    };

    const emptyFields: string[] = [];
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
        ElMessage.warning({ message: '以下必填字段为空:' + emptyFields[0].toString() });
        return false;
    }
    return true;
};

const submit = () => {
    if (!form.orderId || form.state === '' || !form.destination || !form.time) {
        ElMessage.error('信息填写不完整');
        return;
    }
    if (!checkRequiredFields()) return;

    const orderPayload: any = {
        id: form.orderId,
        suplierId: form.suplierId,
        state: form.state,
        updateTime: form.time.getTime().toString(),
        destination: form.destination,
        ps: form.ps,
        inHouseTime: form.inHouseTime ? new Date(form.inHouseTime).getTime().toString() : '',
        warehouse: form.warehouse,
        origin: 'CN',
        createAccount: localStorage.getItem('ms_username'),
        shipper: form.shipper,
        receiver: {
            ...form.receiver,
            country: form.receiver.country || form.destination,
        },
    };

    if (disabledModify.value) {
        apiSetOrder(orderPayload).then((res) => {
            if (res.code === 0) {
                apiSetTrack({
                    id: form.orderId,
                    history: JSON.stringify(trackHistory.value.concat([])),
                    state: form.trackState,
                    ps: form.ps,
                }).then(() => {
                    ElMessage.success('更新成功');
                    emits('success');
                });
            } else {
                ElMessage.info(res.msg);
            }
        });
    } else {
        apiAddOrder(orderPayload).then((res) => {
            if (res.code === 0) {
                apiSetTrack({
                    id: form.orderId,
                    history: JSON.stringify(trackHistory.value.concat([])),
                    state: form.trackState,
                    ps: form.ps,
                }).then(() => {
                    ElMessage.success('新增成功');
                    emits('success');
                });
            } else {
                ElMessage.info(res.msg);
            }
        });
    }
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab.props.name, event);
};

defineExpose({ show, close });
</script>

<style scoped>
.avatar-uploader .avatar {
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

.goods-form {
    margin-top: 10px;
    padding: 10px;
    background-color: #fafafa;
    border-radius: 6px;
}

ul,
li {
    list-style: none;
}

.list {
    height: 200px;
    overflow-y: auto;
    padding: 10px;
}

.list li {
    padding: 3px 8px;
    margin-bottom: 8px;
}

.list li:hover {
    box-shadow: 0 0 5px #efefef;
}

.list li span {
    margin-right: 10px;
    vertical-align: middle;
}

.del {
    margin-left: 20px;
}

.option-box {
    display: flex;
}

.option-btn {
    width: 240px;
    vertical-align: middle;
    margin-right: 10px;
}

.track-history {
    margin-top: 10px;
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
    content: '*';
    color: var(--el-color-danger);
    margin-right: 4px;
}
</style>
