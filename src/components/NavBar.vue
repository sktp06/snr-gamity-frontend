<template>
  <div class="bg-gradient-to-r from-black to-gray-900 text-white">
    <div class="px-4 py-4 flex flex-wrap justify-between items-center">
      <div class="flex items-center">
        <div style="display: flex; align-items: center">
          <router-link
            to="/home"
            class="flex items-center transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white text-2xl font-bold ml-2"
          >
            <img
              src="../assets/logo_nobg.png"
              alt="logo"
              class="h-10 w-9 mr-2"
            />
          </router-link>
        </div>
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
            class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
          >
            Bookmark
          </router-link>
          <router-link
            v-if="GStore.currentUser"
            to="/upcoming"
            class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
          >
            Upcoming
          </router-link>
          <router-link
            v-if="GStore.currentUser && isAdmin"
            to="/data-management"
            class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
          >
            Data-Management
          </router-link>
          <router-link
            v-if="GStore.currentUser && !isAdmin"
            to="/time-management"
            class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
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
    <div class="relative">
      <input
        v-model="query"
        @input="onSearch(query)"
        type="text"
        placeholder="Search..."
        class="px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:shadow-outline w-40"
      />
      <button
        @click="onSearch(query)"
        class="absolute right-0 top-0 mt-2 mr-2 text-white hover:text-indigo-400"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M22 22l-6-6"></path>
          <circle cx="10.5" cy="10.5" r="7.5"></circle>
        </svg>
      </button>
    </div>
    <!-- Display game titles -->
    <div
      v-if="
        GStore.searchGameList &&
        GStore.searchGameList.content &&
        GStore.searchGameList.content.length > 0
      "
    >
      <h2>Search Results</h2>
      <ul>
        <li v-for="game in GStore.searchGameList.content" :key="game.id">
          {{ game.name }}
        </li>
      </ul>
    </div>
    <!-- Mobile Menu (shown when screen size is small) -->
    <div v-if="showMobileMenu" class="px-4 py-2 md:hidden">
      <router-link
        v-if="GStore.currentUser && !isAdmin"
        to="/bookmark"
        class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white uppercase font-bold ml-4"
      >
        Bookmark
      </router-link>
      <router-link
        v-if="GStore.currentUser"
        to="/upcoming"
        class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white uppercase font-bold ml-4"
      >
        Upcoming
      </router-link>
      <router-link
        v-if="GStore.currentUser && isAdmin"
        to="/data-management"
        class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white uppercase font-bold ml-4"
      >
        Data-Management
      </router-link>
      <router-link
        v-if="GStore.currentUser && !isAdmin"
        to="/time-management"
        class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white uppercase font-bold ml-4"
      >
        Time-Management
      </router-link>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import * as yup from "yup";
import SearchService from "@/services/SearchService";

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
      query: "",
      searchResults: null,
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
    onSearch(query) {
      SearchService.search(query)
        .then((results) => {
          // Initialize GStore.searchGameList if it's undefined
          if (!this.GStore.searchGameList) {
            this.GStore.searchGameList = {
              content: [],
            };
          }
          this.GStore.searchGameList.content = results.content;
          console.log("Search results:", results);
        })
        .catch(() => {
          // console.error("Error searching for games:", error);
          // alert("Something went wrong!");
        });
    },
  },
};
</script>
