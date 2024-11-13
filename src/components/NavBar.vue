<template>
  <div>
    <el-header class="NavBar">
      <el-row
        :gutter="0"
        align="middle"
        justify="space-between"
        class="full-width-row"
      >
        <!-- 左侧：logo 和标题 -->
        <el-col :span="10">
          <div class="flex-box">
            <img src="@/assets/R.png" class="custom-icon" />
            <div class="title">{{ props.title }}</div>
          </div>
        </el-col>

        <!-- 右侧：菜单或者用户操作 -->
        <el-col :span="10">
          <div class="right-box">
            <el-icon
              v-if="isMobile"
              class="menu-icon"
              @click="toggleMobileMenu"
            >
              <Menu />
            </el-icon>

            <div v-else class="desktop-menu">
              <el-button type="text" @click="goToHome" class="nav-button"
                >首页</el-button
              >
              <el-button type="text" @click="goToNews" class="nav-button"
                >新闻动态</el-button
              >
              <el-button type="text" @click="goToCompetition" class="nav-button"
                >竞赛中心</el-button
              >

              <el-button
                v-if="!isLoggedIn"
                type="text"
                class="nav-button"
                @click="goToLogin"
                >登录</el-button
              >

              <div v-else class="user-section">
                <el-avatar :src="userAvatar" size="36" />
                <el-dropdown @command="handleCommand" class="username-dropdown">
                  <span class="username" @click="toggleUserMenu">{{
                    username
                  }}</span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="profile"
                        >个人信息</el-dropdown-item
                      >
                      <el-dropdown-item command="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-drawer
        :model-value="mobileMenuVisible"
        direction="ltr"
        size="200px"
        custom-class="mobile-drawer"
      >
        <el-menu default-active="1" class="mobile-menu">
          <el-menu-item index="1" @click="goToHome">首页</el-menu-item>
          <el-menu-item index="2" @click="goToNews">新闻动态</el-menu-item>
          <el-menu-item index="3" @click="goToCompetition"
            >竞赛中心</el-menu-item
          >
          <el-menu-item v-if="!isLoggedIn" index="3" @click="goToLogin"
            >登录</el-menu-item
          >
        </el-menu>
      </el-drawer>
    </el-header>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  defineProps,
} from "vue"; // 修改：导入 watchEffect
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
import { useAuth } from "@/composables/useAuth";
import { ElMessage } from "element-plus";
import { Menu } from "@element-plus/icons-vue";
import defaultAvatar from "@/assets/default_avatar.png";

// Props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

// State management
const store = useUserStore();
const router = useRouter();
const isLoggedIn = computed(() => store.isLoggedIn);
const username = computed(() => store.username);
const userAvatar = computed(() => store.avatar || defaultAvatar);
const mobileMenuVisible = ref(false);
const isMobile = ref(window.innerWidth < 768);
const { logout } = useAuth();

// 响应式窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

// 使用 watchEffect 管理 resize 事件（修改位置）
watchEffect(() => {
  const onResize = () => handleResize();

  window.addEventListener("resize", onResize);

  // 清理事件监听器
  return () => {
    window.removeEventListener("resize", onResize);
  };
});

// 导航函数
const navigateTo = (path) => {
  router.push(path);
};

const goToLogin = () => navigateTo("/login");
const goToHome = () => navigateTo("/");
const goToNews = () => navigateTo("/news");
const goToCompetition = () => {
  if (isLoggedIn.value) {
    if (store.identity === "student") {
      navigateTo("/student");
    } else if (store.identity === "teacher") {
      navigateTo("/teacher");
    }
  } else {
    ElMessage.error("请先登录");
    navigateTo("/login");
  }
};

const handleCommand = (command) => {
  if (command === "logout") {
    logout();
  }
  if (command === "profile") {
    navigateTo("/profile");
  }
};

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

// 生命周期钩子
onMounted(() => {
  // 此处不再需要手动添加 resize 事件监听器
});

onBeforeUnmount(() => {
  // 此处不再需要手动移除 resize 事件监听器
});
</script>

<style scoped>
.NavBar {
  background-color: #0a0a0a;
  padding: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  width: 100%;
  align-items: center;
}
.full-width-row {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 6px;
  margin-right: 6px;
}

.flex-box {
  display: flex;
  align-items: center;
}
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  color: #e5eaf3;
  margin-left: 10px;
}
.right-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.desktop-menu {
  display: flex;
  align-items: center;
}
.custom-icon {
  margin-right: 10px;
  size: 24px;
  width: 30px;
  height: auto;
}
.nav-button {
  color: #ffffff;
  font-size: 18px;
  margin-right: 15px;
}
.notification-icon {
  margin-right: 15px;
  color: #ffffff;
}
.username {
  color: #ffffff;
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
}
.menu-icon {
  color: #ffffff;
  cursor: pointer;
  font-size: 24px;
}
.mobile-drawer {
  background-color: #7a8496;
  padding: 10px;
}
.mobile-menu {
  font-size: 16px;
  color: #ffffff;
}
.user-section {
  display: flex;
  align-items: center;
}
.username {
  color: #ffffff;
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
