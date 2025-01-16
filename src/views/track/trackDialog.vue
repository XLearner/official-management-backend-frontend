<template>
    <el-dialog v-model="dialogFormVisible" title="轨迹编辑" :before-close="beforeClose" :width="800">
        <el-form :model="form">
            <el-form-item label="订单号" :label-width="formLabelWidth">
                <el-input v-model="form.id" disabled></el-input>
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
                <el-select v-model="form.state" placeholder="状态" size="large" style="width: 240px">
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
                    <li v-for="(item, index) in trackHistory" :key="item.updateTime">
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
import { ElMessage } from 'element-plus';
import {
    Check,
    Delete
} from '@element-plus/icons-vue'
import { reactive, ref, defineEmits, defineExpose, Ref } from "vue";
import { apiSetTrack } from "../../api";
import countryOption from './country';

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
const trackHistory: any = ref([]);
const newTrack = ref({
    updateTime: new Date(),
    txt: ''
})

const transTime = (date: Date) => {
    const time = new Date(date);
    return `${time.getFullYear()}/${(time.getMonth() + 1).toString().padStart(2, "0")}/${time.getDate().toString().padStart(2, '0')} ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")} `;
}
const transDate = (date: string) => {
    const year = +date.slice(0, 4);
    const month = +date.slice(4, 6) - 1;
    const day = +date.slice(6);
    return new Date(year, month, day);
}

const form = reactive({
    id: "",
    state: '0',
    updateTime: new Date(),
    destination: "",
    ps: ""
});
const emits = defineEmits(["success"]);

const show = (info: any) => {
    dialogFormVisible.value = true;
    Object.assign(form, {
        id: info.id,
        state: info.state,
        updateTime: transDate(info.updateTime),
        destination: info.destination,
        ps: info.ps,
    })
    trackHistory.value = info.history
};
const close = () => {
    dialogFormVisible.value = false;
    clearDialog();
};
const beforeClose = (done: () => void) => {
    clearDialog();
    done();
};

const clearDialog = () => {
    form.id = "";
    form.state = "0";
    form.updateTime = new Date();
    form.destination = "";
    form.ps = "";

};

const pushTrack = () => {
    if (!newTrack.value.txt) {
        ElMessage.info('信息输入为空');
        return;
    }
    trackHistory.value.push(newTrack.value)
    newTrack.value = {
        updateTime: new Date(),
        txt: ''
    }
}

const deleteTrack = (index: number) => {
    trackHistory.value.splice(index, 1)
}

const submit = () => {
    apiSetTrack({
        id: form.id,
        history: JSON.stringify(trackHistory.value.concat([])),
        state: form.state,
        ps: form.ps,
    }).then((res) => {
        if (res.code === 0) {
            ElMessage.success("更新成功");
            close();
            emits("success");
        } else {
            ElMessage.info(res.msg);
        }
    });
};

defineExpose({ show, close });
</script>

<style scoped>
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
</style>