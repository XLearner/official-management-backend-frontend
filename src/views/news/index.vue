<template>
    <div class="container">
        <div class="box">
            <SelfDialog ref="DialogRef" @success="sucCallback"></SelfDialog>
            <h3>新闻动态</h3>

            <el-button class="btn" type="primary" @click="showDialog">添加新闻</el-button>
            <div class="horizon-box">
                <el-card class="box-card horizon-item" v-for="item in currentNewss">
                    <h4>{{ item.title }}</h4>
                    <time>{{
                `${item.date.slice(0, 4)}-${item.date.slice(
                  4,
                  6
                )}-${item.date.slice(6)}`
              }}</time>
                    <div class="bottom">
                      <p>{{ item.description }}</p>
                    </div>
                    <el-button class="edit-btn" type="primary" :icon="Edit" circle @click="() => showDialog(item)" />
                    <el-button class="del-btn" type="danger" :icon="Delete" circle @click="() => deleteNews(item.id)" />
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
import { apiDeleteNews, apiGetNews } from '../../api/index'
import SelfDialog from './dialog.vue'

const DialogRef = ref<any>(null);

const loadOpt = {
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
};
// 内容
const currentNewss = ref<
  {
    id: string;
    title: string;
    description: string;
    date: string;
  }[]
>([]);

///

const showDialog = (info?: any) => {
    DialogRef.value.show(info);
};
const getNews = () => {
  return apiGetNews().then((res) => {
    if (res.code >= 0) {
      currentNewss.value = res.data;
    }
  });
};
const deleteNews = (id: string) => {
  const loading = ElLoading.service(loadOpt);
  apiDeleteNews({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getNews();
    }
  }).finally(() => {
    loading.close()
  });
};
const sucCallback = () => {
  const loading = ElLoading.service(loadOpt);
  getNews().finally(() => {
    loading.close()
  });
};


onMounted(() => {
    const loading = ElLoading.service(loadOpt);
    getNews().finally(() => {
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