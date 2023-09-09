<template>
  <div class="bg-gradient-to-r from-black to-gray-900 text-white">
    <div class="px-4 py-4 flex flex-wrap justify-between items-center">
      <div class="flex items-center">
        <router-link to="/home" class="text-2xl font-bold mr-4">
          Gamity
        </router-link>
        <!-- Add a button for mobile navigation -->
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="md:hidden text-2xl font-bold ml-4"
        >
          Menu
        </button>
        <div v-if="GStore.currentUser" class="hidden md:flex">
          <!-- Your router links go here -->
          <router-link
            v-if="GStore.currentUser && !isAdmin"
            to="/bookmark"
            class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300 ml-4"
          >
            Bookmark
          </router-link>
          <router-link
            v-if="GStore.currentUser"
            to="/upcoming"
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
          <router-link
            v-if="GStore.currentUser && !isAdmin"
            to="/time-management"
            class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300 ml-4"
          >
            Time-Management
          </router-link>
        </div>
      </div>
      <div class="flex items-center ml-4">
        <div class="relative" v-if="GStore.currentUser">
          <button
            class="bg-indigo-600 px-4 py-2 rounded uppercase text-sm font-bold"
            @click="showUserDropdown = !showUserDropdown"
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
            v-if="showUserDropdown"
            @click="showUserDropdown = false"
            class="absolute right-0 mt-2 w-36 rounded bg-white shadow-lg z-20"
          >
            <button
              @click="handleLogout"
              class="block w-full text-center px-2 py-2 text-sm font-bold text-gray-800 rounded hover:bg-gray-100"
            >
              Logout
            </button>
            <!-- Add other user-related options here -->
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile Menu (shown when screen size is small) -->
    <div v-if="showMobileMenu" class="px-4 py-2 md:hidden">
      <router-link
        v-if="GStore.currentUser && !isAdmin"
        to="/bookmark"
        class="block text-xl font-bold mb-2"
      >
        Bookmark
      </router-link>
      <router-link
        v-if="GStore.currentUser"
        to="/upcoming"
        class="block text-xl font-bold mb-2"
      >
        Upcoming
      </router-link>
      <router-link
        v-if="GStore.currentUser && isAdmin"
        to="/data-management"
        class="block text-xl font-bold mb-2"
      >
        Data-Management
      </router-link>
      <router-link
        v-if="GStore.currentUser && !isAdmin"
        to="/time-management"
        class="block text-xl font-bold mb-2"
      >
        Time-Management
      </router-link>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import * as yup from "yup";

export default {
  inject: ["GStore"],
  name: "navbar-component",
  data() {
    const schema = yup.object().shape({
      query: yup.string().required(),
    });
    return {
      schema,
      showMobileMenu: false,
      showUserDropdown: false,
      // searchQuery: "",
    };
  },
  computed: {
    isAdmin() {
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
  },
};
</script>
