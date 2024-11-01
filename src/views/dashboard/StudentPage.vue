<template>
  <NavBar title="网络安全实验中心 - 学生端" />
  <div class="student-view">
    <el-row>
      <el-col :span="4" class="menu-col">
        <el-menu default-active="1" @select="handleSelect">
          <el-menu-item index="1">竞赛报备</el-menu-item>
          <el-menu-item index="2">竞赛记录</el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="20">
        <div v-if="activeTab === '1'" class="right-col">
          <el-row style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="font-size: 24px;">竞赛报备</h2>
            <el-button type="primary" @click="showReportDialog" style="font-size: 18px; padding: 20px;">创建报备</el-button>
          </el-row>
          <div>
            <el-collapse v-model="activeNamesReport">
              <el-collapse-item title="待审核 (Pending)" name="pending_report">
                <el-table v-if="filteredReports.pending.length" :data="filteredReports.pending" style="width: 100%">
                  <el-table-column prop="name" label="比赛名"></el-table-column>
                  <el-table-column prop="competition_start" label="比赛开始时间"></el-table-column>
                  <el-table-column prop="competition_end" label="比赛结束时间"></el-table-column>
                  <el-table-column prop="report_date" label="报备提交时间"></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                </el-table>
                <div v-else>无待报备记录</div>
              </el-collapse-item>

              <el-collapse-item title="已拒绝 (Rejected)" name="rejected_report">
                <el-table v-if="filteredReports.rejected.length" :data="filteredReports.rejected" style="width: 100%">
                  <el-table-column prop="name" label="比赛名"></el-table-column>
                  <el-table-column prop="competition_start" label="比赛开始时间"></el-table-column>
                  <el-table-column prop="competition_end" label="比赛结束时间"></el-table-column>
                  <el-table-column prop="report_date" label="报备提交时间"></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                </el-table>
                <div v-else>无已拒绝记录</div>
              </el-collapse-item>

              <el-collapse-item title="已批准 (Approved)" name="approved_report">
                <el-table v-if="filteredReports.approved.length" :data="filteredReports.approved" style="width: 100%">
                  <el-table-column prop="name" label="比赛名"></el-table-column>
                  <el-table-column prop="competition_start" label="比赛开始时间"></el-table-column>
                  <el-table-column prop="competition_end" label="比赛结束时间"></el-table-column>
                  <el-table-column prop="report_date" label="报备提交时间"></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                </el-table>
                <div v-else>无已批准记录</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>

        <!-- 竞赛记录 -->
        <div v-if="activeTab === '2'" class="right-col">
          <h2 style="padding-bottom: 20px;">竞赛记录</h2>
          <div class="total-participation">
            <span style="font-size: 16px;">有效的竞赛记录: {{ totalParticipationCount }}</span>
          </div>
          <el-collapse v-model="activeNamesRecord">
            <el-collapse-item title="已批准 (Approved)" name="approved_record">
              <el-table v-if="filteredRecords.approved.length" :data="filteredRecords.approved" style="width: 100%">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="level" label="比赛级别"></el-table-column>
                <el-table-column prop="report_date" label="提交时间"></el-table-column>
                <el-table-column prop="status" label="审核状态"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="primary" @click="generatepdf(row.ReportID)" style = "background-color: green;">生成pdf</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无已批准记录</div>
            </el-collapse-item>
                        
            <el-collapse-item title="记录待上传 (Waiting)" name="waiting_record">
              <el-table v-if="filteredRecords.waiting.length" :data="filteredRecords.waiting" style="width: 100%">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="level" label="比赛级别"></el-table-column>
                <el-table-column prop="report_date" label="提交时间"></el-table-column>
                <el-table-column prop="status" label="审核状态"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="primary" @click="showRecordDialog(row.ReportID)">上传记录</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无待上传的记录</div>
            </el-collapse-item>

            <el-collapse-item title="待审核 (Pending)" name="pending_record">
              <el-table v-if="filteredRecords.pending.length" :data="filteredRecords.pending" style="width: 100%">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="level" label="比赛级别"></el-table-column>
                <el-table-column prop="report_date" label="提交时间"></el-table-column>
                <el-table-column prop="status" label="审核状态"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="primary" @click="showRecordDialog(row.ReportID)">重新上传</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无待审核记录</div>
            </el-collapse-item>

            <el-collapse-item title="已拒绝 (Rejected)" name="rejected_record">
              <el-table v-if="filteredRecords.rejected.length" :data="filteredRecords.rejected" style="width: 100%">
                <el-table-column prop="name" label="比赛名"></el-table-column>
                <el-table-column prop="level" label="比赛级别"></el-table-column>
                <el-table-column prop="report_date" label="提交时间"></el-table-column>
                <el-table-column prop="status" label="审核状态"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <el-button-group>
                      <el-button type="primary" @click="showRecordDialog(row.ReportID)">重新上传</el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
              <div v-else>无已拒绝记录</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>

    <!-- 创建报备弹窗 -->
    <el-dialog title="创建报备" v-model="reportDialogVisible" width="45%">
      <el-form ref="reportForm" :model="newReport" label-width="120px">
        <!-- 比赛级别选择,根据选择的比赛级别，动态获取比赛名 -->
        <el-form-item label="比赛级别">
          <el-select v-model="newReport.level" placeholder="请选择比赛级别" @change="getCompetitionName">
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
            <el-input v-model="newReport.name" placeholder="请输入比赛名称"></el-input>
          </template>
          <template v-else>
            <el-select v-model="newReport.name" placeholder="请选择比赛名称">
              <el-option v-for="name in comNames" :key="name" :label="name" :value="name"></el-option>
            </el-select>
          </template>
        </el-form-item>

        <!-- 比赛时间 -->
        <el-form-item label="比赛时间">
          <el-date-picker v-model="dateRange" type="datetimerange" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleDateChange"></el-date-picker>
        </el-form-item>

        <!-- 提交表单 -->
        <el-form-item>
          <el-button type="primary" @click="submitReport">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 上传记录弹窗 -->
    <el-dialog title="上传竞赛记录" v-model="recordDialogVisible" width="45%">
      <el-form ref="recordForm" :model="newRecord" label-width="120px">
        <el-form-item label="比赛照片">
          <el-upload :on-change="handleImageChange" :on-remove="handleRemove" :show-file-list="true" :file-list="formattedFileList(newRecord.photos)" :auto-upload="false" :limit="3" accept="image/*" :before-upload="beforeUpload">
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传竞赛照片,不超过 3 张</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="比赛总结">
          <el-input type="textarea" v-model="newRecord.summary" :rows="6" :maxlength="250" show-word-limit placeholder="包含竞赛收获,竞赛名次,不超过250字"></el-input>
          <div class="word-count">字数: {{ newRecord.summary.length }} / 250</div>
        </el-form-item>

        <el-form-item label="成绩证明">
          <el-upload :on-change="handleCaChange" :on-remove="handleCaRemove" :show-file-list="true" :file-list="formattedFileList(newRecord.certificates)" :auto-upload="false" :limit="1" accept="image/*" :before-upload="beforeUpload">
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传获奖证书图片,若无请上传其他名次证明（至多1张）</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="报销金额">
          <el-input v-model.number="newRecord.reimbursement"></el-input>
        </el-form-item>

        <el-form-item label="报销凭证">
          <el-upload :on-change="handlePrChange" :on-remove="handlePrRemove" :show-file-list="true" :file-list="formattedFileList(newRecord.proof)" :auto-upload="false" :limit="3" accept="image/*" :before-upload="beforeUpload">
            <template #trigger>
              <el-button type="primary">选择图片</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">请上传报销凭证（发票、支票等），不超过 3 张</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRecord">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
import { useCompeition } from "../../composables/useCompeition";
const { getRecords, getReports, generatepdf } = useCompeition();

// API URL
const API_URL = "http://localhost:18000/dashboard/";

// 响应式数据
const activeTab = ref("1");
const reportDialogVisible = ref(false);
const recordDialogVisible = ref(false);
const dateRange = ref([]); // 用于存储选择的日期范围

const reports = ref([]); // 报备列表
const records = ref([]); // 记录列表

const activeNamesReport = ['pending_report', 'rejected_report', 'approved_report']; // 竞赛报备默认展开的面板
const activeNamesRecord = ['waiting_record', 'pending_record', 'approved_record', 'rejected_record']; // 竞赛记录默认展开的面板

const newReport = ref({
  name: "",
  competition_start: "",
  competition_end: "",
  level: "",
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

// CSRF 令牌
const csrftoken = ref('');

// 获取 CSRF 令牌的函数
const getCSRFToken = async () => {
    try {
        const response = await axios.get("http://localhost:18000/csrf/", { withCredentials: true });
        csrftoken.value = response.data.csrftoken; // 假设返回的数据中包含 csrftoken
    } catch (error) {
        console.error('获取 CSRF 令牌失败：', error);
        ElMessage.error('获取 CSRF 令牌失败');
    }
};

/** 排序相关 */
const sortOrder = ref("descending");
const sortedReports = computed(() => {
  return [...reports.value].sort((a, b) => {
    const dateA = new Date(a.report_date).getTime(); 
    const dateB = new Date(b.report_date).getTime(); 

    return sortOrder.value === "descending" ? dateB - dateA : dateA - dateB;
  });
});

// 计算属性，按状态分类过滤报告
const filteredReports = computed(() => {
  return {
    pending: sortedReports.value.filter(item => item.status === 'pending_report'),
    rejected: sortedReports.value.filter(item => item.status === 'rejected_report'),
    approved: sortedReports.value.filter(item => item.status === 'approved_report'),
  };
});

const filteredRecords = computed(() => {
  return {
    waiting: records.value.filter(item => item.status === 'approved_report'),
    pending: records.value.filter(item => item.status === 'pending_record'),
    rejected: records.value.filter(item => item.status === 'rejected_record'),
    approved: records.value.filter(item => item.status === 'approved_record'),
  };
});



// 将创建报备中输入的比赛时间范围转化为开始时间和结束时间
const handleDateChange = (value) => {
  newReport.value.competition_start = value[0]; // 获取开始日期
  newReport.value.competition_end = value[1]; // 获取结束日期
};

// 计算参赛数量
const totalParticipationCount = computed(() => {
  return records.value.filter(record => record.status === "approved_record").length; 
});



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
  };
};

// 显示创建记录弹窗
const showRecordDialog = (ReportID) => {
  console.log("Selected record ID:", ReportID); // 记录ID用于调试
  if (!ReportID) {
    ElMessage.error("未选择记录!");
    return;
  }
  recordDialogVisible.value = true;
  resetNewRecord();
  newRecord.value.ReportID = ReportID; // 记录当前项的 ID
  getRecords( records ); // 继续进行您的后续操作
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

// 获取比赛名
const getCompetitionName = async () => {
  if (newReport.value.level === "other") {
    return;
  }
  try {
    const formData = new FormData();
    formData.append('level', newReport.value.level); // 将数据添加到 FormData 对象中

    const res = await axios.post(
      `${API_URL}reports/return-competition-name/`,
      formData, // 直接传入 formData
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrftoken.value // 添加 CSRF 令牌
        }
      }
    );

    comNames.value = res.data.data; // 修正路径以匹配后端返回的数据格式
  } catch (error) {
    ElMessage.error("获取比赛名失败");
  }
};

// 提交报备
const submitReport = async () => {
  console.log(newReport.value);
  if (
    !newReport.value.name ||
    !newReport.value.competition_start ||
    !newReport.value.competition_end ||
    !newReport.value.level
  ) {
    ElMessage.error("请填写所有必填项!!!");
    return;
  }

  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('name', newReport.value.name);
  formData.append('competition_start', newReport.value.competition_start);
  formData.append('competition_end', newReport.value.competition_end);
  formData.append('level', newReport.value.level);

  try {
    const res = await axios.post(
      `${API_URL}reports/create/`,
      formData,  // 使用 FormData 作为请求体
      {
        withCredentials: true, // 添加 withCredentials
        headers: {
          'X-CSRFToken': csrftoken.value // 添加 CSRF 令牌
        }
      }
    );
    
    if (res.status === 201) {
      resetNewReport();
      await getReports( reports );
      ElMessage.success("报备成功!");
      reportDialogVisible.value = false;
    }
    window.location.reload();
  } catch (error) {
    ElMessage.error(error.response?.data?.error || "报备失败，请稍后再试");
  }
};

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


const formattedFileList = (files) => {
  return files.map(file => {
    return {
      ...file,
      name: file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name // 限制显示的文件名长度
    };
  });
}

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

// 提交竞赛记录
const submitRecord = async () => {
  console.log(newRecord.value);
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
  
  const formData = new FormData();
  formData.append("summary", newRecord.value.summary);
  console.log(newRecord.value.reimbursement);
  formData.append("reimbursement", newRecord.value.reimbursement.toString());
  formData.append("ReportID", newRecord.value.ReportID);

  // 处理照片
  newRecord.value.photos.forEach((photo) => {
    formData.append("photos", photo.raw); // photo 中包含文件对象 raw
  });

  // 处理证书
  newRecord.value.certificates.forEach((certificate) => {
    formData.append("certificates", certificate.raw); // certificate 中包含文件对象 raw
  });

  // 处理报销凭证
  newRecord.value.proof.forEach((proof) => {
    formData.append("proof", proof.raw); // proof 中包含文件对象 raw
  });

  try {
    const res = await axios.post(
      `${API_URL}records/submit/`,
      formData,
      {
        withCredentials: true, // 添加 withCredentials
        headers: {
          "Content-Type": "multipart/form-data", // 指定内容类型为表单数据
          'X-CSRFToken': csrftoken.value // 添加 CSRF 令牌
        },
      }
    );

    if (res.status === 201) {
      resetNewRecord();
      await getRecords( records );
      ElMessage.success("上传记录成功!");
      reportDialogVisible.value = false;
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.error || "上传记录失败，请稍后再试")
  }
};

// 监听 Tab 切换
const handleSelect = (index) => {
  activeTab.value = index;
  if (index === "1") {
    getReports( reports );
  }
  if (index === "2") {
    getRecords( records );
  }
};

// 页面加载完成后执行
onMounted(async () => {
  await getCSRFToken(); // 获取 CSRF 令牌
  getReports( reports );
  getRecords( records );
});
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
  margin-bottom: 20px; /* 添加一些底部间距 */
  font-size: 16px; /* 字体大小 */
  color: #7f7f7f; /* 字体颜色 */
}
</style>
