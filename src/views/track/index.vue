<template>
    <div class="container">
        <TrackDialog ref="TrackDiaRef" @success="sucCallback"></TrackDialog>
        <div class="box">
            <SelfDialog ref="DialogRef" @success="sucCallback"></SelfDialog>
            <h3>轨迹信息</h3>

            <el-button class="btn" type="primary" @click="showDialog">添加订单</el-button>

            <div class="horizon-box">
                <div class="state-box">
                    <el-link type="primary" class="btn" @click="switchList(100)">全部</el-link>
                    <template v-for="(item, index) in enumState">
                        <el-link :type="stateOn == index ? 'primary' : 'info'" class="btn" @click="switchList(index)">{{
                            item }}({{ stateList[`state${index + 1}`].length }})</el-link>
                    </template>
                </div>
                <el-table :data="tableData" border :default-sort="{ prop: 'updateTime', order: 'descending' }"
                    style="width: 100%">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column prop="updateTime" label="日期" sortable align="center" />
                    <el-table-column prop="id" label="单号" align="center" />
                    <el-table-column prop="state" label="最新状态" align="center" :formatter="formatter" />
                    <el-table-column prop="destination" label="目的地" align="center" :formatter="trCountry" />
                    <el-table-column prop="ps" label="备注" align="center" />
                    <el-table-column label="Operations" width="100">
                        <template #default="scope">
                            <el-button link type="primary" size="small"
                                @click="showHistoryDialog(scope.row)">编辑</el-button>
                            <el-popconfirm title="确认删除？" @confirm="deleteTrack(scope.row.id.toString())">
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
    </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { apiDeleteTrack, apiGetTrack } from '../../api/index'
import SelfDialog from './dialog.vue'
import TrackDialog from './trackDialog.vue'
import { countryMap } from './country';

const DialogRef = ref<any>(null);
const TrackDiaRef = ref<any>(null);

const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};
// 内容
const tableData = ref<
    {
        id: string;
        title: string;
        updateTime: string;
        content: string;
    }[]
>([]);
const trackList = ref<
    {
        id: string;
        title: string;
        updateTime: string;
        content: string;
    }[]
>([]);
const stateList = ref<any>({
    state1: [],
    state2: [],
    state3: [],
    state4: [],
    state5: [],
    state6: [],
});
const stateOn = ref<number>(100);
const currentPage = ref(1)
const pageSize = ref(50)

const totalPage = computed(() => {
    if (stateOn.value == 100) {
        return trackList.value.length;
    }
    return stateList.value[`state${stateOn.value + 1}`].length;
})

const transTime = (date: string) => {
    const time = new Date(parseInt(date));
    return `${time.getFullYear()}/${(time.getMonth() + 1).toString().padStart(2, "0")}/${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")} `;
}

///
const handleSizeChange = (val: number) => {
    pageSize.value = val;
    handleCurrentChange(currentPage.value);
}
const handleCurrentChange = (val: number) => {
    const start = (currentPage.value - 1) * pageSize.value,
        end = currentPage.value * pageSize.value;
    if (stateOn.value == 100) {
        tableData.value = trackList.value.slice(start, end);
    } else {
        tableData.value = stateList.value[`state${stateOn.value + 1}`].slice(start, end);
    }
}
const switchList = (index: number) => {
    stateOn.value = index;
    handleCurrentChange(1);
}

const showDialog = () => {
    DialogRef.value.show();
};
const showHistoryDialog = (info?: any) => {
    TrackDiaRef.value.show(info);
}

const formatter = (row: any) => {
    return enumState[row.state]
}
const trCountry = (row: any) => {
    return countryMap[row.destination];
}
const enumState = ["待上网", "运输中", "派送中", "投递失败", "成功签收", "可能异常"];
const getTrack = () => {
    return apiGetTrack().then((res) => {
        if (res.code >= 0 && res.data && res.data.length > 0) {
            const tempStateList: any = {
                state1: [],
                state2: [],
                state3: [],
                state4: [],
                state5: [],
                state6: [],
            };
            trackList.value = res.data.map((ele: any) => {
                const temp = {
                    ...ele,
                    updateTime: transTime(ele.updateTime),
                    history: JSON.parse(ele.history)
                }
                switch (ele.state) {
                    case '0':
                        tempStateList.state1.push(temp);
                        break;
                    case '1':
                        tempStateList.state2.push(temp);
                        break;
                    case '2':
                        tempStateList.state3.push(temp);
                        break;
                    case '3':
                        tempStateList.state4.push(temp);
                        break;
                    case '4':
                        tempStateList.state5.push(temp);
                        break;
                    case '5':
                        tempStateList.state6.push(temp);
                        break;
                }
                return temp;
            });
            stateList.value = tempStateList;
            switchList(stateOn.value);
        }
    });
};

const deleteTrack = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    apiDeleteTrack({ id }).then((res) => {
        if (res.code >= 0) {
            ElMessage.success("成功删除一项");
            getTrack();
        }
    }).finally(() => {
        loading.close()
    });
};
const sucCallback = () => {
    const loading = ElLoading.service(loadOpt);
    getTrack().finally(() => {
        loading.close()
    });
};


onMounted(() => {
    const loading = ElLoading.service(loadOpt);
    getTrack().finally(() => {
        loading.close()

    })

})
</script>


<style scoped>
.container {
    min-width: 1000px;
}

.img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    overflow: hidden;
}

.image {
    max-height: 200px;
    max-width: 90%;
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

.card-box {
    margin-bottom: 20px;
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

.state-box .btn {
    width: 100px;
}

.horizon-item {
    position: relative;
    width: 32%;
    margin-bottom: 10px;
}

.bottom {
    width: 78%;
}

.edit-btn {
    position: absolute;
    bottom: 10px;
    right: 50px;
}

.del-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.pagination {
    margin-top: 10px;
}
</style>