<template>
  <div class="container">
    <BannerDialog ref="BannerRef" @success="BannerSuc"></BannerDialog>
    <HighlightDialog ref="HighRef" @success="HighSuc"></HighlightDialog>
    <CustomDialog ref="CustomRef" @success="CustomSuc"></CustomDialog>
    <RelativeServiceDialog
      ref="RelativeRef"
      @success="RelativeSuc"
    ></RelativeServiceDialog>
    <AdvantageDialog
      ref="AdvantageRef"
      @success="AdvantageSuc"
    ></AdvantageDialog>
    <NewsDialog ref="NewsRef" @success="NewsSuc"></NewsDialog>
    <h2>首页内容设置</h2>
    <div class="banner-container box">
      <h3>banner 设置</h3>
      <el-button type="primary" @click="showBannerDialog">添加banner</el-button>
      <div class="horizon-box">
        <el-card
          v-for="item in currentBanners"
          :body-style="{ padding: '0px' }"
          :key="item.id"
          class="horizon-item"
        >
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
          <el-button
            class="del-btn"
            type="danger"
            :icon="Delete"
            circle
            @click="() => deleteBanner(item.id)"
          />
        </el-card>
      </div>
    </div>

    <div class="box">
      <h3>亮点业务 设置</h3>
      <el-button type="primary" @click="showHighDialog">添加亮点业务</el-button>
      <div class="horizon-box">
        <el-card class="box-card horizon-item" v-for="item in highlights">
          <h4>
            {{ item.title }} / <span>{{ item.engTit }}</span>
          </h4>
          <p>{{ item.description }}</p>
          <p>是否展示：{{ item.ifShow === "1" ? "展示" : "不展示" }}</p>
          <el-button
            class="edit-btn"
            type="primary"
            :icon="Edit"
            circle
            @click="() => showHighDialog(item)"
          />
          <el-button
            class="del-btn"
            type="danger"
            :icon="Delete"
            circle
            @click="() => deleteHighlight(item.id)"
          />
        </el-card>
      </div>
    </div>

    <div class="box custom-box">
      <h3>合作客户 设置</h3>
      <el-button type="primary" @click="showCustomDialog">添加客户</el-button>
      <div class="horizon-box">
        <el-card
          v-for="item in currentCustoms"
          :body-style="{ padding: '0px' }"
          :key="item.id"
          class="horizon-item"
        >
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
          <el-button
            class="edit-btn"
            type="primary"
            :icon="Edit"
            circle
            @click="() => showCustomDialog(item)"
          />
          <el-button
            class="del-btn"
            type="danger"
            :icon="Delete"
            circle
            @click="() => deleteCustom(item.id)"
          />
        </el-card>
      </div>
    </div>

    <div class="box">
      <h3>优势内容 设置</h3>
      <el-button type="primary" @click="showAdvantageDialog"
        >添加优势</el-button
      >
      <div class="horizon-box">
        <el-card
          v-for="item in currentAdvantages"
          :body-style="{ padding: '0px' }"
          :key="item.id"
          class="horizon-item"
        >
          <div class="img-box">
            <img :src="item.img" class="image" />
          </div>
          <div style="padding: 14px">
            <div class="bottom">
              <div>{{ item.description }}</div>
              <p>是否展示：{{ item.ifShow === "1" ? "展示" : "不展示" }}</p>
            </div>
          </div>
          <el-button
            class="edit-btn"
            type="primary"
            :icon="Edit"
            circle
            @click="() => showAdvantageDialog(item)"
          />
          <el-button
            class="del-btn"
            type="danger"
            :icon="Delete"
            circle
            @click="() => deleteAdvantage(item.id)"
          />
        </el-card>
      </div>
    </div>

    <div class="box">
      <h3>相关服务 设置</h3>
      <el-button type="primary" @click="showRelativeDialog">添加优势</el-button>
      <div class="horizon-box">
        <el-card
          v-for="item in currentRelatives"
          :body-style="{ padding: '0px' }"
          :key="item.id"
          class="horizon-item"
        >
          <div class="img-box">
            <img :src="item.img" class="image" />
          </div>
          <div style="padding: 14px">
            <h4>
              {{ item.title }} / <span>{{ item.engTit }}</span>
            </h4>
            <div class="bottom">
              <div>{{ item.description }}</div>
            </div>
          </div>
          <el-button
            class="edit-btn"
            type="primary"
            :icon="Edit"
            circle
            @click="() => showRelativeDialog(item)"
          />
          <el-button
            class="del-btn"
            type="danger"
            :icon="Delete"
            circle
            @click="() => deleteRelative(item.id)"
          />
        </el-card>
      </div>
    </div>

    <div class="box news-box">
      <h3>新闻动态 设置</h3>
      <el-button type="primary" @click="showNewsDialog">添加新闻</el-button>
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
          <el-button
            class="edit-btn"
            type="primary"
            :icon="Edit"
            circle
            @click="() => showNewsDialog(item)"
          />
          <el-button
            class="del-btn"
            type="danger"
            :icon="Delete"
            circle
            @click="() => deleteNews(item.id)"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
import {
  apiDeleteAdvantage,
  apiDeleteBanner,
  apiDeleteCustom,
  apiDeleteHighlightBusi,
  apiDeleteNews,
  apiDeleteRelative,
  apiGetAdvantage,
  apiGetBanner,
  apiGetCustom,
  apiGetHighlightBusi,
  apiGetNews,
  apiGetRelative,
} from "../../api/index";
import BannerDialog from "./banner.vue";
import HighlightDialog from "./highlightBusi.vue";
import CustomDialog from "./custom.vue";
import AdvantageDialog from "./advantage.vue";
import RelativeServiceDialog from "./relative.vue";
import NewsDialog from "./news.vue";

const BannerRef = ref<any>(null);
const HighRef = ref<any>(null);
const CustomRef = ref<any>(null);
const AdvantageRef = ref<any>(null);
const RelativeRef = ref<any>(null);
const NewsRef = ref<any>(null);

const currentBanners = ref<
  {
    id: "";
    imgurl: "";
    title: "";
    description: "";
    date: "";
  }[]
>([]);
// banner 模块
const showBannerDialog = () => {
  BannerRef.value.show();
};
const getBanner = () => {
  apiGetBanner().then((res) => {
    if (res.code >= 0) {
      currentBanners.value = res.data;
    }
  });
};
const deleteBanner = (id: string) => {
  apiDeleteBanner({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getBanner();
    }
  });
};
const BannerSuc = () => {
  getBanner();
};

// 亮点业务
const highlights = ref<
  {
    id: string;
    title: string;
    engTit: string;
    description: string;
    ifShow: string;
  }[]
>([]);
const showHighDialog = (info?: any) => {
  HighRef.value.show(info instanceof Event ? null : info);
};
const getHighlight = () => {
  apiGetHighlightBusi().then((res) => {
    if (res.code >= 0) {
      highlights.value = res.data;
    }
  });
};
const deleteHighlight = (id: string) => {
  apiDeleteHighlightBusi({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getHighlight();
    }
  });
};
const HighSuc = () => {
  getHighlight();
};

// 合作客户
const currentCustoms = ref<
  {
    id: string;
    logo: string;
    title: string;
    description: string;
    ifShow: string;
  }[]
>([]);
const showCustomDialog = (info?: any) => {
  CustomRef.value.show(info instanceof Event ? null : info);
};
const getCustom = () => {
  apiGetCustom().then((res) => {
    if (res.code >= 0) {
      currentCustoms.value = res.data;
    }
  });
};
const deleteCustom = (id: string) => {
  apiDeleteCustom({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getCustom();
    }
  });
};
const CustomSuc = () => {
  getCustom();
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
  apiGetAdvantage().then((res) => {
    if (res.code >= 0) {
      currentAdvantages.value = res.data;
    }
  });
};
const deleteAdvantage = (id: string) => {
  apiDeleteAdvantage({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getAdvantage();
    }
  });
};
const AdvantageSuc = () => {
  getAdvantage();
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
const showRelativeDialog = (info?: any) => {
  RelativeRef.value.show(info instanceof Event ? null : info);
};
const getRelative = () => {
  apiGetRelative().then((res) => {
    if (res.code >= 0) {
      currentRelatives.value = res.data;
    }
  });
};
const deleteRelative = (id: string) => {
  apiDeleteRelative({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getRelative();
    }
  });
};
const RelativeSuc = () => {
  getRelative();
};

// 新闻动态
const currentNewss = ref<
  {
    id: string;
    title: string;
    description: string;
    date: string;
  }[]
>([]);
const showNewsDialog = (info?: any) => {
  NewsRef.value.show(info instanceof Event ? null : info);
};
const getNews = () => {
  apiGetNews().then((res) => {
    if (res.code >= 0) {
      currentNewss.value = res.data;
    }
  });
};
const deleteNews = (id: string) => {
  apiDeleteNews({ id }).then((res) => {
    if (res.code >= 0) {
      ElMessage.success("成功删除一项banner");
      getNews();
    }
  });
};
const NewsSuc = () => {
  getNews();
};

onMounted(() => {
  getBanner();
  getHighlight();
  getCustom();
  getAdvantage();
  getRelative();
  getNews();
});
</script>

<style scoped>
.banner-container {
  width: 100%;
  overflow: auto;
}
.box {
  margin-bottom: 20px;
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
