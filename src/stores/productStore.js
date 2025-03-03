import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("productStore", {
  state: () => ({
    url: "https://fluffy-bugs-work.loca.lt/api/Products",
    products: [],
    currentProducts: [], 
    currentProduct: { id: null, name: "", price: null, stock: null, companyId: null },
    isEditing: false,
    search: "",
    page: 1,
    pageSize: 10,
    totalCount: null
  }),
  getters: {
    paginatedProducts: (state) => {
      const start = ((state.page - 1) * state.pageSize)%100;
      const end = start + state.pageSize;
      return state.products.slice(start, end);
    },
  },
  actions: {
    async fetchProduct(id) {
      try {
        const response = await axios.get(`${this.url}/${id}`);

        this.currentProduct = response.data;
        this.isEditing = true;
      } catch (error) {
        console.error("Ошибка при загрузке продукта:", error);
      }
    },

    async fetchProducts() {
      try {
        const params = {
            search: this.search,
            sortBy: "id",
            descending: true,
            page: Math.ceil(this.page/this.pageSize),
            pageSize: 100
        };

        console.log(params);
        
        const response = await axios.get(this.url, { params });

        console.log(response.data);

        this.products = response.data["data"];
        this.totalCount = response.data["totalCount"];
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      }
    },

    async saveAllProducts() {
      try {
        for (const product of this.currentProducts) {
          await axios.patch(`${this.url}/${product.id}`, product);
        }
        this.resetForm();
        await this.fetchProducts();
      } catch (error) {
        console.error("Ошибка при сохранении всех продуктов:", error);
      }
    },

    async saveProduct() {
      try {
        if (this.isEditing) {
          await axios.patch(`${this.url}/${this.currentProduct.id}`, this.currentProduct);
        } else {
          await axios.post(this.url, this.currentProduct);
        }
        this.resetForm();
        await this.fetchProducts();
      } catch (error) {
        console.error("Ошибка при сохранении продукта:", error);
      }
    },

    async deleteProduct(id) {
      try {
        await axios.delete(`${this.url}/${id}`);
      } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
      }
    },

    setEditingProducts(product) {
      if (!this.currentProducts.includes(this.currentProduct) && this.currentProduct.id) {
        this.currentProducts.push(this.currentProduct);
      }

      if (!this.currentProducts) {
        this.currentProducts = [];
      }
    
      const index = this.currentProducts.findIndex(p => p.id === product.id);
      if (index === -1) {
        this.currentProducts.push(product);
      } else {
        this.currentProducts.splice(index, 1);
      }

      this.isEditing = true;
    },

    setEditingProduct(product) {
      this.currentProduct = { ...product };
      this.currentProducts = [];
      this.isEditing = true;
    },

    resetForm() {
      this.currentProduct = { id: null, name: "", price: null, stock: null, companyId: null };
      this.currentProducts = [];
      this.isEditing = false;
    }
  },
});
