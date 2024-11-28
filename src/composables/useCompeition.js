// src/composables/useCompeition.js
import axios from "axios";
import { ElMessage } from "element-plus";

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
    formData.append("instructor_id", newReport.value.instructor_id);

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
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
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

  //预览PDF
  const previewpdf = async (ReportID,previewUrl) => {
    console.log("Entering previewPDF with ReportID:", ReportID);
    const csrftoken = await getCSRFToken();
    try {
      const formData = new FormData();
      formData.append("ReportID", ReportID);
  
      const response = await axios.post(`${BASE_URL}records/PreviewPDF/`, formData, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
        responseType: 'blob', // 期待后端返回 Blob 数据
      });
  
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        previewUrl.value = window.URL.createObjectURL(blob);
        ElMessage.success("PDF预览成功!");
      } else {
        throw new Error("无法预览PDF文件");
      }
    } catch (error) {
      ElMessage.error("PDF预览失败!");
      console.error("Error in previewPDF:", error);
    }
  };
  
  // 生成PDF
  const downloadpdf = async (ReportID) => {
    console.log("have enter generatepdf " + ReportID);
    const csrftoken = await getCSRFToken();
    try {
      const formData = new FormData();
      formData.append("ReportID", ReportID);
      console.log(formData);
  
      const response = await axios.post(`${BASE_URL}records/DownloadPDF/`, formData, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
        responseType: 'blob', // 指定返回的数据类型为 blob
      });
  
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Report_${ReportID}.pdf`; // 设置下载的文件名
        document.body.appendChild(link); // 将链接临时加入 DOM
        link.click(); // 触发点击事件
        document.body.removeChild(link); // 移除链接
        window.URL.revokeObjectURL(url); // 释放 URL
        ElMessage.success("PDF生成成功!");
      } else {
        throw new Error("无法生成PDF文件");
      }
    } catch (error) {
      ElMessage.error("PDF生成失败!");
      console.error(error); // 打印错误信息，便于调试
    }
  };

  // 获取团队记录列表
  const getTeams = async (teams) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(
        `${BASE_URL}teams/get_teams/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );
      teams.data = res.data.data;
      console.log(teams.data);
    } catch (error) {
      console.log(error);
      ElMessage.error(error.response?.data?.error || "获取团队列表失败!");
    }
  };

  // 提交团队记录:请求为json格式
  const submitTeam = async (newTeam, teamDialogVisible) => {
    const csrftoken = await getCSRFToken();
    console.log(newTeam);

    const membersArray = newTeam.members.map(member => member.value);

    const payload = {
      team_name: newTeam.team_name,
      leader: newTeam.leader,
      members: membersArray,
    };

    try {
      const response = await fetch(`${BASE_URL}teams/create_team/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(payload),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "创建团队失败");
      }
    
      ElMessage.success("创建团队成功!");
      teamDialogVisible.value = false;
    } catch (error) {
      ElMessage.error(error.message || "创建团队失败，请稍后再试");
    }
  };



  return {
    getReports,
    getRecords,
    getCompetitionName,
    getStudent,
    submitReport,
    submitRecord,
    approveReport,
    rejectReport,
    approveRecord,
    rejectRecord,
    downloadpdf,
    previewpdf,
    deleteReport,
    getTeams,
    submitTeam,
  };
};
