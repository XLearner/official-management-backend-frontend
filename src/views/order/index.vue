<template>
    <div class="container">
        <div class="box">
            <h3>订单管理</h3>
            <el-button class="btn" type="primary" @click="addOrder">添加订单</el-button>

            <div class="horizon-box">
                <div class="state-box">
                    <el-link type="primary" class="btn" @click="switchList(100)">全部</el-link>
                    <template v-for="(item, index) in enumState">
                        <el-link :type="stateOn == index ? 'primary' : 'info'" class="btn" @click="switchList(index)">{{
                            item }}({{ stateList[`state${index + 1}`].length }})</el-link>
                    </template>
                </div>
                <div class="toolbar">
                    <el-date-picker
                        v-model="filterDateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                        size="small"
                        style="width: 240px; margin-right: 10px;"
                        @change="applyFilters"
                    />
                    <el-select
                        v-model="filterDestination"
                        filterable
                        clearable
                        placeholder="目的国"
                        size="small"
                        style="width: 160px; margin-right: 10px;"
                        @change="applyFilters"
                    >
                        <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh" :value="item.code" />
                    </el-select>
                    <span style="margin-right: 10px; font-size: 13px;">已选 {{ selectedOrders.length }} 笔</span>
                    <el-button type="success" size="small" :disabled="selectedOrders.length === 0" @click="exportBill">导出账单</el-button>
                </div>
                <el-table :data="tableData" border :default-sort="{ prop: 'updateTime', order: 'descending' }"
                    style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="40" />
                    <el-table-column label="运单号" align="center">
                        <template #default="scope">
                            {{ scope.row.orderId }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="suplierId" label="转单号" align="center" />
                    <el-table-column prop="updateTime" label="创建日期" sortable align="center" :formatter="formatTime" />
                    <el-table-column prop="state" label="最新状态" align="center" :formatter="formatter" />
                    <el-table-column prop="destination" label="目的地" align="center" :formatter="trCountry" />
                    <el-table-column prop="warehouse" label="交货仓库" sortable align="center" />
                    <el-table-column prop="inHouseTime" label="入仓时间" sortable align="center" :formatter="formatInHouseTime" />
                    <el-table-column prop="goodsName" label="商品名称" sortable align="center" />
                    <el-table-column prop="ps" label="备注" align="center" />
                    <el-table-column label="Operations" width="200">
                        <template #default="scope">
                            <el-button link type="primary" size="small"
                                @click="openWaybill(scope.row)">面单</el-button>
                            <el-button link type="primary" size="small"
                                @click="editOrder(scope.row)">编辑</el-button>
                            <el-popconfirm title="确认删除？" @confirm="deleteOrder((scope.row.orderId).toString())">
                                <template #reference>
                                    <el-button link type="primary" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" size="small" background layout="total, prev, pager, next, sizes"
                    :total="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    class="pagination" />
            </div>
        </div>

        <!-- ============ Inline Edit Area ============ -->
        <div class="box edit-area" v-if="editing">
            <h3>{{ isViewMode ? '查看订单' : (isEdit ? '编辑订单' : '添加订单') }}</h3>

            <p class="stit">订单信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="运单号" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.orderId" :disabled="isEdit || isViewMode"></el-input>
                        <el-button v-if="!isEdit && !isViewMode" @click="getId">生成</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转单号" :label-width="formLabelWidth">
                        <el-input v-model="form.suplierId" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="日期" :label-width="formLabelWidth" aria-required>
                        <el-date-picker v-model="form.time" type="datetime" placeholder="选择日期和时间"
                            format="YYYY/MM/DD HH:mm:ss" :disabled="isViewMode" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="当前状态" :label-width="formLabelWidth" aria-required>
                        <el-select v-model="form.state" placeholder="状态" size="large" style="width: 240px" :disabled="isViewMode">
                            <el-option v-for="item in stateOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="目的国" :label-width="formLabelWidth" aria-required>
                        <el-select v-model="form.destination" filterable placeholder="目的国" size="large"
                            style="width: 240px" :disabled="isViewMode">
                            <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.ps" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <p class="stit">入库信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="入库时间" :label-width="formLabelWidth">
                        <el-date-picker v-model="form.inHouseTime" type="datetime" placeholder="选择日期和时间"
                            format="YYYY/MM/DD HH:mm:ss" :disabled="isViewMode" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="仓库信息" :label-width="formLabelWidth">
                        <el-input v-model="form.warehouse" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <p class="stit">发件人信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="联系人" :label-width="formLabelWidth">
                        <el-input v-model="form.shipper.contactPeople" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公司名称" :label-width="formLabelWidth">
                        <el-input v-model="form.shipper.companyName" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="电话" :label-width="formLabelWidth">
                        <el-input v-model="form.shipper.tel" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址" :label-width="formLabelWidth">
                        <el-input v-model="form.shipper.addr" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <p class="stit">收件人信息</p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="联系人" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.contactPeople" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="公司名称" :label-width="formLabelWidth">
                        <el-input v-model="form.receiver.companyName" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.tel" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮箱" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.email" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="国家" :label-width="formLabelWidth">
                        <el-select v-model="form.receiver.country" filterable placeholder="目的国" size="large" :disabled="isViewMode">
                            <el-option v-for="item in countryOption" :key="item.code" :label="item.name_zh"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮政编码" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.zipCode" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="详细地址" :label-width="formLabelWidth" aria-required>
                        <el-input v-model="form.receiver.addr" :disabled="isViewMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- ============ Tabs: Goods / Track ============ -->
            <el-tabs v-model="activeTab" type="card" class="edit-tabs">
                <!-- 货物信息 Tab -->
                <el-tab-pane label="货物信息" name="goods">
                    <el-button v-if="!isViewMode" type="primary" size="small" @click="startAddGoods" style="margin-bottom: 10px;">添加货物</el-button>
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
                        <el-table-column label="入库图片" width="90" align="center">
                            <template #default="scope">
                                <el-image
                                    v-if="scope.row.inPic"
                                    :src="getImgUrl(scope.row.inPic)"
                                    :preview-src-list="[getImgUrl(scope.row.inPic)]"
                                    fit="cover"
                                    preview-teleported
                                    :z-index="99999"
                                    style="width:40px;height:40px;border-radius:4px;"
                                />
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="出库图片" width="90" align="center">
                            <template #default="scope">
                                <el-image
                                    v-if="scope.row.outPic"
                                    :src="getImgUrl(scope.row.outPic)"
                                    :preview-src-list="[getImgUrl(scope.row.outPic)]"
                                    fit="cover"
                                    preview-teleported
                                    :z-index="99999"
                                    style="width:40px;height:40px;border-radius:4px;"
                                />
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="签收图片" width="90" align="center">
                            <template #default="scope">
                                <el-image
                                    v-if="scope.row.signPic"
                                    :src="getImgUrl(scope.row.signPic)"
                                    :preview-src-list="[getImgUrl(scope.row.signPic)]"
                                    fit="cover"
                                    preview-teleported
                                    :z-index="99999"
                                    style="width:40px;height:40px;border-radius:4px;"
                                />
                                <span v-else>-</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!isViewMode" label="操作" width="150" align="center">
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

                    <!-- Inline Goods Form -->
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
                                    <el-select v-model="goodsForm.ifCustoms" filterable placeholder="报关类型"
                                        size="large">
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
                            <el-col :span="12">
                                <el-form-item label="签收图片" :label-width="formLabelWidth">
                                    <el-upload class="avatar-uploader" :action="uploadImgUrl" name="files"
                                        :headers="imgHeader" :show-file-list="false"
                                        :on-success="handleSignPicSuccess">
                                        <img v-if="signPicUrl" :src="signPicUrl" class="avatar" />
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

                <!-- 轨迹信息 Tab -->
                <el-tab-pane label="轨迹信息" name="track">
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
                    <el-form-item label="当前状态" :label-width="formLabelWidth">
                        <el-select v-model="form.trackState" placeholder="状态" size="large" style="width: 240px" :disabled="isViewMode">
                            <el-option v-for="item in stateOptions" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <div class="track-history">
                        <div v-if="!isViewMode" class="option-box">
                            <el-date-picker v-model="newTrack.updateTime" type="datetime" placeholder="日期和时间"
                                format="YYYY/MM/DD HH:mm:ss" class="option-btn" />
                            <el-input v-model="newTrack.txt" placeholder="轨迹信息" class="option-btn"></el-input>
                            <el-button type="success" :icon="Check" circle @click="pushTrack" />
                        </div>
                        <ul class="list">
                            <li v-for="(item, index) in trackHistory" :key="index">
                                <span>{{ transTime(item.updateTime) }} </span>
                                <span>{{ item.txt }}</span>
                                <el-popconfirm v-if="!isViewMode" title="确认删除？" @confirm="deleteTrack(index)">
                                    <template #reference>
                                        <el-button type="danger" class="del" :icon="Delete" size="small" circle />
                                    </template>
                                </el-popconfirm>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <!-- Action Buttons -->
            <div style="margin-top: 20px;">
                <template v-if="isViewMode">
                    <el-button type="primary" @click="startEditing">编辑</el-button>
                    <el-button @click="cancelEdit">关闭</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="saveOrder">保存订单</el-button>
                    <el-button @click="cancelEdit">取消</el-button>
                </template>
            </div>
        </div>

        <!-- 面单预览弹窗 -->
        <WaybillPreview
            v-model="waybillVisible"
            :order-id="waybillOrderId"
            :goods-count="waybillGoodsCount"
        />
    </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage, UploadProps } from 'element-plus';
import { Check, Delete, Plus } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, watch } from 'vue';
import {
    apiGetOrders, apiGetOrder, apiAddOrder, apiSetOrder, apiDeleteOrder,
    apiGetGoods, apiAddGoods, apiSetGoods, apiDeleteGoods,
    apiGetTrack, apiSetTrack, apiGenerateOrderId,
    baseURL, apiExportBill
} from '../../api/index';
import WaybillPreview from './waybillPreview/index.vue';
import countryOption, { countryMap } from './country';
import { useImgBaseUrl } from '../../utils/useImgBaseUrl';

const formLabelWidth = '140px';
const uploadImgUrl = `${baseURL}/v1/upload`;
const imgHeader = ref({ zhtoken: localStorage.getItem('zh_token') });

const loadOpt = {
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
};

// ============== Order List State ==============
const orderList = ref<any[]>([]);
const stateList = ref<any>({
    state1: [], state2: [], state3: [], state4: [], state5: [], state6: [],
});
const stateOn = ref<number>(100);
const currentPage = ref(1);
const pageSize = ref(50);
const selectedOrders = ref<any[]>([]);
const filterDateRange = ref<string[]>([]);
const filterDestination = ref('');

// ============== Filter helper ==============
const getFilteredList = () => {
    let list = stateOn.value === 100
        ? orderList.value
        : stateList.value[`state${stateOn.value + 1}`] || [];

    if (filterDateRange.value && filterDateRange.value.length === 2) {
        const [start, end] = filterDateRange.value;
        list = list.filter((item: any) => {
            if (!item.updateTime) return false;
            const d = new Date(parseInt(item.updateTime)).toISOString().slice(0, 10);
            return d >= start && d <= end;
        });
    }
    if (filterDestination.value) {
        list = list.filter((item: any) => item.destination === filterDestination.value);
    }
    return list;
};

const totalPage = ref(0);
const tableData = ref<any[]>([]);

const refreshTable = () => {
    const filtered = getFilteredList();
    totalPage.value = filtered.length;
    const start = (currentPage.value - 1) * pageSize.value;
    tableData.value = filtered.slice(start, start + pageSize.value);
};

watch([orderList, stateOn, currentPage, pageSize, filterDateRange, filterDestination], refreshTable, { deep: true });

const applyFilters = () => {
    currentPage.value = 1;
    refreshTable();
};

const enumState = ['待上网', '运输中', '派送中', '投递失败', '成功签收', '可能异常'];
const stateOptions = [
    { id: '0', name: '待上网' },
    { id: '1', name: '运输中' },
    { id: '2', name: '派送中' },
    { id: '3', name: '投递失败' },
    { id: '4', name: '成功签收' },
    { id: '5', name: '可能异常' },
];

const handleSelectionChange = (selection: any[]) => {
    selectedOrders.value = selection;
};

const exportBill = () => {
    if (selectedOrders.value.length === 0) {
        ElMessage.warning('请先勾选要导出的订单');
        return;
    }
    const loading = ElLoading.service(loadOpt);
    const orderIds = selectedOrders.value.map(item => item.orderId || item.id);
    apiExportBill(orderIds).then((res: any) => {
        if (res.code === 0) {
            ElMessage.success('账单导出成功');
        } else {
            ElMessage.error(res.msg || '导出失败');
        }
    }).finally(() => loading.close());
};

// ===== 面单生成 =====
const waybillVisible = ref(false);
const waybillOrderId = ref('');
const waybillGoodsCount = ref(1);
const goodsMapRef = ref<Record<string, any[]>>({});

const openWaybill = (row: any) => {
    waybillOrderId.value = row.orderId || row.id;
    // 获取该订单的货物数量
    apiGetGoods(waybillOrderId.value).then((res: any) => {
        if (res.code >= 0 && res.data) {
            const list = Array.isArray(res.data) ? res.data : [];
            goodsMapRef.value[waybillOrderId.value] = list;
            waybillGoodsCount.value = list.length || 1;
        } else {
            waybillGoodsCount.value = 1;
        }
        waybillVisible.value = true;
    });
};

const transTime = (date: string | Date) => {
    const time = new Date(typeof date === 'string' ? parseInt(date) : date);
    return `${time.getFullYear()}/${(time.getMonth() + 1).toString().padStart(2, '0')}/${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
};


const formatter = (row: any) => enumState[row.state];
const trCountry = (row: any) => countryMap[row.destination];
const customsFormatter = (row: any) => row.ifCustoms === '1' ? '单证报关' : '买单报关';
const formatTime = (row: any) => {
    if (!row.updateTime) return '';
    return transTime(row.updateTime);
};
const formatInHouseTime = (row: any) => {
    if (!row.inHouseTime) return '';
    return transTime(row.inHouseTime);
};

// ============== Pagination & Filter ==============
const handleSizeChange = (val: number) => {
    pageSize.value = val;
    currentPage.value = 1;
    refreshTable();
};
const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    refreshTable();
};
const switchList = (index: number) => {
    stateOn.value = index;
    currentPage.value = 1;
    refreshTable();
};

// ============== Fetch Orders ==============
const getOrders = () => {
    filterDateRange.value = [];
    filterDestination.value = '';
    selectedOrders.value = [];
    return apiGetOrders().then((res: any) => {
        const dataList = Array.isArray(res?.data) ? res.data : (res?.data ? [res.data] : []);
        if (res?.code >= 0 && dataList.length > 0) {
            const tempStateList: any = {
                state1: [], state2: [], state3: [], state4: [], state5: [], state6: [],
            };
            orderList.value = dataList.map((ele: any) => {
                const temp = { ...ele };
                switch (String(ele.state)) {
                    case '0': tempStateList.state1.push(temp); break;
                    case '1': tempStateList.state2.push(temp); break;
                    case '2': tempStateList.state3.push(temp); break;
                    case '3': tempStateList.state4.push(temp); break;
                    case '4': tempStateList.state5.push(temp); break;
                    case '5': tempStateList.state6.push(temp); break;
                }
                return temp;
            });
            stateList.value = tempStateList;
            switchList(stateOn.value);
        } else {
        }
    }).catch((err: any) => {
    });
};

const deleteOrder = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    apiDeleteOrder({ id }).then((res) => {
        if (res.code >= 0) {
            ElMessage.success('成功删除一项');
            getOrders();
        }
    }).finally(() => loading.close());
};

// ============== Inline Edit State ==============
const editing = ref(false);
const isEdit = ref(false);
const isViewMode = ref(false);
const activeTab = ref('goods');

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

// ============== Goods State ==============
const goodsList = ref<any[]>([]);
const showGoodsForm = ref(false);
const editingGoodsIndex = ref(-1);
const { imgBaseUrl, extractImgBaseUrl, getImgUrl } = useImgBaseUrl();
const inPicUrl = ref('');
const outPicUrl = ref('');
const signPicUrl = ref('');

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
    signPic: '',
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
    goodsForm.signPic = '';
    inPicUrl.value = '';
    outPicUrl.value = '';
    signPicUrl.value = '';
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
        signPic: row.signPic || '',
    });
    inPicUrl.value = getImgUrl(row.inPic);
    outPicUrl.value = getImgUrl(row.outPic);
    signPicUrl.value = getImgUrl(row.signPic);
    showGoodsForm.value = true;
};

const cancelGoodsEdit = () => {
    showGoodsForm.value = false;
    editingGoodsIndex.value = -1;
    clearGoodsForm();
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

const fetchGoods = () => {
    if (!form.orderId) return;
    apiGetGoods(form.orderId).then((res) => {
        if (res.code >= 0 && res.data) {
            imgBaseUrl.value = extractImgBaseUrl(res) || imgBaseUrl.value;
            goodsList.value = Array.isArray(res.data) ? res.data : (res.data.goods || res.data.list || []);
        }
    });
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
const handleSignPicSuccess: UploadProps['onSuccess'] = (response, file) => {
    signPicUrl.value = URL.createObjectURL(file.raw!);
    imgBaseUrl.value = extractImgBaseUrl(response) || imgBaseUrl.value;
    if (response.code >= 0) {
        goodsForm.signPic = response.data?.imgurl || '';
    }
};

// ============== Track State ==============
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
    newTrack.value = {
        updateTime: new Date(),
        txt: '',
    };
};

const deleteTrack = (index: number) => {
    trackHistory.value.splice(index, 1);
};

const toTrack = (id: string) => {
    window.open('http://www.zhonghanlogistics.cn/track/?' + 'order_id=' + id, 'blank');
};

// ============== Order Edit Actions ==============
const getId = () => {
    apiGenerateOrderId().then((res) => {
        if (res.code >= 0 && res.data) {
            form.orderId = res.data;
        }
    });
};

const clearForm = () => {
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
    newTrack.value = { updateTime: new Date(), txt: '' };
    activeTab.value = 'goods';
};

const addOrder = () => {
    isEdit.value = false;
    isViewMode.value = false;
    clearForm();
    editing.value = true;
};

const editOrder = (row: any) => {
    isEdit.value = true;
    isViewMode.value = true;
    editing.value = true;
    clearForm();
    const loading = ElLoading.service(loadOpt);
    apiGetOrder(row.orderId || row.id).then((res) => {
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
            fetchGoods();
        }
        loading.close();
    });
};

const closeEdit = () => {
    editing.value = false;
    isViewMode.value = false;
};

const cancelEdit = () => {
    if (isViewMode.value) {
        closeEdit();
    } else if (isEdit.value) {
        isViewMode.value = true;
    } else {
        closeEdit();
    }
};

const startEditing = () => {
    isViewMode.value = false;
};

const saveOrder = () => {
    if (!form.orderId || !form.destination || !form.time) {
        ElMessage.error('信息填写不完整');
        return;
    }
    const loading = ElLoading.service(loadOpt);

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

    const orderApi = isEdit.value ? apiSetOrder(orderPayload) : apiAddOrder(orderPayload);

    orderApi.then((res) => {
        if (res.code === 0) {
            // Save track history
            apiSetTrack({
                id: form.orderId,
                history: JSON.stringify(trackHistory.value.concat([])),
                state: form.trackState,
                ps: form.ps,
            }).then(() => {
                ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
                cancelEdit();
                getOrders();
            });
        } else {
            ElMessage.info(res.msg);
        }
    }).finally(() => loading.close());
};

// ============== Init ==============
onMounted(() => {
    try {
        const loading = ElLoading.service(loadOpt);
        getOrders().finally(() => {
            loading.close();
        });
    } catch (e) {
    }
});
</script>

<style scoped>
.container {
    min-width: 1000px;
}

.box {
    margin-bottom: 20px;
}

.box h3 {
    margin-bottom: 10px;
}

.box .btn {
    margin-bottom: 10px;
}

.horizon-box {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
}

.state-box {
    display: flex;
    justify-content: start;
    width: 80%;
    padding: 8px 0;
}

.toolbar {
    display: flex;
    align-items: center;
    padding: 8px 0;
    flex-wrap: wrap;
}

.state-box .btn {
    width: 100px;
}

.pagination {
    margin-top: 10px;
}

.edit-area {
    border-top: 2px solid #409eff;
    padding-top: 20px;
}

.stit {
    padding: 8px;
    font-weight: 600;
    background-color: #f1f1f1;
    margin-bottom: 8px;
}

.edit-tabs {
    margin-top: 20px;
}

.goods-form {
    margin-top: 10px;
    padding: 10px;
    background-color: #fafafa;
    border-radius: 6px;
}

.avatar-uploader .avatar {
    height: 178px;
    display: block;
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

.el-image-viewer__wrapper {
    z-index: 99999 !important;
}
.el-tabs__header,
.el-tabs__nav-wrap,
.el-tabs__nav-scroll,
.el-tabs__nav {
    z-index: auto !important;
}
.el-table__inner-wrapper::before,
.el-table__body-wrapper,
.el-table__fixed,
.el-table__fixed-right {
    z-index: auto !important;
}

[aria-required] label::before {
    content: '*';
    color: var(--el-color-danger);
    margin-right: 4px;
}
</style>
