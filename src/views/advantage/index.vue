<template>
  <div class="container">
    <AdvantageDialog ref="AdvantageRef" @success="AdvantageSuc"></AdvantageDialog>
    <div class="box">
      <h3>优势内容 设置</h3>
      <el-button class="btn" type="primary" @click="showAdvantageDialog">添加优势</el-button>
      <div class="horizon-box">
        <el-card v-for="item in currentAdvantages" :body-style="{ padding: '0px' }" :key="item.id" class="horizon-item">
          <div class="img-box">
            <img :src="item.img" class="image" />
          </div>
          <div style="padding: 14px">
            <div class="bottom">
              <div>{{ item.description }}</div>
              <p>是否展示：{{ item.ifShow === "1" ? "展示" : "不展示" }}</p>
            </div>
          </div>
          <el-button class="edit-btn" type="primary" :icon="Edit" circle @click="() => showAdvantageDialog(item)" />
          <el-button class="del-btn" type="danger" :icon="Delete" circle @click="() => deleteAdvantage(item.id)" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// @ts-ignore
import { ElMessage, ElLoading } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
import {
  apiDeleteAdvantage,
  apiDeleteCustom,
  apiDeleteNews,
  apiGetAdvantage,
  apiGetCustom,
  apiGetNews,
} from "../../api/index";
import AdvantageDialog from "./dialog.vue";

const AdvantageRef = ref<any>(null);

const loadOpt = {
  lock: true,
  text: "Loading",
  background: "rgba(0, 0, 0, 0.7)",
};

// 优势内容
const currentAdvantages = ref<
  {
    id: string;
    img: string;
    description: string;
    ifShow: string;
  }[]
>([]);
const showAdvantageDialog = (info?: any) => {
  AdvantageRef.value.show(info instanceof Event ? null : info);
};
const getAdvantage = () => {
  return apiGetAdvantage().then((res) => {
    if (res.code >= 0) {
      currentAdvantages.value = res.data;
    }
  });
};
const deleteAdvantage = (id: string) => {
  const loading = ElLoading.service(loadOpt);
  apiDeleteAdvantage({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getAdvantage();
    }
  }).finally(() => {
    loading.close()
  });
};
const AdvantageSuc = () => {
  const loading = ElLoading.service(loadOpt);
  getAdvantage().finally(() => {
    loading.close()
  });
};


onMounted(() => {
  const loading = ElLoading.service(loadOpt);
  Promise.all([
    getAdvantage(),
  ]).finally(() => {
    loading.close()
  })
});
</script>

<style scoped>
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
  width: fit-content;
}

.horizon-item {
  max-width: 380px;
  margin-right: 10px;
  position: relative;
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
  height: 150px;
  overflow: hidden;
}

.image {
  max-height: 200px;
  max-width: 90%;
}

.box-card {
  width: 320px;
}

.custom-box .horizon-item {
  width: 300px;
}

.news-box .bottom {
  width: 100%;
  padding-bottom: 30px;
}
</style>
