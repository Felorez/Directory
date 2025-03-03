<template>
  <div class="user-table-container">
    <div class="filters">
      <input
        v-model="filters.name"
        type="text"
        placeholder="Имя"
        class="filter-input"
      />
      <input
        v-model="filters.city"
        type="text"
        placeholder="Город"
        class="filter-input"
      />
      <button @click="fetchUsersFilters" class="filter-button">
        Поиск
      </button>
    </div>

    <table class="user-table">
      <thead>
        <tr class="table-header">
          <th class="table-cell">№</th>
          <th class="table-cell">Имя</th>
          <th class="table-cell">Город</th>
          <th class="table-cell">Возраст</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in users"
          :key="user.id"
          @click="editUser(user)"
          class="table-row"
        >
          <td class="table-cell">{{ index + 1 + (10 * (page-1)) }}</td>
          <td class="table-cell">{{ user.name }}</td>
          <td class="table-cell">{{ user.city }}</td>
          <td class="table-cell">{{ user.age }}</td>
        </tr>
      </tbody>
    </table>

    <div class="user-summary">Всего записей: {{ totalCount }}</div>

    <div class="number-input-container">
      <button @click="decrementPage" class="number-btn"><</button>
      <input 
        v-model="page"
        @keyup.enter="fetchUsers"
        @change="fetchUsers"
        type="number"
        :min="1"
        :max="Math.ceil(totalCount / store.pageSize)"
        :placeholder="page"
        class="number-input"
      />
      <button @click="incrementPage" class="number-btn">></button>
    </div>

  </div>
</template>


<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

const router = useRouter();

const store = useUserStore();

const totalCount = computed(() => store.totalCount);
const users = computed(() => store.users);
const filters = store.filters;
let page = store.page;

const fetchUsersFilters = async () => {
  store.page = 1;
  page = 1;
  console.log(store.page, page);
  await store.fetchUsers();
};

const fetchUsers = async () => {
  store.page = page;
  await store.fetchUsers();
};

const incrementPage = async () => {
  if (page < Math.ceil(totalCount.value / store.pageSize)) {
    store.page++;
    page = store.page;
    await store.fetchUsers();
  }
}

const decrementPage = async () => {
  if (page > 1) {
    store.page--;
    page = store.page;
    await store.fetchUsers();
  }
};

const editUser = (user) => {
  store.setEditingUser(user);
  router.push({ name: "UserDetail", params: { id: user.id } });
};

fetchUsers();
</script>

<style>
.user-table-container {
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-input {
  min-width: 10%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.filter-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.table-header {
  background-color: #f9f9f9;
}

.table-cell {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.table-row:hover {
  background-color: #f1f1f1;
}

.delete-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.user-summary {
  text-align: right;
  margin-top: 1rem;
  font-weight: bold;
}

.number-input-container {
  display: flex;
  align-items: center;
  border: none;
  overflow: hidden;
  width: 120px;
}

.number-input {
  text-align: center;
  width: 20%;
  border: none;
  outline: none;
  background-color: #f1f1f1;
  font-size: 16px;
}

.number-input:hover {
  cursor: pointer;
}

.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type="number"] {
  appearance: none;
  -moz-appearance: textfield; 
}

.number-btn {
  width: 25%;
  height: 100%;
  border: none;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>