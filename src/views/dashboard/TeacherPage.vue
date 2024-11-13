<template>
  <div class="teacher-view">
    <NavBar title="网络安全实验中心 - 教师端" isLoggedIn="true"></NavBar>
    <el-row>
      <el-col :span="4" class="menu-col">
        <el-menu default-active="1" @select="handleSelect">
          <el-menu-item index="1">报备审核</el-menu-item>
          <el-menu-item index="2">记录审核</el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="20">
        <!-- 报备审核 -->
        <div v-if="activeTab === '1'" class="right-col">
          <h2>报备审核</h2>
          <el-input v-model="searchQuery" placeholder="搜索记录" clearable></el-input>
          <el-collapse v-model="activeNameReports">
            <el-collapse-item title="待审核 (Pending)" name="pending_reports">
              <el-table :data="filteredPendingReports" :default-sort="{ prop: 'report_date', order: 'descending' }">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="student_name" label="学生姓名"></el-table-column>
                <el-table-column prop="student_id" label="学号"></el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="primary" size="small" @click="handleapproveReport(row.ReportID)">通过</el-button>
                      <el-button type="danger" size="small" @click="handlerejectReport(row.ReportID)">拒绝</el-button>
                      <el-button type="info" size="small" @click="showReportDetails(row)">详情</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <el-collapse-item title="已批准 (Approved)" name="approved_reports">
              <el-table :data="filteredApprovedReports">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="student_name" label="学生姓名"></el-table-column>
                <el-table-column prop="student_id" label="学号"></el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="info" size="small" @click="showReportDetails(row)">详情</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <el-collapse-item title="已拒绝 (Rejected)" name="rejected_reports">
              <el-table :data="filteredRejectedReports">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="student_name" label="学生姓名"></el-table-column>
                <el-table-column prop="student_id" label="学号"></el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="info" size="small" @click="showReportDetails(row)">详情</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 记录审核 -->
        <div v-if="activeTab === '2'" class="right-col">
          <h2>记录审核</h2>
          <el-input v-model="searchQuery" placeholder="搜索记录" clearable></el-input>
          <el-collapse v-model = "activeNameRecords">
            <el-collapse-item title="待审核 (Pending)" name="pending_records">
              <el-table :data="filteredPendingRecords">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="student_name" label="学生姓名"></el-table-column>
                <el-table-column prop="student_id" label="学号"></el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="primary" size="small" @click="handleapproveRecord(row.ReportID)">通过</el-button>
                      <el-button type="danger" size="small" @click="handlerejectRecord(row.ReportID)">拒绝</el-button>
                      <el-button type="info" size="small" @click="showRecordDetails(row)">详情</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <el-collapse-item title="已批准 (Approved)" name="approved_records">
              <el-table :data="filteredApprovedRecords">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="student_name" label="学生姓名"></el-table-column>
                <el-table-column prop="student_id" label="学号"></el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="info" size="small" @click="showRecordDetails(row)">详情</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>

            <el-collapse-item title="已拒绝 (Rejected)" name="rejected_records">
              <el-table :data="filteredRejectedRecords">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="student_name" label="学生姓名"></el-table-column>
                <el-table-column prop="student_id" label="学号"></el-table-column>
                <el-table-column prop="level" label="等级"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="info" size="small" @click="showRecordDetails(row)">详情</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>

    <!-- 报备详细信息弹窗 -->
    <el-dialog v-model="reportDialogVisible" title="报备详细信息">
      <div>
        <p>学生姓名: {{ selectedReport.student_name }}</p>
        <p>学号: {{ selectedReport.student_id }}</p>
        <p>比赛名: {{ selectedReport.name }}</p>
        <p>比赛开始时间: {{ selectedReport.competition_start }}</p>
        <p>比赛结束时间: {{ selectedReport.competition_end }}</p>
        <p>比赛级别: {{ selectedReport.level }}</p>
        <p>提交时间: {{ selectedReport.report_date }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reportDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 记录详细信息弹窗 -->
    <el-dialog v-model="recordDialogVisible" title="记录详细信息">
      <div>
        <p>学生姓名: {{ selectedRecord.student_name }}</p>
        <p>学号: {{ selectedRecord.student_id }}</p>
        <p>比赛名: {{ selectedRecord.name }}</p>
        <p>比赛级别: {{ selectedRecord.level }}</p>
        <p>比赛照片:</p>
        <div v-for="photo in selectedRecord.photos" :key="photo">
          <button @click="fetchPhoto(photo)">查看详情</button>
          <span style="margin-right: 10px"></span> <!-- 为了视觉效果，可以添加间隔 -->
        </div>
        <p>比赛总结: {{ selectedRecord.summary }}</p>
        <p>成绩证明:</p>
        <a :href="selectedRecord.certificate" target="_blank">{{ selectedRecord.certificate }}</a>
        <p>报销金额: {{ selectedRecord.reimbursement_amount }}</p>
        <p>报销凭证:</p>
        <div v-for="proof in selectedRecord.proofs" :key="proof">
          <a :href="proof" target="_blank">{{ proof }}</a>
          <span style="margin-right: 10px"></span> <!-- 为了视觉效果，可以添加间隔 -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recordDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script setup>
import NavBar from "../../components/NavBar.vue";
import { ref, onMounted, computed } from "vue";
import { useCompeition } from "../../composables/useCompeition";
const { getReports, getRecords, approveReport, rejectReport, approveRecord, rejectRecord } = useCompeition();

// 响应式数据
const activeTab = ref("1");
const searchQuery = ref("");
const reports = ref([]);
const records = ref([]);
const reportDialogVisible = ref(false);
const recordDialogVisible = ref(false);
const selectedReport = ref({});
const selectedRecord = ref({});

const activeNameReports = ['pending_reports', 'rejected_reports', 'approved_reports']; // 竞赛报备默认展开的面板
const activeNameRecords = ['pending_records', 'rejected_records', 'approved_records']; // 竞赛记录默认展开的面板

// 获取报备
const handlegetReports = async () => {
  await getReports(reports);
};

// 获取记录
const handlegetRecords = async () => {
  await getRecords(records);
};

// 通过报备审核
const handleapproveReport = async ( id ) => {
  await approveReport( id );
  await getReports(reports);
};

// 拒绝报备审核
const handlerejectReport = async ( id ) => {
  await rejectReport( id );
  await getReports(reports);
};

// 通过记录审核
const handleapproveRecord = async ( id ) => {
  await approveRecord( id );
  await getRecords(records);
};

// 拒绝记录审核
const handlerejectRecord = async ( id ) => {
  await rejectRecord( id );
  await getRecords(records);
};



// 显示报备详细信息
const showReportDetails = (report) => {
  selectedReport.value = report;
  reportDialogVisible.value = true;
};

// 显示记录详细信息
const showRecordDetails = (record) => {
  selectedRecord.value = record;
  console.log(selectedRecord.value);
  recordDialogVisible.value = true;
};

// 切换 Tab
const handleSelect = (index) => {
  activeTab.value = index;
  if (index === "1") {
    handlegetReports();
  } else {
    handlegetRecords();
  }
};

// 计算过滤后的报备记录
const filteredReports = computed(() => {
  return reports.value.filter(
    (report) =>
      report.name.includes(searchQuery.value) ||
      report.student_name.includes(searchQuery.value) ||
      report.student_id.includes(searchQuery.value) ||
      report.level.includes(searchQuery.value)
  );
});

// 计算过滤后的待审核报备记录
const filteredPendingReports = computed(() => {
  return filteredReports.value.filter(report => report.status === 'pending_report');
});

// 计算过滤后的已批准报备记录
const filteredApprovedReports = computed(() => {
  return filteredReports.value.filter(report => report.status === 'approved_report');
});

// 计算过滤后的已拒绝报备记录
const filteredRejectedReports = computed(() => {
  return filteredReports.value.filter(report => report.status === 'rejected_report');
});

// 计算过滤后的记录
const filteredRecords = computed(() => {
  return records.value.filter(
    (record) =>
      record.name.includes(searchQuery.value) ||
      record.student_name.includes(searchQuery.value) ||
      record.student_id.includes(searchQuery.value) ||
      record.level.includes(searchQuery.value)
  );
});

// 计算过滤后的待审核记录
const filteredPendingRecords = computed(() => {
  return filteredRecords.value.filter(record => record.status === 'pending_record');
});

// 计算过滤后的已批准记录
const filteredApprovedRecords = computed(() => {
  return filteredRecords.value.filter(record => record.status === 'approved_record');
});

// 计算过滤后的已拒绝记录
const filteredRejectedRecords = computed(() => {
  return filteredRecords.value.filter(record => record.status === 'rejected_record');
});

// 获取照片
const fetchPhoto = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      // 如果请求成功，可以进行后续处理，比如显示图片
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      window.open(imageUrl, '_blank'); // 在新标签页中打开图片
    } else {
      console.error('请求失败', response.status);
      // 可以添加相应的错误处理逻辑
    }
  } catch (error) {
    console.error('发生错误:', error);
    // 处理网络错误
  }
};

// 页面加载完成后执行
onMounted(() => {
  handlegetReports();
  handlegetRecords();
});
</script>

<style scoped>
.teacher-view {
  min-height: 92vh;
  background-color: #ffffff;
}
.menu-col {
  border-right: 1px solid #ffffff;
  padding-top: 100px;
}
.right-col {
  padding: 20px;
}
.dialog-footer {
  text-align: right;
}
</style>
