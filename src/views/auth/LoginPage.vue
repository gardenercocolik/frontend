<template>
    <NavBar title="网络安全实验中心 - 首页"/>
    <div class="background">
        <el-form :model="form" label-width="auto" style="max-width: 600px" class="login-form">
            <h2>登录</h2>
            <el-form-item class="form-item">
                <label>用户名：</label>
                <el-input v-model="form.username" placeholder="请输入用户名" class="input-field" show-word-limit maxlength="16"></el-input>
                <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
            </el-form-item>

            <el-form-item class="form-item">
                <label>密码：</label>
                <el-input type="password" v-model="form.password" class="input-field" placeholder="请输入密码" show-password show-word-limit maxlength="20"></el-input>
                <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
            </el-form-item>

            <el-form-item class="form-item">
                <label>身份：</label>
                <el-radio-group v-model="form.identity">
                    <el-radio :value="'student'">学生</el-radio>
                    <el-radio :value="'teacher'">老师</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item style="display: flex; justify-content: center; align-items: center;">
                <el-button :loading="loading" type="primary" @click="HandleLogin">登录</el-button>
            </el-form-item>
            
            <el-form-item style="display: flex; justify-content: center; align-items: center; margin-left: 100px;">
                <router-link class="register-link" to="/register">没有账号？点击注册-></router-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { useAuth } from '@/composables/useAuth';

const form = ref({
    username: '',
    password: '',
    identity: 'student',
});

// 定义错误信息
const errors = ref({
    username: '',
    password: '',
});

const loading = ref(false);
const router = useRouter();
const { login } = useAuth();

const HandleLogin = async () => {
    loading.value = true;
    const success = await login(form.value);
    loading.value = false;
};
</script>




<style scoped>
.background {
  width: 100%;
  background-image: url("../../assets/HomePage.jpg");
  height: 100%;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  filter: brightness(0.7);
}

.login-form {
  max-width: 600px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  border-radius: 20px;
}

h2 {
  text-align: center;
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.form-item {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: flex-start; /* 水平左对齐 */
    margin-bottom: 20px; /* 增加各项之间的间距 */
}

.form-item label {
    width: 80px; /* 设置一个固定宽度以确保左对齐 */
    margin-right: 10px; /* 标签与输入框之间的间距 */
    text-align: right; 
    color: #ffffff;
}

.input-field {
    flex: 1;
    max-width: 240px;
}

.error-message {
    color: #ff5c5c;
    font-size: 12px;
    margin-top: 5px;
}

.el-button {
    background: rgba(30, 144, 255, 0.8);
    border: none;
    color: white;
    border-radius: 10px;
    height: 40px; /* 按钮高度 */
    flex: 1; /* 按钮均分宽度 */
    margin: 0 5px; /* 按钮间距 */
}

.el-button:hover {
    background: rgba(30, 144, 255, 1);
}

.el-button:nth-child(2) {
    background: transparent;
    color: rgba(30, 144, 255, 0.8);
    border: 1px solid rgba(30, 144, 255, 0.8);
}

.register-link {
    color: white; 
}

.register-link:hover {
    color: yellow; 
}
</style>
