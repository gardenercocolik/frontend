<template>
  <NavBar title="网络安全实验中心 - 新闻动态" />

  <!-- 最新的三个新闻卡片展示 -->
  <div class="latest-news">
    <h2 style="color:white">最新新闻</h2>
    <el-row :gutter="20">
      <!-- 遍历显示最新的3条新闻 -->
      <el-col
        v-for="(news, index) in latestNews"
        :key="index"
        :span="8"
        :xs="24" :sm="12" :md="8"
        class="news-col"
      >
        <el-card class="news-card">
          
          <div class="news-header">
            <h3>{{ news.title }}</h3>
          </div>
          <img :src="news.image" alt="News Image" class="news-image" />
          <p>发布时间：{{ news.publish_time }}</p>
          <div class="event-footer">
            <el-button type="primary" @click="viewDetails(news)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <!-- 最近一个月的新闻标题列表 -->
  <div class="monthly-news">
    
 
    <!-- 使用 el-button 来代替列表 -->
    <el-row :gutter="20">
      <el-col
        v-for="(news, index) in monthlyNews"
        :key="index"
        :span="8"
        :xs="24" :sm="12" :md="8"
      >
        <el-button type="text" @click="viewDetails(news)">
          {{ news.title }}
        </el-button>
      </el-col>
    </el-row>
  </div>

  <!-- 竞赛信息展示 -->
  <div class="competition-info">
    <h2 style="color:white">最新竞赛信息</h2>
    <el-row :gutter="20">
      <!-- 遍历竞赛数据 -->
      <el-col
        v-for="(event, index) in data.result"
        :key="index"
        :span="8"
        :xs="24" :sm="12" :md="8"
        class="event-col"
      >
        <el-card class="schedule-card">
          <div class="event-header">
            <h3>{{ event.name }}</h3>
            <p>{{ event.type }} - {{ event.status }}</p>
          </div>
          <div class="event-details">
            <p><strong>开始时间:</strong> {{ event.comp_time_start }}</p>
            <p><strong>结束时间:</strong> {{ event.comp_time_end }}</p>
            <p>
              <strong>报名开始时间:</strong>
              {{ event.reg_time_start }}
            </p>
            <p><strong>报名结束时间:</strong> {{ event.reg_time_end }}</p>
            <p class="event-description">
              <strong>其他说明:</strong> {{ event.readmore }}
            </p>
          </div>

          <div class="event-footer">
            <el-button type="primary" @click="viewDetails(event)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElCard, ElRow, ElCol, ElButton, ElDivider } from "element-plus";
import NavBar from "@/components/NavBar.vue";

// 定义新闻数据和竞赛数据
const latestNews = ref([
  {
    title: "网络安全大赛2024开始报名",
    image: new URL("../assets/HomePage.jpg", import.meta.url).href,
    content: "报名通道已开启，欢迎各位同学积极报名。",
    publish_time: "2024-10-25",
    link: "#",
  },
  {
    title: "网络安全技术研讨会举办",
    image: new URL("../assets/default_avatar.png", import.meta.url).href,
    content: "将有众多专家分享最新的网络安全研究成果。",
    publish_time: "2024-10-18",
    link: "#",
  },
  {
    title: "网络安全实验室开放日dsfgfgsdfgddfgsdg",
    image: new URL("../assets/R.png", import.meta.url).href,
    content: "欢迎大家来参观网络安全实验室，了解最新的研究项目。",
    publish_time: "2024-10-10",
    link: "#",
  },
]);

const monthlyNews = ref([
  { title: "网络安全大赛报名通知", link: "#" },
  { title: "网络安全技术研讨会议程发布", link: "#" },
  { title: "网络安全实验室开放日活动介绍", link: "#" },
]);

const data = ref({
  success: false,
  result: [],
});

onMounted(async () => {
  try {
    const response = await fetch("/News.json"); // 假设 News.json 在 public 文件夹
    const jsonData = await response.json();
    data.value.result = jsonData.data.result;
    data.value.success = jsonData.success;
  } catch (error) {
    console.error("加载数据失败:", error);
    data.value.success = false;
  }
});

// 查看新闻详情
const viewDetails = (news) => {
  window.open(news.link, "_blank");
};

// 查看竞赛详情
const viewDetailsCompetition = (event) => {
  window.open(event.link, "_blank");
};
</script>

<style scoped>
/* 新闻卡片的样式 */
.news-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 380px;
}

.news-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.news-header {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  height: 60px;
}

.news-content {
  margin-top: 10px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-col {
  position: relative;
}

.el-row {
  margin-right: -10px;
  margin-left: -10px;
}

/* 竞赛信息的样式 */
.schedule-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 420px;
}

.event-header {
  font-size: 18px;
  font-weight: bold;
  height: 80px;
}

.event-details {
  margin-top: 10px;
  font-size: 14px;
  height: 210px;
}

.event-footer {
  margin-top: 15px;
  text-align: center;
  
}

.event-description {
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.6;
  font-size: 14px;
  text-overflow: ellipsis;
}

.event-col {
  position: relative;
  padding-right: 10px;
  padding-top: 10px;
  /* border-right: 2px solid #ddd; */
}

.event-col:last-child {
  border-right: none;
}
</style>
