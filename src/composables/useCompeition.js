// src/composables/useCompeition.js
import axios from "axios";
import { ElMessage } from "element-plus";
import { ca } from "element-plus/es/locale/index.mjs";

const URL = "http://localhost:18000/";
const BASE_URL = `${URL}dashboard/`;

export const useCompeition = () => {
  // 获取 CSRF 令牌的函数
  const getCSRFToken = async () => {
    try {
      const res = await axios.get(`${URL}csrf/`, { withCredentials: true });
      return res.data.csrftoken;
    } catch (error) {
      ElMessage.error("获取 CSRF 令牌失败");
      return null;
    }
  };
  // 获取报备记录列表
  const getReports = async (reports) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}reports/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      reports.value = res.data.data;
    } catch (error) {
      // ElMessage.error("获取报备记录列表失败!");
    }
  };

  // 获取记录列表
  const getRecords = async (records) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}records/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      records.value = res.data.data;
    } catch (error) {
      // ElMessage.error("获取记录列表失败!");
    }
  };

  // 审核通过报备
  const approveReport = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}reports/approve/`,
        { ReportID },
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      ElMessage.success("报备审核通过!");
      await getReports();
    } catch (error) {
      ElMessage.error("审核失败!");
    }
  };

  // 审核拒绝报备
  const rejectReport = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}reports/reject/`,
        { ReportID },
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      ElMessage.success("报备审核拒绝!");
      await getReports();
    } catch (error) {
      ElMessage.error("审核失败!");
    }
  };

  // 审核通过记录
  const approveRecord = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}records/approve/`,
        { ReportID },
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      ElMessage.success("记录审核通过!");
    } catch (error) {
      ElMessage.error("审核失败!");
    }
  };

  // 审核拒绝记录
  const rejectRecord = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}records/reject/`,
        { ReportID },
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      ElMessage.success("记录审核拒绝!");
    } catch (error) {
      ElMessage.error("审核失败!");
    }
  };

  // 获取比赛名
  const getCompetitionName = async (newReport, comNames) => {
    const csrftoken = await getCSRFToken();
    if (newReport.value.level === "other") {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("level", newReport.value.level); // 将数据添加到 FormData 对象中

      const res = await axios.post(
        `${BASE_URL}reports/return-competition-name/`,
        formData, // 直接传入 formData
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrftoken, // 添加 CSRF 令牌
          },
        }
      );

      comNames.value = res.data.data; // 修正路径以匹配后端返回的数据格式
    } catch (error) {
      ElMessage.error("获取比赛名失败");
    }
  };

  //查询学生
  const getStudent=async(query,students,loading)=>{
    loading.value = true; // 开始加载
    students.value = []; // 清空当前选项
    const csrftoken = await getCSRFToken();
    if(query){
      try {
        console.log(query);//调试用
        const formData = new FormData();
        formData.append("level", newReport.value.level);
        const res = await axios.post(
          `${BASE_URL}reports/return-student/`,
          formData,
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrftoken,
            },
          }
          );
        students.value = res.data.data;
      }catch (error) {
        ElMessage.error("获取学生失败");
      }finally{
          loading.value = false; // 加载完成
      }
    }
    else{
      loading.value = false;//空查询
    }
  }

  //得到所有指导教师
  const getAllInstructor=async(allInstructors)=>{
    allInstructors.value = [];
    const csrftoken = await getCSRFToken();
    try{
        console.log("getAllInstructor");//调试用
        const res = await axios.post(
          `${BASE_URL}reports/return-instructor/`,
          {},
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrftoken,
            },
          }
        );
        allInstructors.value = res.data.data;
    }catch (error) {
        ElMessage.error("获取指导教师失败");
    }
  }

  //根据输入查询指导教师
  const queryInstructor =async(query,filteredInstructors,allInstructors,instructorLoading)=>{
    instructorLoading.value = true;
    try {
      filteredInstructors.value = [];
      if (query) {
        console.log("Query:", query);
        filteredInstructors.value = allInstructors.value.filter((instructor) =>
          instructor.name.toLowerCase().includes(query.toLowerCase())
        );
      }
    } catch (error) {
      ElMessage.error("查询指导教师失败");
    } finally {
      instructorLoading.value = false; // 确保加载状态关闭
    }
  }

  // 提交报备
  const submitReport = async (newReport, reportDialogVisible) => {
    const csrftoken = await getCSRFToken();
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append("name", newReport.value.name);
    formData.append("competition_start", newReport.value.competition_start);
    formData.append("competition_end", newReport.value.competition_end);
    formData.append("level", newReport.value.level);
    formData.append("instructor", newReport.value.instructor);

    try {
      const res = await axios.post(
        `${BASE_URL}reports/create/`,
        formData, // 使用 FormData 作为请求体
        {
          withCredentials: true, // 添加 withCredentials
          headers: {
            "X-CSRFToken": csrftoken, // 添加 CSRF 令牌
          },
        }
      );
      console.log(res.data.status === "success");
      if (res.data.status === "success") {
        ElMessage.success("报备成功!");
        reportDialogVisible.value = false;
      }
    } catch (error) {
      ElMessage.error(error.response?.data?.error || "报备失败，请稍后再试");
    }
  };
  //移除报备
  const deleteReport = async (ReportID) => {
    const csrftoken = await getCSRFToken();
    const formData = new FormData();
    formData.append("ReportID", ReportID);
    try {
      const res = await axios.post(`${BASE_URL}reports/delete/`, formData, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      if (res.data.status === "success") {
        ElMessage.success("删除报备成功!");
      }
    } catch (error) {
      ElMessage.error("删除报备失败!");
    }
  };

  // 提交竞赛记录
  const submitRecord = async (newRecord, reportDialogVisible) => {
    const csrftoken = await getCSRFToken();
    console.log(newRecord.value);

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
      const res = await axios.post(`${BASE_URL}records/submit/`, formData, {
        withCredentials: true, // 添加 withCredentials
        headers: {
          "Content-Type": "multipart/form-data", // 指定内容类型为表单数据
          "X-CSRFToken": csrftoken, // 添加 CSRF 令牌
        },
      });

      if (res.status === "success") {
        ElMessage.success("上传记录成功!");
        reportDialogVisible.value = false;
      }
    } catch (error) {
      ElMessage.error(
        error.response?.data?.error || "上传记录失败，请稍后再试"
      );
    }
  };

  // 生成PDF
  const generatepdf = async (ReportID) => {
    const csrftoken = await getCSRFToken();
    const formData = new FormData();
    formData.append("ReportID", ReportID);

    fetch(`${BASE_URL}records/GeneratePDF/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        const disposition = response.headers.get("Content-Disposition");
        let filename = "default.pdf";

        if (disposition) {
          // 尝试匹配filename*格式
          const filenameStarMatch = disposition.match(/filename\*=utf-8''(.+)/);
          if (filenameStarMatch && filenameStarMatch[1]) {
            // 解码并处理 '%' 进行替换
            filename = decodeURIComponent(
              filenameStarMatch[1].replace(/\+/g, "%20")
            );
          } else {
            // 处理非编码文件名的情况
            const filenameMatch = disposition.match(
              /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, ""); // 清除引号
            }
          }
        }
        return response.blob().then((blob) => {
          return { blob, filename };
        });
      })
      .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // 使用提取的文件名
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // 释放Blob对象
        ElMessage.success("生成PDF成功!");
      })
      .catch((error) => {
        ElMessage.error("生成PDF失败!");
      });
  };

  return {
    getReports,
    getRecords,
    getCompetitionName,
    getAllInstructor,
    queryInstructor,
    getStudent,
    submitReport,
    submitRecord,
    approveReport,
    rejectReport,
    approveRecord,
    rejectRecord,
    generatepdf,
    deleteReport,
  };
};
