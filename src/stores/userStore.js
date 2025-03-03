import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    url: "https://fluffy-bugs-work.loca.lt/api/User",
    users: [],
    currentUser: { id: null, name: "", city: "", age: null },
    isEditing: false,
    filters: {
      name: "",
      city: "",
      minAge: null,
      maxAge: null,
      sortBy: "id",
      descending: true
    },
    page: 1,
    pageSize: 10,
    totalCount: null
  }),
  actions: {
    async fetchUser(id) {
      try {
        const response = await axios.get(`${this.url}/${id}`);

        this.currentUser = response.data;
        this.isEditing = true;
      } catch (error) {
        console.error("Ошибка:", error);
      }
    },

    async fetchUsers() {
      try {
        const params = {};
        if (this.filters.name) params.name = this.filters.name;
        if (this.filters.city) params.city = this.filters.city;
        if (this.filters.minAge) params.minAge = this.filters.minAge;
        if (this.filters.maxAge) params.maxAge = this.filters.maxAge;
        if (this.filters.sortBy) params.sortBy = this.filters.sortBy;
        if (this.filters.descending) params.descending = this.filters.descending;
        if (this.page) params.page = this.page;
        if (this.pageSize) params.pageSize = this.pageSize;
        
        const response = await axios.get(this.url, { params });

        console.log(response.data);

        this.users = response.data["data"];
        this.totalCount = response.data["totalCount"];
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
      }
    },
    async saveUser() {
      try {
        if (this.isEditing) {
          await axios.put(
            `${this.url}/${this.currentUser.id}`,
            this.currentUser
          );
        } else {
          await axios.post(this.url, this.currentUser);
        }
        this.resetForm();
        await this.fetchUsers();
      } catch (error) {
        console.error("Ошибка при сохранении пользователя:", error);
      }
    },
    async deleteUser(id) {
      try {
        await axios.delete(`${this.url}/${id}`);
        await this.fetchUsers();
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
      }
    },
    setEditingUser(user) {
      this.currentUser = { ...user }; 
      this.isEditing = true;
    },
    resetForm() {
      this.currentUser = { id: null, name: "", city: "", age: null };
      this.isEditing = false;
    },    
  },
});
