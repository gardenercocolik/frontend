<template>
  <div>
    <NavBar title="网络安全实验中心 - 学生端" />
  
    <div class="student-view">
    <el-row>
      <el-col :span="4" class="menu-col">
        <el-menu default-active="1" @select="handleSelect">
          <el-menu-item index="1">竞赛报备</el-menu-item>
          <el-menu-item index="2">竞赛记录</el-menu-item>
          <el-menu-item index="3">团队管理</el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="20">
        <div v-if="activeTab === '1'" class="right-col">
          <el-row
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            "
          >
            <h2 style="font-size: 24px">竞赛报备</h2>
            <el-button
              type="primary"
              @click="showReportDialog"
              style="font-size: 18px; padding: 20px"
              >创建报备</el-button
            >
          </el-row>
          <div>
            <el-collapse v-model="activeNamesReport">
              <el-collapse-item title="待审核 (Pending)" name="pending_report">
                <el-table
                  v-if="filteredReports.pending.length"
                  :data="filteredReports.pending"
                  style="width: 100%"
                >
                  <el-table-column prop="name" label="比赛名"></el-table-column>
                  <el-table-column
                    prop="competition_start"
                    label="比赛开始时间"
                  ></el-table-column>
                  <el-table-column
                    prop="competition_end"
                    label="比赛结束时间"
                  ></el-table-column>
                  <el-table-column
                    prop="report_date"
                    label="报备提交时间"
                  ></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                  <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        @click="handleDeleteReport(row.ReportID)"
                        :icon="Delete"
                      />
                    </template>
                  </el-table-column>
                </el-table>
                <div v-else>无待报备记录</div>
              </el-collapse-item>

              <el-collapse-item
                title="已拒绝 (Rejected)"
                name="rejected_report"
              >
                <el-table
                  v-if="filteredReports.rejected.length"
                  :data="filteredReports.rejected"
                  style="width: 100%"
                >
                  <el-table-column prop="name" label="比赛名"></el-table-column>
                  <el-table-column
                    prop="competition_start"
                    label="比赛开始时间"
                  ></el-table-column>
                  <el-table-column
                    prop="competition_end"
                    label="比赛结束时间"
                  ></el-table-column>
                  <el-table-column
                    prop="report_date"
                    label="报备提交时间"
                  ></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                </el-table>
                <div v-else>无已拒绝记录</div>
              </el-collapse-item>

              <el-collapse-item
                title="已批准 (Approved)"
                name="approved_report"
              >
                <el-table
                  v-if="filteredReports.approved.length"
                  :data="filteredReports.approved"
                  style="width: 100%"
                >
                  <el-table-column prop="name" label="比赛名"></el-table-column>
                  <el-table-column
                    prop="competition_start"
                    label="比赛开始时间"
                  ></el-table-column>
                  <el-table-column
                    prop="competition_end"
                    label="比赛结束时间"
                  ></el-table-column>
                  <el-table-column
                    prop="report_date"
                    label="报备提交时间"
                  ></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                </el-table>
                <div v-else>无已批准记录</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>

        <!-- 竞赛记录 -->
        <div v-if="activeTab === '2'" class="right-col">
          <h2 style="padding-bottom: 20px">竞赛记录</h2>
          <div class="total-participation">
            <span style="font-size: 16px"
              >有效的竞赛记录: {{ totalParticipationCount }}</span
            >
          </div>
          <el-collapse v-model="activeNamesRecord">
            <el-collapse-item title="已批准 (Approved)" name="approved_record">
              <el-table
                v-if="filteredRecords.approved.length"
                :data="filteredRecords.approved"
                style="width: 100%"
              >
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column
                  prop="level"
                  label="比赛级别"
                ></el-table-column>
                <el-table-column
                  prop="report_date"
                  label="提交时间"
                ></el-table-column>
                <el-table-column
                  prop="status"
                  label="审核状态"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button
                        type="primary"
                        @click="downloadpdf(row.ReportID)"
                        style="background-color: green">生成pdf
                      </el-button>
                      <el-button
                        type="primary"
                        @click="handlePreview(row.ReportID)">预览pdf
                      </el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无已批准记录</div>
            </el-collapse-item>

            <el-collapse-item
              title="记录待上传 (Waiting)"
              name="waiting_record"
            >
              <el-table
                v-if="filteredRecords.waiting.length"
                :data="filteredRecords.waiting"
                style="width: 100%"
              >
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column
                  prop="level"
                  label="比赛级别"
                ></el-table-column>
                <el-table-column
                  prop="report_date"
                  label="提交时间"
                ></el-table-column>
                <el-table-column
                  prop="status"
                  label="审核状态"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button
                        type="primary"
                        @click="showRecordDialog(row.ReportID)"
                        >上传记录</el-button
                      >
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无待上传的记录</div>
            </el-collapse-item>

            <el-collapse-item title="待审核 (Pending)" name="pending_record">
              <el-table
                v-if="filteredRecords.pending.length"
                :data="filteredRecords.pending"
                style="width: 100%"
              >
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column
                  prop="level"
                  label="比赛级别"
                ></el-table-column>
                <el-table-column
                  prop="report_date"
                  label="提交时间"
                ></el-table-column>
                <el-table-column
                  prop="status"
                  label="审核状态"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button
                        type="primary"
                        @click="showRecordDialog(row.ReportID)"
                        >重新上传</el-button
                      >
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无待审核记录</div>
            </el-collapse-item>

            <el-collapse-item title="已拒绝 (Rejected)" name="rejected_record">
              <el-table
                v-if="filteredRecords.rejected.length"
                :data="filteredRecords.rejected"
                style="width: 100%"
              >
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column
                  prop="level"
                  label="比赛级别"
                ></el-table-column>
                <el-table-column
                  prop="report_date"
                  label="提交时间"
                ></el-table-column>
                <el-table-column
                  prop="status"
                  label="审核状态"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button
                        type="primary"
                        @click="showRecordDialog(row.ReportID)"
                        >重新上传</el-button
                      >
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无已拒绝记录</div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 团队管理 -->
        <div v-if="activeTab === '3'" class="right-col">
          <TeamManagement v-model="teams" />
        </div>
      </el-col>
    </el-row>

    <!--预览pdf弹窗-->
    <el-dialog
    title="预览 PDF"
    v-model="previewDialogVisible"
    width="80%"
    height="100%"
    :before-close="handlePreviewClose"
    >
    <iframe
      :src="previewUrl"
      frameborder="0"
      style="width: 100%; height: 900px; border: none;"
    ></iframe>
    </el-dialog>



    <!-- 创建报备弹窗 -->
    <el-dialog title="创建报备" v-model="reportDialogVisible" width="45%">
      <el-form ref="reportForm" :model="newReport" label-width="120px">
        <!-- 比赛级别选择,根据选择的比赛级别，动态获取比赛名 -->
        <el-form-item label="比赛级别">
          <el-select
            v-model="newReport.level"
            placeholder="请选择比赛级别"
            @change="handleGetCompetitionName"
          >
            <el-option label="S" value="S"></el-option>
            <el-option label="A+" value="A+"></el-option>
            <el-option label="A" value="A"></el-option>
            <el-option label="B+" value="B+"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="other" value="Other"></el-option>
          </el-select>
        </el-form-item>

        <!-- 比赛名 -->
        <el-form-item label="比赛名称">
          <template v-if="newReport.level === 'Other'">
            <el-input
              v-model="newReport.name"
              placeholder="请输入比赛名称"
            ></el-input>
          </template>
          <template v-else>
            <el-select v-model="newReport.name" placeholder="请选择比赛名称">
              <el-option
                v-for="name in comNames"
                :key="name"
                :label="name"
                :value="name"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>


        <!--比赛类型:个人赛or团队赛-->
        <el-form-item label="参赛形式">
          <el-radio-group v-model="newReport.participation_form">
            <el-radio :value="'personal'">个人赛</el-radio>
            <el-radio :value="'team'">团队赛</el-radio>
          </el-radio-group>
          <!-- 团队赛新增团队选择 -->
          <template v-if="newReport.participation_form === 'team'">
              <el-select v-model="newReport.team_id" placeholder="请选择团队(请先创建团队)">
                  <el-option
                    v-for="team in teams.data"
                    :key="team.team_id"
                    :label="team.team_name"
                    :value="team.team_id"
                  ></el-option>
                </el-select>
          </template>
        </el-form-item>

        <!-- 比赛时间 -->
        <el-form-item label="比赛时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateChange"
          ></el-date-picker>
        </el-form-item>

        <!-- 指导老师 -->
        <el-form-item label="指导老师">
<<<<<<< HEAD:src/views/dashboard/StudentPage.vue
         <el-input v-model="newReport.instructor"></el-input>
=======
          <el-input
              v-model="newReport.instructor"
              placeholder="请输入指导老师名称"
            ></el-input>
        </el-form-item>

        <!-- 指导老师教工号 -->
        <el-form-item label="指导老师教工号">
          <el-input
              v-model="newReport.instructor_id"
              placeholder="请输入指导老师教工号"
            ></el-input>
>>>>>>> fe0b885a46d19b9270ee9d9489c2b3bba250726c:src/views/dashboard/StudentPage/StudentPage.vue
        </el-form-item>

        <!-- 提交表单 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmitReport">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 上传记录弹窗 -->
    <el-dialog title="上传竞赛记录" v-model="recordDialogVisible" width="45%">
      <el-form ref="recordForm" :model="newRecord" label-width="120px">
        <el-form-item label="比赛照片">
          <el-upload
            :on-change="handleImageChange"
            :on-remove="handleRemove"
            :show-file-list="true"
            :file-list="formattedFileList(newRecord.photos)"
            :auto-upload="false"
            :limit="3"
            accept="image/*"
            :before-upload="beforeUpload"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传竞赛照片,不超过 3 张</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="比赛总结">
          <el-input
            type="textarea"
            v-model="newRecord.summary"
            :rows="6"
            :maxlength="250"
            show-word-limit
            placeholder="包含竞赛收获,竞赛名次,不超过250字"
          ></el-input>
          <div class="word-count">
            字数: {{ newRecord.summary.length }} / 250
          </div>
        </el-form-item>

        <el-form-item label="成绩证明">
          <el-upload
            :on-change="handleCaChange"
            :on-remove="handleCaRemove"
            :show-file-list="true"
            :file-list="formattedFileList(newRecord.certificates)"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :before-upload="beforeUpload"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                请上传获奖证书图片,若无请上传其他名次证明（至多1张）
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="报销金额">
          <el-input v-model.number="newRecord.reimbursement"></el-input>
        </el-form-item>

        <el-form-item label="报销凭证">
          <el-upload
            :on-change="handlePrChange"
            :on-remove="handlePrRemove"
            :show-file-list="true"
            :file-list="formattedFileList(newRecord.proof)"
            :auto-upload="false"
            :limit="3"
            accept="image/*"
            :before-upload="beforeUpload"
          >
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                请上传报销凭证（发票、支票等），不超过 3 张
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmitRecord">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed ,reactive } from "vue";
import { ElMessage } from "element-plus";
import NavBar from "@/components/NavBar.vue";
import TeamManagement from "@/views/dashboard/StudentPage/TeamManagement.vue";
import { useCompeition } from "../../../composables/useCompeition";
import { Delete } from "@element-plus/icons-vue";
const {
  getRecords,
  getReports,
  getCompetitionName,
  submitReport,
  submitRecord,
  downloadpdf,
  previewpdf,
  deleteReport,
} = useCompeition();



// 响应式数据
const activeTab = ref("1");
const reportDialogVisible = ref(false);
const recordDialogVisible = ref(false);
const dateRange = ref([]); // 存储选择的日期范围

const reports = ref([]); // 报备列表
const records = ref([]); // 记录列表

const activeNamesReport = [
  "pending_report",
  "rejected_report",
  "approved_report",
]; // 默认展开的报备面板
const activeNamesRecord = [
  "waiting_record",
  "pending_record",
  "approved_record",
  "rejected_record",
]; // 默认展开的记录面板

const newReport = ref({
  name: "",
  competition_start: "",
  competition_end: "",
  level: "",
  instructor: "",
  instructor_id: "",
  participation_form: "personal",
  team_id: "",
});

const newRecord = ref({
  photos: [],
  summary: "",
  certificates: [],
  reimbursement: 0,
  proof: [],
  ReportID: "",
});

const comNames = ref([]); // 竞赛名称列表
const sortOrder = ref("descending"); // 排序方式
const previewDialogVisible=ref(false);
const previewUrl=ref("");
const teams = reactive({
  data: []  // 这里是父组件的 teams 数据
});

/** 计算属性 */

// 计算排序后的报备列表
const sortedReports = computed(() => {
  return [...reports.value].sort((a, b) => {
    const dateA = new Date(a.report_date).getTime();
    const dateB = new Date(b.report_date).getTime();
    return sortOrder.value === "descending" ? dateB - dateA : dateA - dateB;
  });
});

// 计算状态过滤的报备列表
const filteredReports = computed(() => {
  return {
    pending: sortedReports.value.filter(
      (item) => item.status === "pending_report"
    ),
    rejected: sortedReports.value.filter(
      (item) => item.status === "rejected_report"
    ),
    approved: sortedReports.value.filter(
      (item) => item.status === "approved_report"
    ),
  };
});

// 计算状态过滤的记录列表
const filteredRecords = computed(() => {
  return {
    waiting: records.value.filter((item) => item.status === "approved_report"),
    pending: records.value.filter((item) => item.status === "pending_record"),
    rejected: records.value.filter((item) => item.status === "rejected_record"),
    approved: records.value.filter((item) => item.status === "approved_record"),
  };
});

// 计算参赛数量
const totalParticipationCount = computed(() => {
  return records.value.filter((record) => record.status === "approved_record")
    .length;
});

/** 方法 */

// 显示创建报备弹窗
const showReportDialog = () => {
  reportDialogVisible.value = true;
  resetNewReport();
};

// 重置创建报备表单
const resetNewReport = () => {
  newReport.value = {
    name: "",
    competition_start: "",
    competition_end: "",
    level: "",
    instructor: "",
    instructor_id: "",
    participation_form: "personal",
    team_id: "",
  };
};

// 显示创建记录弹窗
const showRecordDialog = (ReportID) => {
  if (!ReportID) {
    ElMessage.error("未选择记录!");
    return;
  }
  recordDialogVisible.value = true;
  resetNewRecord();
  newRecord.value.ReportID = ReportID; // 记录当前项的 ID
  getRecords(records); // 继续进行您的后续操作
};

// 重置创建记录表单
const resetNewRecord = () => {
  newRecord.value = {
    photos: [],
    summary: "",
    certificates: [],
    reimbursement: 0,
    proof: [],
    ReportID: "",
  };
};

//预览pdf
const handlePreview = async (ReportID) => {
  await previewpdf(ReportID,previewUrl);
  console.log(previewDialogVisible.value);
  previewDialogVisible.value = true;
  console.log(previewUrl.value);
  console.log(previewDialogVisible.value);
};

// 获取比赛名称列表
const handleGetCompetitionName = async (level) => {
  newReport.value.name = "";
  await getCompetitionName(newReport, comNames);
};


// 提交报备
const handleSubmitReport = async () => {
  console.log(newReport.value);
  console.log(newReport.value.instructor.name);
  if (
    !newReport.value.name ||
    !newReport.value.competition_start ||
    !newReport.value.competition_end ||
    !newReport.value.level ||
    !newReport.value.instructor||
    !newReport.value.instructor_id||
    !newReport.value.participation_form
  ) {
    ElMessage.error("请填写所有必填项!!!");
    return;
  }
  await submitReport(newReport, reportDialogVisible);
  getReports(reports);
  resetNewReport();
};

// 删除报备
const handleDeleteReport = async (ReportID) => {
  await deleteReport(ReportID);
  getReports(reports);
};

// 提交竞赛记录
const handleSubmitRecord = async () => {
  if (
    !newRecord.value.summary ||
    !newRecord.value.reimbursement ||
    !newRecord.value.photos.length ||
    !newRecord.value.certificates.length ||
    !newRecord.value.proof.length ||
    !newRecord.value.ReportID
  ) {
    ElMessage.error("请填写所有必填项!!!");
    return;
  }
  await submitRecord(newRecord, recordDialogVisible);
  getRecords(records);
  resetNewRecord();
};

// 监听 Tab 切换
const handleSelect = (index) => {
  activeTab.value = index;
  if (index === "1") {
    getReports(reports);
  }
  if (index === "2") {
    getRecords(records);
  }
  if (index === "3") {
    console.log("TeamManagement");
  
  }
};

// 页面加载完成后执行
onMounted(async () => {
  getReports(reports);
  getRecords(records);
  console.log("StudentPage mounted");
});

// 文件上传相关处理
const beforeUpload = (file) => {
  return true;
};

// 更新竞赛图片列表
const handleImageChange = (file) => {
  if (file.status === "ready") {
    newRecord.value.photos.push(file); // file 中包含文件对象 raw
  }
};

const handleRemove = (file, fileList) => {
  newRecord.value.photos = fileList;
};

// 格式化文件列表
const formattedFileList = (files) => {
  return files.map((file) => {
    return {
      ...file,
      name:
        file.name.length > 10 ? file.name.substring(0, 10) + "..." : file.name, // 限制显示的文件名长度
    };
  });
};

//关闭预览弹窗
const handlePreviewClose = () => {
      previewDialogVisible.value = false;
      previewUrl.value = ""; // 关闭时清理 URL
    };
// 处理证书上传
const handleCaChange = (file) => {
  if (file.status === "ready") {
    newRecord.value.certificates.push(file);
  }
};

const handleCaRemove = (file, fileList) => {
  newRecord.value.certificates = fileList;
};

// 处理凭证上传
const handlePrChange = (file) => {
  if (file.status === "ready") {
    newRecord.value.proof.push(file);
  }
};

const handlePrRemove = (file, fileList) => {
  newRecord.value.proof = fileList;
};

// 将创建报备中输入的比赛时间范围转化为开始时间和结束时间
const handleDateChange = (value) => {
  newReport.value.competition_start = value[0]; // 获取开始日期
  newReport.value.competition_end = value[1]; // 获取结束日期
};

</script>

<style scoped>
.app {
  padding: 20px;
  overflow: hidden;
}
.student-view {
  background-color: white;
  min-height: 92vh;
  overflow: hidden;
}
.menu-col {
  text-align: center;
  padding-top: 20px;
  overflow: hidden;
}
.right-col {
  margin: 0;
  padding: 20px;
  min-height: 80vh;
  border: 1px solid #eee;
  overflow: hidden;
}
.total-participation {
  margin-bottom: 20px;
  font-size: 16px;
  color: #7f7f7f; 
}
</style>
