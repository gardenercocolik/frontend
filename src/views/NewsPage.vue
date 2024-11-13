<template>
  <NavBar title="网络安全实验中心 - 新闻动态" />
  <el-row :gutter="20">
    <!-- 遍历结果数据 -->
    <el-col v-for="(event, index) in data.result" :key="index" :span="8">
      <el-card :body-style="{ padding: '20px' }" class="schedule-card">
        <div class="event-header">
          <h3>{{ event.name }}</h3>
          <p>{{ event.type }} - {{ event.status }}</p>
        </div>
        <div class="event-details">
          <p>
            <strong>开始时间:</strong> {{ formatDate(event.comp_time_start) }}
          </p>
          <p>
            <strong>结束时间:</strong> {{ formatDate(event.comp_time_end) }}
          </p>
          <p>
            <strong>报名开始时间:</strong>
            {{ formatDate(event.reg_time_start) }}
          </p>
          <p>
            <strong>报名结束时间:</strong> {{ formatDate(event.reg_time_end) }}
          </p>
        </div>
        <div class="event-footer">
          <el-button type="primary" @click="viewDetails(event)"
            >查看详情</el-button
          >
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";
import { ElCard, ElRow, ElCol, ElButton } from "element-plus";
import NavBar from "@/components/NavBar.vue";

// 模拟数据
const data = ref({
  success: true,
  result: [
    {
      name: "蜀道山高校联合公益赛",
      info_confirmed: 1,
      mid_join: 0,
      link: "https://ctf.yunyansec.com/#/event/center",
      status: "即将开始",
      is_reg: 0,
      limit: "3",
      type: "线上Jeopardy解题赛",
      reg_time_start: "2024年11月17日 10:00",
      reg_time_end: "2024年11月17日 09:59",
      comp_time_start: "2024年11月17日 10:00",
      comp_time_end: "2024年11月17日 18:00",
      organizer:
        "西南民族大学、成都东软学院、成都信息工程大学、四川师范大学、成都理工大学D1no战队、西南石油大学、成都大学、西华师范大学、江西警察学院、哈尔滨理工大学、衡阳师范学院、宁波职业技术学院、浙江工商职业技术学院、山东警察学院、广东行政职业学院、四川大学、南京信息职业技术学院、聊城职业技术学院",
      contac: {},
      tag: "公益赛",
      readmore:
        "蜀道山高校联合公益赛由西南民族大学、成都东软学院、成都信息工程大学、四川师范大学、成都理工大学D1no战队、西南石油大学、成都大学、西华师范大学、江西警察学院、哈尔滨理工大学、衡阳师范学院、宁波职业技术学院、浙江工商职业技术学院、山东警察学院、广东行政职业学院、四川大学、南京信息职业技术学院、聊城职业技术学院等高校联合主办。竞赛时间为2024年11月17日10:00至18:00 ，竞赛形式为Jeopardy，每队3人。",
    },
    {
      name: "BRICS+ CTF Quals 2024",
      link: "https://brics-ctf.com/",
      type: "团队赛",
      reg_time_start: "2024年10月05日 18:00",
      reg_time_end: "2024年10月06日 18:00",
      comp_time_start: "2024年10月05日 18:00",
      comp_time_end: "2024年10月06日 18:00",
      readmore:
        "初赛将以在线解题赛的形式进行.计划邀请来自金砖国家的15支队伍（每个国家不超过3支队伍）以及总排名前10的最佳队伍参与线上的决赛.同时详情信息请加入discord -> https://discord.gg/3AwqYTvaMw 决赛总奖池7w人民币左右",
      status: "已经结束",
    },
  ],
});

// 格式化时间
const formatDate = (dateStr) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateStr).toLocaleString("zh-CN", options);
};

// 查看详情
const viewDetails = (event) => {
  window.open(event.link, "_blank");
};
</script>

<style scoped>
.schedule-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-header {
  font-size: 18px;
  font-weight: bold;
}

.event-details {
  margin-top: 10px;
  font-size: 14px;
}

.event-footer {
  margin-top: 15px;
  text-align: center;
}
</style>
