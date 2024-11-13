// src/composables/useInfo.js
import axios from "axios";
import { ElMessage } from "element-plus";

const BASE_URL = "http://localhost:18000/";
const API_URL = `${BASE_URL}dashboard/`;

export const useInfo = () => {
  // 获取 CSRF 令牌的函数
  const getCSRFToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}csrf/`, {
        withCredentials: true,
      });
      return res.data.csrftoken;
    } catch (error) {
      ElMessage.error("获取 CSRF 令牌失败");
      console.error("获取 CSRF 令牌失败：", error);
      return null; // 返回 null 以便在调用时进行判断
    }
  };

  // 获取用户信息
  const fetchUserInfo = async (userData, form, defaultAvatarUrl) => {
    const token = await getCSRFToken();
    if (!token) return;

    try {
      const res = await axios.post(
        `${API_URL}userinfo/`,
        {},
        {
          headers: { "X-CSRFToken": token },
          withCredentials: true,
        }
      );
      if (res.data) {
        const {
          username,
          avatar,
          first_name,
          last_name,
          userId,
          phone,
          email,
        } = res.data.data;
        userData.value = {
          username,
          avatar: avatar || defaultAvatarUrl,
          first_name,
          last_name,
          userId,
          phone,
          email,
        };
        Object.assign(form.value, userData.value); // 更新表单数据
        console.log("用户信息更新成功:", userData.value);
      }
    } catch (error) {
      ElMessage.error("获取用户信息失败");
      console.error("获取用户信息失败:", error);
    }
  };

  // 提交用户信息表单
  const updateUserInfo = async (form) => {
    const token = await getCSRFToken();
    if (!token) return;

    const formData = new URLSearchParams();
    Object.keys(form.value).forEach((key) => {
      formData.append(key, form.value[key]);
    });

    try {
      const res = await axios.post(`${API_URL}userinfo/update/`, formData, {
        headers: { "X-CSRFToken": token },
        withCredentials: true,
      });
      console.log("用户信息更新结果:", res.data.code);
      if (res.data.code === 201) {
        ElMessage.success("信息更新成功");
      }
    } catch (error) {
      ElMessage.error(error.response.data.error);
      console.error("信息更新失败:", error);
    }
  };

  return {
    fetchUserInfo,
    updateUserInfo,
  };
};
