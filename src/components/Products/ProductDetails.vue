<template>
  <div class="form">
      <h2 class="form-title">
        {{ isEditing ? "Редактировать продукт" : "Добавить продукт" }}
      </h2>
      <div class="form-buttons">
        <button
          v-if="computedProducts.length > 1"
          @click="saveAllProducts"
          class="form-button save-button"
        >
          Сохранить все
        </button>
        <button
          v-if="computedProducts.length > 1"
          @click="deleteAllProducts"
          class="form-button delete-button"
        >
          Удалить все
        </button>
        <button
          v-if="isEditing && computedProducts.length > 1"
          @click="cancelEditing"
          class="form-button cancel-button"
        >
          Отменить
        </button>
      </div>
      <div class="form-wrapper">
        <div 
          v-for="(product, index) in computedProducts"
          :class="['form-container', { 'highlighted-product': index === 0 }]"
          >
          <div class="form-fields">
            <div class="form-field">
              <label class="form-label">Название</label>
              <input v-model="product.name" type="text" class="form-input" />
            </div>
            <div class="form-field">
              <label class="form-label">Цена</label>
              <input v-model="product.price" type="number" class="form-input" />
            </div>
            <div class="form-field">
              <label class="form-label">На складе</label>
              <input v-model="product.stock" type="number" class="form-input" />
            </div>
            <div class="form-field">
              <label class="form-label">ID компании</label>
              <input v-model="product.companyId" type="number" class="form-input" />
            </div>
            <div class="form-buttons">
              <button
                v-if="currentProducts.length <= 1"
                :disabled="!(product.name && product.price && product.stock && product.companyId)"
                @click="saveProduct"
                class="form-button save-button"
              >
                {{ isEditing ? "Сохранить изменения" : "Добавить" }}
              </button>
              <button
                v-if="isEditing && computedProducts.length <= 1"
                @click="cancelEditing"
                class="form-button cancel-button"
              >
                Отменить
              </button>
              <button
                v-if="isEditing  && computedProducts.length <= 1"
                @click="deleteProduct(currentProduct.id)"
                class="form-button delete-button"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
  import { watch, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useProductStore } from "../../stores/productStore";
  
  const store = useProductStore();
  const route = useRoute();
  const router = useRouter();
  const currentProducts = computed(() => store.currentProducts);
  const currentProduct = computed(() => store.currentProduct);
  const isEditing = computed(() => store.isEditing);

  const computedProducts = computed(() => {
    return currentProducts.value.length > 0 ? [...currentProducts.value] : [currentProduct.value];
  });
  
  watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        await store.fetchProduct(newId);
      }
    },
    { immediate: true }
  );

  watch(
  () => computedProducts.value[0]?.name, // Следим за изменением `name`
  (newValue) => {
    if (newValue !== undefined) {
      for (let i = 1; i < computedProducts.value.length; i++) {
        computedProducts.value[i].name = newValue;
      }
    }
  }
  );

  watch(
    () => computedProducts.value[0]?.price, // Следим за `price`
    (newValue) => {
      if (newValue !== undefined) {
        for (let i = 1; i < computedProducts.value.length; i++) {
          computedProducts.value[i].price = newValue;
        }
      }
    }
  );

  watch(
    () => computedProducts.value[0]?.stock, // Следим за `stock`
    (newValue) => {
      if (newValue !== undefined) {
        for (let i = 1; i < computedProducts.value.length; i++) {
          computedProducts.value[i].stock = newValue;
        }
      }
    }
  );

  watch(
    () => computedProducts.value[0]?.companyId, // Следим за `companyId`
    (newValue) => {
      if (newValue !== undefined) {
        for (let i = 1; i < computedProducts.value.length; i++) {
          computedProducts.value[i].companyId = newValue;
        }
      }
    }
  );
  
  const fetchProducts = async () => {
    await store.fetchProducts();
  };
  
  const saveAllProducts = async () => {
    await store.saveAllProducts();
    store.resetForm();
    router.push("/products");
  };

  const deleteAllProducts = async () => {
    if (!confirm("Вы уверены, что хотите удалить все выбранные продукты?")) return;

    for (const product of computedProducts.value) {
      await store.deleteProduct(product.id);
    }
    
    await fetchProducts();
    store.resetForm();
    router.push("/products");
  };

  const saveProduct = async () => {
    await store.saveProduct();
    store.resetForm();
    router.push("/products");
  };
  
  const deleteProduct = async (id) => {
    await store.deleteProduct(id);
    await fetchProducts();
    store.resetForm();
    router.push("/products");
  };
  
  const cancelEditing = () => {
    store.resetForm();
    router.push("/products");
  };
</script>
  
<style>
.form {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.form-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px; 
  padding: 10px;
  box-sizing: border-box;
}

.form-container {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  box-sizing: border-box;
}
.form-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #343a40;
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
  gap: 10px;
  margin-bottom: 15px;
}

.form-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
} 

.save-button {
  background-color: #28a745;
  color: white;
}

.cancel-button {
    background-color: #ffc107;
    color: white;
}

.delete-button {
    background-color: #dc3545;
    color: white;
}

.save-button:disabled {
  background-color: #d3d3d3;
  color: #9e9e9e;
  cursor: not-allowed;
}

.highlighted-product {
  background: linear-gradient(90deg, rgba(0, 123, 255, 0.1) 0%, #f2f2f2 75%);
  border: none;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease, border 0.3s ease;
}

</style>
  