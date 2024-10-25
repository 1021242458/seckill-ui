<template>
  <div class="auth-form">
    <h2>{{ isLogin ? '登录' : '注册' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="form.username" required />
      </div>
      <div>
        <label for="password">密码</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
    </form>
    <p @click="toggleAuthMode">
      {{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
    </p>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AuthForm',
  setup() {
    const isLogin = ref(true);
    const form = ref({
      username: '',
      password: ''
    });

    const handleSubmit = async () => {
      const url = isLogin.value
        ? 'http://localhost:8080/user/login'
        : 'http://localhost:8080/user/register';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // 更新为 x-www-form-urlencoded
          },
          body: new URLSearchParams({
            username: form.value.username,
            password: form.value.password
          }).toString() // 使用 URLSearchParams 来构建请求体
        });

        const data = await response.json();

        // 根据服务器返回的 code 字段判断
        if (data.code === 0) {
          alert(isLogin.value ? '登录成功！' : '注册成功！');
          console.log(data.data); // 成功时返回的数据
        } else {
          alert(data.message || '操作失败');
        }
      } catch (error) {
        console.error('请求失败：', error);
        alert('网络错误，请稍后再试');
      }
    };

    const toggleAuthMode = () => {
      isLogin.value = !isLogin.value;
      form.value.username = '';
      form.value.password = '';
    };

    return {
      isLogin,
      form,
      handleSubmit,
      toggleAuthMode
    };
  }
};
</script>

<style scoped>
.auth-form {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.auth-form h2 {
  text-align: center;
}

.auth-form form div {
  margin-bottom: 15px;
}

.auth-form label {
  display: block;
  font-weight: bold;
}

.auth-form input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}

.auth-form button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.auth-form p {
  text-align: center;
  cursor: pointer;
  color: #42b983;
  margin-top: 10px;
}
</style>
