<template>
  <div class="form-container">
    <h2 class="form-title">
      {{ isEditing ? "Редактировать пользователя" : "Добавить пользователя" }}
    </h2>
    <div class="form-fields">
      <div class="form-field">
        <label class="form-label">Имя</label>
        <input v-model="currentUser.name" type="text" class="form-input" />
      </div>
      <div class="form-field">
        <label class="form-label">Город</label>
        <input v-model="currentUser.city" type="text" class="form-input" />
      </div>
      <div class="form-field">
        <label class="form-label">Возраст</label>
        <input v-model="currentUser.age" type="number" class="form-input" />
      </div>
      <div class="form-buttons">
        <button
          :disabled="!(currentUser.name && currentUser.city && currentUser.age)"
          @click="saveUser"
          class="form-button save-button"
        >
          {{ isEditing ? "Сохранить изменения" : "Добавить" }}
        </button>
        <button
          v-if="isEditing"
          @click="cancelEditing"
          class="form-button cancel-button"
        >
          Отменить
        </button>
        <button
          v-if="isEditing"
          @click="deleteUser(currentUser.id)"
          class="form-button cancel-button"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

const store = useUserStore();
const route = useRoute();
const router = useRouter();

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await store.fetchUser(newId);
  }
}, { immediate: true });

const fetchUsers = async () => {
  await store.fetchUsers();
};

const saveUser = async () => {
  await store.saveUser();
  store.resetForm();
  router.push("/users");
};

const deleteUser = async (id) => {
  await store.deleteUser(id);
  await fetchUsers();
  store.resetForm();
  router.push("/users");
};

const cancelEditing = () => {
  store.resetForm();
  router.push("/users");
};

const currentUser = computed(() => store.currentUser);
const isEditing = computed(() => store.isEditing); 
</script>

<style>
.form-container {
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  gap: 1rem;
}

.form-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.save-button:disabled {
  background-color: #d3d3d3;
  color: #9e9e9e;
  cursor: not-allowed;
}

</style>