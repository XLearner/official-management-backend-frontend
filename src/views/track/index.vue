<template>
    <div class="container">
        <TrackDialog ref="TrackDiaRef" @success="sucCallback"></TrackDialog>
        <div class="box">
            <SelfDialog ref="DialogRef" @success="sucCallback"></SelfDialog>
            <h3>轨迹信息</h3>

            <el-button class="btn" type="primary" @click="showDialog">添加订单</el-button>
            <div class="horizon-box">

                <el-table :data="trackList" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column prop="updateTime" label="日期" align="center" />
                    <el-table-column prop="id" label="单号" align="center" />
                    <el-table-column prop="state" label="最新状态" align="center" :formatter="formatter" />
                    <el-table-column prop="destination" label="目的地" align="center" />
                    <el-table-column label="Operations" width="100">
                        <template #default="scope">
                            <!-- <el-button link type="primary" size="small" @click="detail">
                      Detail
                    </el-button> -->
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

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
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
const trackList = ref<
    {
        id: string;
        title: string;
        updateTime: string;
        content: string;
    }[]
>([]);

const transTime = (date: string) => {
    const time = new Date(parseInt(date));
    return `${time.getFullYear()}/${(time.getMonth() + 1).toString().padStart(2, "0")}/${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")} `;
}
///

const showDialog = () => {
    DialogRef.value.show();
};
const showHistoryDialog = (info?: any) => {
    TrackDiaRef.value.show(info);
}

const formatter = (row: any) => {
    return enumState[row.state]
}
const enumState = ["待上网", "运输中", "派送中", "投递失败", "成功签收", "可能异常"];
const getTrack = () => {
    return apiGetTrack().then((res) => {
        if (res.code >= 0 && res.data && res.data.length > 0) {
            trackList.value = res.data.map((ele: any) => {
                console.log( JSON.parse(ele.history), ele.history);
                return {
                    ...ele,
                    destination: countryMap[ele.destination],
                    updateTime: transTime(ele.updateTime),
                    history: JSON.parse(ele.history)
                }
            }).sort((a: { date: number }, b: { date: number }) => new Date(b.date).getTime() - new Date(a.date).getTime());
            // trackList.value = res.data.sort((a: { date: number }, b: { date: number }) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
</style>