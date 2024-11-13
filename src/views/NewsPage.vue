<template>
  <NavBar title="网络安全实验中心 - 新闻动态" />
  <el-row :gutter="20">
    <!-- 遍历结果数据 -->
    <el-col
      v-for="(event, index) in data.result"
      :key="index"
      :span="8"
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
          <el-button type="primary" @click="viewDetails(event)"
            >查看详情</el-button
          >
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElCard, ElRow, ElCol, ElButton } from "element-plus";
import NavBar from "@/components/NavBar.vue";

// Define the data as a ref to hold the fetched content
const data = ref({
  success: false,
  result: [],
});

// Fetch the JSON data from the public directory when the component is mounted
onMounted(async () => {
  try {
    const response = await fetch("/News.json"); // This assumes News.json is in the public folder
    const jsonData = await response.json();
    data.value.result = jsonData.data.result;
    data.value.success = jsonData.success;
  } catch (error) {
    console.error("Error loading data:", error);
  }
});

// 查看详情
const viewDetails = (event) => {
  window.open(event.link, "_blank");
};
</script>

<style scoped>
.schedule-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Use full width of column */
  height: 420px; /* Adjust to the desired fixed height */
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

/* Scrollable content for event description */
.event-description {
  max-height: 120px; /* Set max height for the description area */
  overflow-y: auto; /* Allow vertical scrolling */
  line-height: 1.6; /* Adjust line height for readability */
  font-size: 14px;
  text-overflow: ellipsis;
}

/* Styling for the columns */
.event-col {
  position: relative;
  padding-right: 10px; /* Add padding to the right side */
  border-right: 2px solid #ddd; /* Add right border as the guide line */
}

/* Remove the right border for the last column */
.event-col:last-child {
  border-right: none;
}

/* Optional: Adjust the gutter between columns */
.el-row {
  margin-right: -10px; /* Remove gutter on the right side */
  margin-left: -10px; /* Remove gutter on the left side */
}
</style>
