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
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'default.pdf'; 

      if (disposition) {
          // 尝试匹配filename*格式
          const filenameStarMatch = disposition.match(/filename\*=utf-8''(.+)/);
          if (filenameStarMatch && filenameStarMatch[1]) {
              // 解码并处理 '%' 进行替换
              filename = decodeURIComponent(filenameStarMatch[1].replace(/\+/g, '%20'));
          } else {
              // 处理非编码文件名的情况
              const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (filenameMatch && filenameMatch[1]) {
                  filename = filenameMatch[1].replace(/['"]/g, ''); // 清除引号
              }
          }
      }
      return response.blob().then(blob => {
          return { blob, filename };
      });
  })
  .then(({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // 使用提取的文件名
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