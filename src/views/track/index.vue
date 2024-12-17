<template>
    <div class="container">
        <TrackDialog ref="TrackDiaRef"></TrackDialog>
        <div class="box">
            <SelfDialog ref="DialogRef" @success="sucCallback"></SelfDialog>
            <h3>轨迹信息</h3>

            <el-button class="btn" type="primary" @click="showDialog">添加订单</el-button>
            <div class="horizon-box">

                <el-table :data="newsList" border style="width: 100%">
                    <el-table-column type="index" label="序号" width="80" align="center" />
                    <el-table-column prop="time" label="日期" width="180" align="center" />
                    <el-table-column prop="orderId" label="单号" width="180" align="center" />
                    <el-table-column prop="state" label="最新状态" align="center" />
                    <el-table-column prop="end" label="目的地" align="center" />
                    <el-table-column label="Operations" width="100">
                        <template #default="scope">
                            <!-- <el-button link type="primary" size="small" @click="detail">
                      Detail
                    </el-button> -->
                            <el-button link type="primary" size="small" @click="showDialog(scope.row)">编辑</el-button>
                            <el-button link type="primary" size="small"
                                @click="deleteNews(scope.row.id.toString())">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ElLoading, ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { apiDeleteNews, apiGetNews } from '../../api/index'
import SelfDialog from './dialog.vue'
import TrackDialog from './trackDialog.vue'

const DialogRef = ref<any>(null);
const TrackDiaRef = ref<any>(null);

const loadOpt = {
  lock: true,
  text: "Loading",
  background: "rgba(0, 0, 0, 0.7)",
};
// 内容
const newsList = ref<
  {
    id: string;
    title: string;
    time: string;
    content: string;
  }[]
>([]);

///

const showDialog = (info?: any) => {
  TrackDiaRef.value.show(info);
};

const getNews = () => {
  return apiGetNews().then((res) => {
    if (res.code >= 0) {
      newsList.value = res.data.sort((a: {time: number}, b: {time: number}) => b.time - a.time);
    }
  });
};

const deleteNews = (id: string) => {
  const loading = ElLoading.service(loadOpt);
//   apiDeleteNews({ id }).then((res) => {
//     if (res.code >= 0) {
//       ElMessage.success("成功删除一项banner");
//       getNews();
//     }
//   }).finally(() => {
//     loading.close()
//   });
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