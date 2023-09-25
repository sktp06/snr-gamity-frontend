<template>
  <div class="navbar-wrapper" :class="{ 'navbar-fixed': isNavbarFixed }">
    <div class="bg-gradient-to-r from-black to-gray-900">
      <div
        class="px-4 py-4 flex flex-wrap justify-between items-center"
        v-if="shouldShowNavBar"
      >
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
            class="md:hidden text-2xl-white font-bold ml-4 text-white"
          >
            Menu
          </button>
          <div v-if="GStore.currentUser" class="hidden md:flex">
            <router-link
              v-if="GStore.currentUser && !isAdmin"
              to="/bookmark"
              :class="{ 'active-link': $route.path === '/bookmark' }"
              class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
            >
              Bookmark
            </router-link>
            <router-link
              v-if="GStore.currentUser"
              to="/upcoming"
              :class="{ 'active-link': $route.path === '/upcoming' }"
              class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
            >
              Upcoming
            </router-link>
            <router-link
              v-if="GStore.currentUser && isAdmin"
              to="/data-management"
              :class="{ 'active-link': $route.path === '/data-management' }"
              class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
            >
              Data-Management
            </router-link>
            <router-link
              v-if="GStore.currentUser && !isAdmin"
              to="/time-management"
              :class="{ 'active-link': $route.path === '/time-management' }"
              class="transform transition-all duration-300 hover:text-indigo-400 hover:-translate-y-0.5 focus:-translate-y-0.5 text-white ml-4 font-bold text-lg"
            >
              Time-Management
            </router-link>
          </div>
        </div>
        <div class="relative">
          <input
            v-model="query"
            @input="onSearch(query)"
            type="text"
            placeholder="Search..."
            class="px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:shadow-outline w-full md:w-60 sm:w-30"
          />
          <!-- Render search or clear button based on the query -->
          <button
            v-if="query === ''"
            @click="onSearch(query)"
            class="absolute right-0 top-0 mt-2 mr-2 text-white hover:text-indigo-400"
          >
            <!-- Search SVG -->
            <svg
              class="w-5 h-5"
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
          <button
            v-else
            @click="clearQuery"
            class="absolute right-0 top-0 mt-2 mr-2 text-white hover:text-red-400"
          >
            <!-- Clear SVG -->
            <svg
              class="w-5 h-5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="flex items-center ml-4">
          <div class="relative" v-if="GStore.currentUser">
            <button
              class="bg-indigo-600 px-4 py-2 rounded uppercase text-sm font-bold text-white"
              @click="showUserDropdown = !showUserDropdown"
            >
              {{ GStore.currentUser && GStore.currentUser.username }}
              <svg
                class="w-4 h-4 text-orange-400 inline-block ml-1"
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
            </div>
          </div>
        </div>
      </div>
      <!-- Display game covers in a grid -->
      <transition name="fade" mode="out-in">
        <div
          v-if="
            GStore.searchGameList &&
            GStore.searchGameList.content &&
            GStore.searchGameList.content.length > 0
          "
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4"
          style="max-height: 75vh; overflow-y: auto"
        >
          <div v-for="game in GStore.searchGameList.content" :key="game.id">
            <!-- Add a click event handler to the game image -->
            <img
              :src="game.cover"
              :alt="game.name"
              class="w-full h-auto"
              @click="showGameDetail(game)"
              style="cursor: pointer"
            />
          </div>
        </div>
      </transition>
      <!-- Display game details modal for bookmarked games -->
      <div
        v-if="selectedGame"
        class="game-popup"
        :class="{ 'show-popup': selectedGame }"
      >
        <div v-if="selectedGame" class="overlay" @click="hideGameDetail"></div>
        <GameDetail :game="selectedGame" @close="hideGameDetail" />
        <button @click="hideGameDetail"></button>
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
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import * as yup from "yup";
import SearchService from "@/services/SearchService";

import GameDetail from "@/components/GameDetail.vue";

export default {
  components: {
    GameDetail,
  },
  inject: ["GStore"],
  name: "navbar-component",
  data() {
    const schema = yup.object().shape({
      query: yup.string().required(),
    });
    return {
      isNavbarFixed: false,
      schema,
      showMobileMenu: false,
      showUserDropdown: false,
      query: "",
      searchResults: null,
      selectedGame: null,
    };
  },
  computed: {
    shouldShowNavBar() {
      // Check if the current route is LoginView or SignupView
      return !["login", "sign-up"].includes(this.$route.name);
    },
    isAdmin() {
      return (
        this.GStore.currentUser && this.GStore.currentUser.role === "admin"
      );
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },

  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleLogout() {
      AuthService.logout();
      this.$router.push("/login");
    },

    handleScroll() {
      // Get the scroll position
      const scrollY = window.scrollY || window.pageYOffset;

      // Determine whether to add/remove the 'navbar-fixed' class based on the scroll position
      if (scrollY > 0) {
        this.isNavbarFixed = true;
        // You can change the colors as needed
      } else {
        this.isNavbarFixed = false;
        // Reset to initial styles when not scrolled
      }

      // Check if the user is on the home page and has scrolled
      if (this.$route.name === "home" && scrollY > 0) {
        // Clear search results and search input
        this.query = ""; // Clear the input field
        this.GStore.searchGameList.content = []; // Clear the search results
      }
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
        .catch(() => {});
    },
    clearQuery() {
      this.query = "";
      this.GStore.searchGameList.content = [];
    },
    showGameDetail(game) {
      this.selectedGame = game;
      this.disableScroll();
    },
    hideGameDetail() {
      this.selectedGame = null;
      this.enableScroll();
    },
    disableScroll() {
      document.body.style.overflow = "hidden";
    },
    enableScroll() {
      document.body.style.overflow = "";
    },
  },
};
</script>
<style scoped>
.active-link {
  color: rgb(103, 49, 143);
}
.navbar-wrapper.navbar-fixed {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000; /* You can adjust the z-index as needed */
  /* Add any other styles you want for the fixed navbar */
  /* Example: background-color, padding, box-shadow, etc. */
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
