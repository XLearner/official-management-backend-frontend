<template>
    <div class="container">
        <div class="box">
            <RelativeServiceDialog ref="RelativeRef" @success="RelativeSuc"></RelativeServiceDialog>
            <h3>相关服务 设置</h3>
            <el-button class="btn" type="primary" @click="showRelativeDialog">添加服务</el-button>
            <div class="horizon-box">
                <el-card class="card-box" v-for="item in currentRelatives" :body-style="{ padding: '0px' }"
                    :key="item.id">
                    <div class="horizon-item">
                        <div class="img-box">
                            <img :src="item.img" class="image" />
                        </div>
                        <div class="txt-box">
                            <div style="padding: 14px">
                                <h4>
                                    {{ item.title }} / <span>{{ item.engTit }}</span>
                                </h4>
                                <div class="bottom">
                                    <div v-html="item.description"></div>
                                </div>
                            </div>
                            <el-button class="edit-btn" type="primary" :icon="Edit" circle
                                @click="() => showRelativeDialog(item)" />
                            <el-button class="del-btn" type="danger" :icon="Delete" circle
                                @click="() => deleteRelative(item.id)" />
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import { Delete, Edit } from "@element-plus/icons-vue";
import { onMounted, ref } from 'vue';
import { apiDeleteRelative, apiGetRelative } from '../../api/index'
import RelativeServiceDialog from './relative.vue'

const RelativeRef = ref<any>(null);

const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};
const showRelativeDialog = (info?: any) => {
    RelativeRef.value.show(info instanceof Event ? null : info);
};
// 优势内容
const currentRelatives = ref<
    {
        id: string;
        img: string;
        title: string;
        engTit: string;
        description: string;
    }[]
>([]);
const getRelative = () => {
    return apiGetRelative().then((res) => {
        if (res.code >= 0) {
            currentRelatives.value = res.data;
        }
    });
};
const deleteRelative = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    apiDeleteRelative({ id }).then((res) => {
        if (res.code >= 0) {
            ElMessage.success("成功删除一项banner");
            getRelative();
        }
    }).finally(() => {
        loading.close()
    });
};
const RelativeSuc = () => {
    const loading = ElLoading.service(loadOpt);
    getRelative().finally(() => {
        loading.close()
    });
};

onMounted(() => {
    const loading = ElLoading.service(loadOpt);
    getRelative().finally(() => {
        loading.close()

    })

})
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

.card-box {
    margin-bottom: 20px;
}

.horizon-item {
    position: relative;
    display: flex;
}

.txt-box {}

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
    width: 400px;
    padding: 20px;
}

.image {
    min-width: 400px;
}
</style>