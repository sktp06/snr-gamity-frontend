<template>
  <div class="bg-gradient-to-r from-black to-gray-900 text-white">
    <div
      class="container mx-auto px-6 py-4 flex flex-wrap justify-between items-center"
    >
      <div class="flex items-center">
        <router-link to="/home" class="text-2xl font-bold mr-4">
          Gamity
        </router-link>
        <router-link
          v-if="GStore.currentUser && !isAdmin"
          to="/bookmark"
          class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300 ml-4"
        >
          Bookmark
        </router-link>
        <router-link
          v-if="GStore.currentUser"
          to="/upcoming-game"
          class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300 ml-4"
        >
          Upcoming
        </router-link>
        <router-link
          v-if="GStore.currentUser && isAdmin"
          to="/data-management"
          class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300 ml-4"
        >
          Data-Management
        </router-link>
      </div>
      <div v-if="GStore.currentUser" class="flex items-center ml-4">
        <!-- <Form @submit="onSearch" :validation-schema="schema" class="flex">
          <Field
            class="px-4 py-2 mr-2 rounded-l-lg"
            type="text"
            name="query"
            v-model="searchQuery"
            placeholder="Search..."
          />
          <button class="bg-indigo-600 px-4 py-2 rounded-r-lg" type="submit">
            <svg
              class="w-6 h-6 text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
              />
            </svg>
          </button>
        </Form> -->
        <div class="ml-4 relative">
          <button
            class="bg-indigo-600 px-4 py-2 rounded uppercase text-sm font-bold"
            @click="showMenu = !showMenu"
          >
            {{ GStore.currentUser && GStore.currentUser.username }}
            <svg
              class="w-4 h-4 text-white inline-block ml-1"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-36 rounded bg-white shadow-lg z-20"
          >
            <button
              @click="handleLogout"
              class="block w-full text-center px-2 py-2 text-sm font-bold text-gray-800 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import SearchService from "@/services/SearchService.js";
import SpellService from "@/services/SpellService.js";
// import { Form, Field } from "vee-validate";
import * as yup from "yup";

export default {
  inject: ["GStore"],
  name: "navbar-component",
  components: {
    // Form,
    // Field,
  },
  data() {
    const schema = yup.object().shape({
      query: yup.string().required(),
    });
    return {
      schema,
      showMenu: false,
      searchQuery: "",
    };
  },
  computed: {
    isAdmin() {
      // Assuming your user object has a "role" property indicating the user's role
      return (
        this.GStore.currentUser && this.GStore.currentUser.role === "admin"
      );
    },
  },
  methods: {
    handleLogout() {
      AuthService.logout();
      this.$router.push("/login");
    },
    onSearch() {
      const query = this.searchQuery; // Use the updated searchQuery property

      SpellService.correction(query)
        .then((res) => {
          if (query !== res.data) {
            alert("Maybe you mean: " + res.data);
            return SearchService.search(res.data);
          } else {
            return SearchService.search(query);
          }
        })
        .then(() => {
          this.$router.push("/game-card");
        });
    },
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}

.container {
  flex-wrap: nowrap;
}
</style>
