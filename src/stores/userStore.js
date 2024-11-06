import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: localStorage.getItem('username') || '',
    identity: localStorage.getItem('identity') || 'guest',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userAvatar: '',  // 用户头像（如果有）
  }),
  getters: {
    getIdentity: (state) => state.identity,
    getUsername: (state) => state.username,
  },
  actions: {
    loginUser(username, identity, userAvatar = '') {
      this.username = username;
      this.identity = identity;
      this.isLoggedIn = true;
      this.userAvatar = userAvatar; // 新增用户头像存储
      localStorage.setItem('username', username);
      localStorage.setItem('identity', identity);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userAvatar', userAvatar); // 保存头像到 localStorage
    },
    async logoutUser() {
      try {
        await axios.post('/users/logout');
        console.log('用户已登出');
      } catch (error) {
        console.error('登出失败:', error);
      } finally {
        // 清理用户状态
        this.clearUser();
      }
    },
    initializeUser() {  // 使用更具描述性的命名
      const savedUsername = localStorage.getItem('username');
      const savedIdentity = localStorage.getItem('identity');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn && savedUsername && savedIdentity) {
        this.username = savedUsername;
        this.identity = savedIdentity;
        this.isLoggedIn = true;
        this.userAvatar = localStorage.getItem('userAvatar') || ''; // 恢复用户头像
      }
    },
    clearUser() {
      this.username = '';
      this.identity = '';
      this.userAvatar = '';
      this.isLoggedIn = false;
      localStorage.removeItem('username');
      localStorage.removeItem('identity');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userAvatar'); // 清理用户头像
    },
  },
});
