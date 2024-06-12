<template>
    <div class="container">
        <div class="box">
            <SelfDialog ref="DialogRef" @success="sucCallback"></SelfDialog>
            <h3>合作客户</h3>

            <el-button class="btn" type="primary" @click="showDialog">添加客户</el-button>
            <div class="horizon-box">
                <el-card v-for="item in currentCustoms" :body-style="{ padding: '0px' }" :key="item.id"
                    class="horizon-item">
                    <div class="img-box">
                        <img :src="item.logo" class="image" />
                    </div>
                    <div style="padding: 14px">
                        <h4>{{ item.title }}</h4>
                        <div class="bottom">
                            <div>{{ item.description }}</div>
                            <p>是否展示：{{ item.ifShow === "1" ? "展示" : "不展示" }}</p>
                        </div>
                    </div>
                    <el-button class="edit-btn" type="primary" :icon="Edit" circle @click="() => showDialog(item)" />
                    <el-button class="del-btn" type="danger" :icon="Delete" circle
                        @click="() => deleteCustom(item.id)" />
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ElLoading, ElMessage } from 'element-plus';
import { Delete, Edit } from "@element-plus/icons-vue";
import { onMounted, ref } from 'vue';
import { apiDeleteCustom, apiGetCustom } from '../../api/index'
import SelfDialog from './dialog.vue'

const DialogRef = ref<any>(null);

const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};
// 内容
const currentCustoms = ref<
    {
        id: string;
        logo: string;
        title: string;
        description: string;
        ifShow: string;
    }[]
>([]);

///

// banner 模块
const showDialog = (info?: any) => {
    DialogRef.value.show(info);
};
const getCustom = () => {
    return apiGetCustom().then((res) => {
        if (res.code >= 0) {
            currentCustoms.value = res.data;
        }
    });
};
const deleteCustom = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    apiDeleteCustom({ id }).then((res) => {
        if (res.code >= 0) {
            ElMessage.success("成功删除一项banner");
            getCustom();
        }
    }).finally(() => {
        loading.close()
    });
};
const sucCallback = () => {
    const loading = ElLoading.service(loadOpt);
    getCustom().finally(() => {
        loading.close()
    });
};

///

onMounted(() => {
    const loading = ElLoading.service(loadOpt);
    getCustom().finally(() => {
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