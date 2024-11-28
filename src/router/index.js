//router/index.js
import { createWebHistory, createRouter } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import NewsPage from "@/views/NewsPage.vue";
//import NotFoundPage from '@/views/NotFoundPage.vue'
import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
import StudentPage from "@/views/dashboard/StudentPage/StudentPage.vue";
import ProfilePage from "@/views/dashboard/ProfilePage.vue";
import TeacherPage from "@/views/dashboard/TeacherPage.vue";
import { useUserStore } from "@/stores";
import { ElMessage } from "element-plus";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/news",
    name: "news",
    component: NewsPage,
  },
  {
    path: "/student",
    name: "student",
    component: StudentPage,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
  },
  {
    path: "/teacher",
    name: "teacher",
    component: TeacherPage,
  },
  // {
  //     path: '/:pathMatch(.*)*',
  //     name: 'not-found',
  //     component: NotFoundPage
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // 获取用户状态
  const identity = userStore.getIdentity; // 获取身份

  // 如果访问 /student 而身份不是 student，则重定向到 /teacher
  if (to.path === "/student" && identity != "student") {
    next("/");
    ElMessage.error("非法访问！");
  }
  // 如果访问 /teacher 而身份是 student，则重定向到 /student
  else if (to.path === "/teacher" && identity != "teacher") {
    next("/");
    ElMessage.error("非法访问！");
  }
  // 如果访问 /profile 而身份是 guest，则重定向到 /login
  else if (to.path === "/profile" && identity == "guest") {
    next("/login");
    ElMessage.error("请先登录！");
  } else {
    next(); // 继续到下一个路由
  }
});

export default router;
