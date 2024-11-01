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
        console.error('获取 CSRF 令牌失败：', error);
        ElMessage.error('获取 CSRF 令牌失败');
        return null;
    }
  };  
  // 获取报备记录列表
  const getReports = async ( reports ) => {
    try {
        const csrftoken = await getCSRFToken();
        const res = await axios.post(`${BASE_URL}reports/`, {},{
          headers: {
            'X-CSRFToken': csrftoken,
          },
          withCredentials: true,
        });
        reports.value = res.data.data;
    } catch (error) {
      // ElMessage.error("获取报备记录列表失败!");
    }
  };
  
  // 获取记录列表
  const getRecords = async ( records ) => {
    try {
        const csrftoken = await getCSRFToken();
        const res = await axios.post(`${BASE_URL}records/`, {},{
          headers: {
            'X-CSRFToken': csrftoken,
          },
          withCredentials: true,
        });
        records.value = res.data.data;
    } catch (error) {
      // ElMessage.error("获取记录列表失败!");
    }
  };
  
  // 审核通过报备
  const approveReport = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
          const res = await axios.post(`${BASE_URL}reports/approve/`, 
            { ReportID },
            {
            headers: {
              'X-CSRFToken': csrftoken,
            },
            withCredentials: true,
          });
        ElMessage.success("报备审核通过!");
        await getReports();
    } catch (error) {
      ElMessage.error("审核失败!");
      console.error(error);
    }
  };
  
  // 审核拒绝报备
  const rejectReport = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
          const res = await axios.post(`${BASE_URL}reports/reject/`, 
            { ReportID },
            {
            headers: {
              'X-CSRFToken': csrftoken,
            },
            withCredentials: true,
          });
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
          const res = await axios.post(`${BASE_URL}records/approve/`, 
            { ReportID },
            {
            headers: {
              'X-CSRFToken': csrftoken,
            },
            withCredentials: true,
          });
      ElMessage.success("记录审核通过!");
      await getRecords();
    } catch (error) {
      ElMessage.error("审核失败!");
    }
  };
  
  // 审核拒绝记录
  const rejectRecord = async (ReportID) => {
    try {
      const csrftoken = await getCSRFToken();
      const res = await axios.post(`${BASE_URL}records/reject/`, 
        { ReportID },
        {
        headers: {
          'X-CSRFToken': csrftoken,
        },
        withCredentials: true,
      });
      ElMessage.success("记录审核拒绝!");
      await getRecords();
    } catch (error) {
      ElMessage.error("审核失败!");
    }
  };

  // 生成PDF
  const generatepdf = async (ReportID) => {
    const csrftoken = await getCSRFToken();
    const formData = new FormData();
    formData.append('ReportID', ReportID);

    fetch(`${BASE_URL}records/GeneratePDF/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
        },
        body: formData,
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response.blob(); // 将响应转为Blob对象
        }
        throw new Error('生成PDF失败!');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hello.pdf'; // 指定下载文件名
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // 释放Blob对象
        ElMessage.success("生成PDF成功!");
    })
    .catch(error => {
        ElMessage.error("生成PDF失败!");
    });
};


  return {
    getReports,
    getRecords,
    approveReport,
    rejectReport,
    approveRecord,
    rejectRecord,
    generatepdf,
  };
};