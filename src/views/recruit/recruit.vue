<template>
  <div class="container">
    <RecruitDialog ref="RecruitRef" @success="RecruitSuc"></RecruitDialog>
    <h2>招聘内容设置</h2>
    <el-button type="primary" @click="showRecruitDialog">新增招聘</el-button>

    <div class="horizon-box">
      <el-card
        v-for="item in currentRecruits"
        :body-style="{ padding: '0px' }"
        :key="item.id"
        class="horizon-item"
      >
        <h3 class="name">{{ item.name }}</h3>
        <!-- <p class="time">
          {{
            `${item.date.slice(0, 4)}-${item.date.slice(
              4,
              6
            )}-${item.date.slice(6)}`
          }}
        </p> -->
        <div class="job-desc">
          <h4>岗位描述</h4>
          <div class="txt">
            <p v-for="o in displayContent(item.jobDesc)">{{ o }}</p>
          </div>
        </div>
        <div class="requirement">
          <h4>岗位要求</h4>
          <div class="txt">
            <p v-for="o in displayContent(item.requirement)">{{ o }}</p>
          </div>
        </div>
        <el-button
          class="edit-btn"
          type="primary"
          :icon="Edit"
          circle
          @click="() => showRecruitDialog(item)"
        />
        <el-button
          class="del-btn"
          type="danger"
          :icon="Delete"
          circle
          @click="() => deleteRecruit(item.id)"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import RecruitDialog from "./dialog.vue";
import { apiDeleteRecruit, apiGetRecruit } from "../../api";
import { ElMessage } from "element-plus";

const RecruitRef = ref<any>(null);
const currentRecruits = ref<
  {
    id: string;
    name: string;
    jobDesc: string;
    requirement: string;
    date: string;
  }[]
>([]);

const showRecruitDialog = (info?: any) => {
  RecruitRef.value.show(info instanceof Event ? null : info);
};
const getRecruit = () => {
  apiGetRecruit().then((res) => {
    if (res.code >= 0) {
      currentRecruits.value = res.data;
    }
  });
};
const deleteRecruit = (id: string) => {
  apiDeleteRecruit({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getRecruit();
    }
  });
};

const RecruitSuc = () => {
  getRecruit();
};

const displayContent = (content: string) => {
  const ctx = content.split("\n");
  return ctx;
};

onMounted(() => {
  getRecruit();
});
</script>

<style scoped>
.horizon-box {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  flex-direction: column;
}
.horizon-item {
  position: relative;
  width: 70%;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.horizon-item .name {
  margin-bottom: 10px;
  font-size: 24px;
}
.horizon-item .time {
  font-size: 16px;
  color: #444;
  margin-bottom: 10px;
}
.horizon-item .job-desc h4 {
  font-size: 18px;
  color: #444;
  margin-bottom: 10px;
}
.horizon-item .job-desc .txt {
  font-size: 16px;
  color: #444;
  margin-bottom: 10px;
  padding-left: 20px;
  line-height: 1.5;
}
.horizon-item .requirement h4 {
  font-size: 18px;
  color: #444;
  margin-bottom: 10px;
}
.horizon-item .requirement .txt {
  font-size: 16px;
  color: #444;
  margin-bottom: 10px;
  padding-left: 20px;
  line-height: 1.5;
}
.edit-btn {
  position: absolute;
  top: 10px;
  right: 50px;
  display: none;
}
.del-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
}
.horizon-item:hover .edit-btn,
.horizon-item:hover .del-btn {
  display: block;
}
</style>
