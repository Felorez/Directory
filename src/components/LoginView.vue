<template>
  <div class="auth-container">
    <h2 class="auth-title">Авторизация</h2>
    <div class="auth-form">
      <input v-model="email" type="email" placeholder="Email" class="auth-input" />
      <input v-model="password" type="password" placeholder="Пароль" class="auth-input" />
      <button @click="signUp" class="auth-button auth-button-primary">Регистрация</button>
      <button @click="signIn" class="auth-button auth-button-primary">Вход</button>
      <button @click="signInWithGoogle" class="auth-button auth-button-secondary">Войти с Google</button>
      <button @click="signOut" class="auth-button auth-button-danger">Выйти</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth, googleProvider, signInWithPopup } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

// Регистрация
const signUp = async () => {
    try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        alert("Регистрация успешна!");
        router.push("/products");
    } catch (error) {
        alert(error.message);
    }
};

// Вход
const signIn = async () => {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        alert("Вход выполнен!");
        router.push("/products");
    } catch (error) {
        alert(error.message);
    }
};

// Вход через Google
const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        alert("Вход через Google выполнен!");
        router.push("/products");
    } catch (error) {
        alert(error.message);
    }
};

// Выход
const signOutAccount = async () => {
    try {
        await signOut(auth);
        alert("Вы вышли из аккаунта!");
    } catch (error) {
        alert(error.message);
    }
};
</script>

<style scoped>
/* Основной контейнер */
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  padding-left: 3.5vw;
  padding-right: 3.5vw;
  padding-bottom: 3.5vw;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
}

/* Заголовок */
.auth-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

/* Форма */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Поля ввода */
.auth-input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
}

.auth-input:focus {
  border-color: #007bff;
}

/* Кнопки */
.auth-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button-primary {
  background-color: #007bff;
  color: white;
}

.auth-button-primary:hover {
  background-color: #0056b3;
}

.auth-button-secondary {
  background-color: #34a853;
  color: white;
}

.auth-button-secondary:hover {
  background-color: #238636;
}

.auth-button-danger {
  background-color: #dc3545;
  color: white;
}

.auth-button-danger:hover {
  background-color: #b02a37;
}
</style>
