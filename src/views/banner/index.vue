<template>
    <div class="container">
        <div class="box">
            <SelfDialog ref="DialogRef" @success="sucCallback"></SelfDialog>
            <h3>banner 设置</h3>

            <el-button class="btn" type="primary" @click="showDialog">添加banner</el-button>
            <div class="horizon-box">
                <el-card v-for="item in currentBanners" :body-style="{ padding: '0px' }" :key="item.id"
                    class="horizon-item">
                    <div class="img-box">
                        <img :src="item.imgurl" class="image" />
                    </div>
                    <div style="padding: 14px">
                        <h4>{{ item.title }}</h4>
                        <div class="bottom">
                            <time class="time">{{ item.date }}</time>
                            <!-- <el-button text class="button">Operating</el-button> -->
                            <div>{{ item.description }}</div>
                        </div>
                    </div>
                    <el-button class="del-btn" type="danger" :icon="Delete" circle
                        @click="() => deleteBanner(item.id)" />
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
import { apiDeleteBanner, apiGetBanner } from '../../api/index'
import SelfDialog from './dialog.vue'

const DialogRef = ref<any>(null);

const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};
// 内容
const currentBanners = ref<
  {
    id: "";
    imgurl: "";
    title: "";
    description: "";
    date: "";
  }[]
>([]);

///

// banner 模块
const showDialog = () => {
    DialogRef.value.show();
};
const getBanner = () => {
    return apiGetBanner().then((res) => {
        if (res.code >= 0) {
            currentBanners.value = res.data;
        }
    });
};
const deleteBanner = (id: string) => {
    const loading = ElLoading.service(loadOpt);
    apiDeleteBanner({ id }).then((res) => {
        if (res.code >= 0) {
            ElMessage.success("成功删除一项banner");
            getBanner();
        }
    }).finally(() => {
        loading.close()
    });
};
const sucCallback = () => {
    const loading = ElLoading.service(loadOpt);
    getBanner().finally(() => {
        loading.close()
    });
};

///

onMounted(() => {
    const loading = ElLoading.service(loadOpt);
    getBanner().finally(() => {
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
    padding: 20px;
}

.image {
    min-width: 400px;
}
</style>