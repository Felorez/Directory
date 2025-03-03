<template>
  <div class="app-container">
    <div v-if="isLoading" class="loading-container">
      <p>Загрузка...</p>
    </div>

    <nav v-if="isAuthenticated" class="navbar">
      <router-link to="/products" class="nav-button">🛒 Продукты</router-link>
      <!-- <router-link to="/users" class="nav-button">👤 Пользователи</router-link> -->
    </nav>

    <div v-if="isAuthenticated" class="content">
      <router-view />
    </div>

    <div v-else class="login-container">
      <LoginView />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginView from "@/components/LoginView.vue";

const isAuthenticated = ref(false);
const isLoading = ref(true); // Состояние загрузки

// Проверяем статус авторизации
const auth = getAuth();
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user; // true, если пользователь авторизован
    isLoading.value = false; // Сбрасываем состояние загрузки после проверки
  });
});
</script>

<style>
/* Основной контейнер */
.app-container {
  min-height: 100vh;
  background: linear-gradient(to right, #ece9e6, #ffffff);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Навигация */
.navbar {
  width: 100%;
  background: #2c3e50;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* Кнопки навигации */
.nav-button {
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  color: white;
  background: #3498db;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #2980b9;
}

/* Контент */
.content {
  width: 90%;
  max-width: 1500px;
  margin-top: 80px;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #333;
}
</style>
