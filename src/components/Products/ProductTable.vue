<template>
  <div class="product-table-container">
      <div class="filters">
          <input
              v-model="store.search"
              type="text"
              placeholder="Поиск по всем полям..."
              class="filter-input"
              @keyup.enter="fetchUsersSearch"
          />
          <button @click="fetchUsersSearch" class="filter-button">
              🔍 Найти
          </button>
      </div>

      <table class="product-table">
          <thead>
              <tr class="table-header">
                  <th class="table-cell">№</th>
                  <th class="table-cell">Название</th>
                  <th class="table-cell">Цена</th>
                  <th class="table-cell">На складе</th>
                  <th class="table-cell">Компания (ID)</th>
              </tr>
          </thead>
          <tbody>
              <tr
                  v-for="(product, index) in paginatedProducts"
                  :key="product.id"
                  @click="selectProduct(product, $event)"
                  :class="{ 'selected-row': selectedProductIds.length > 0 
                                          ? selectedProductIds.includes(product.id) 
                                          : selectedProductId === product.id }"
                  class="table-row"
              >
                  <td class="table-cell">{{ index + 1 + (10 * (page-1)) }}</td>
                  <td class="table-cell">{{ product.name }}</td>
                  <td class="table-cell">{{ product.price }}</td>
                  <td class="table-cell">{{ product.stock }}</td>
                  <td class="table-cell">{{ product.companyId }}</td>
              </tr>
          </tbody>
      </table>

      <div class="product-summary">Всего записей: {{ totalCount }}</div>

      <div class="number-input-container">
          <button @click="decrementPage" class="number-btn"><</button>
          <input 
              v-model="page"
              @keyup.enter="fetchProducts"
              @change="fetchProducts"
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
import { watch, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../../stores/productStore";

const router = useRouter();
const route = useRoute();
const store = useProductStore();

const totalCount = computed(() => store.totalCount);
const paginatedProducts = computed(() => store.paginatedProducts);
let page = store.page;

const selectedProductId = ref(null);

const selectedProductIds = ref([]);

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      selectedProductId.value = Number(newId);
      selectedProductIds.value = [Number(newId)];
    }
  },
  { immediate: true }
);

watch(paginatedProducts, () => {
  if (route.params.id) {
    selectedProductId.value = Number(route.params.id);
    selectedProductIds.value = [Number(route.params.id)];
  }
});

const fetchUsersSearch = async () => {
  store.page = 1;
  page = 1;
  await store.fetchProducts();
};

const fetchProducts = async () => {
  store.page = page;
  await store.fetchProducts();
};

const incrementPage = async () => {
if (page < Math.ceil(totalCount.value / store.pageSize)) {
  store.page++;
  page = store.page;

  if ((page-1)%10 == 0) {
    await store.fetchProducts();
  }
}
};

const decrementPage = async () => {
if (page > 1) {
  store.page--;
  page = store.page;
  if (page%10 == 0) {
    await store.fetchProducts();
  }
}
};

const selectProduct = (product, event) => {
  if (event.ctrlKey) {
    const index = selectedProductIds.value.indexOf(product.id);
    if (index === -1) {
      store.setEditingProducts(product);
      selectedProductIds.value.push(product.id);
    } else {
      store.setEditingProducts(product);
      selectedProductIds.value.splice(index, 1);
    }
  } else {
    selectedProductId.value = product.id;
    selectedProductIds.value = [product.id];
    store.setEditingProduct(product);
    router.push({ name: "ProductDetail", params: { id: product.id } });
  }
};

fetchProducts();
</script>

<style>
/* Выделение строки при клике */
.selected-row {
background-color: #d1e7ff !important; /* Светло-голубой фон */
color: #000; /* Чёрный текст */
font-weight: bold;
}

/* Основной контейнер */
.product-table-container {
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-input {
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

.product-table {
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

.product-summary {
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
