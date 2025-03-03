import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProductView from '@/components/views/ProductView.vue';
// import UserView from '@/components/views/UsersView.vue';
import LoginView from '@/components/LoginView.vue';

const routes = [
  {
    path: "/products",
    name: "Products",
    component: ProductView,
    meta: { requiresAuth: true },
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: ProductView,
    props: true,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/users",
  //   name: "Users",
  //   component: UserView,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   path: "/users/:id",
  //   name: "UserDetail",
  //   component: UserView,
  //   props: true,
  //   meta: { requiresAuth: true },
  // },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

// Создаём маршрутизатор
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard для проверки авторизации
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Если пользователь авторизован и пытается зайти на "/login", перенаправляем на "/products"
      if (to.path === "/login") {
        next("/products");
      } else {
        next(); // Продолжаем, если маршрут требует авторизацию
      }
    } else {
      // Если пользователь не авторизован
      if (requiresAuth) {
        // Если маршрут требует авторизацию, перенаправляем на "/login"
        next("/login");
      } else {
        // Если авторизация не требуется, продолжаем
        next();
      }
    }
  });
});

export default router;
