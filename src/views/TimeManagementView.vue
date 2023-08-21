<template>
  <form ref="searchForm">
    <label
      for="default-search"
      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
    >
      Search
    </label>
    <div class="mt-5 relative">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <svg
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        @input="handleSearchInput"
        type="search"
        id="default-search"
        class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search Games name"
        required
      />
    </div>
    <transition name="fade">
      <ul
        v-if="visibleResults.length > 0"
        class="mt-2 border border-gray-300 rounded-lg bg-white overflow-y-auto max-h-48 shadow"
      >
        <li
          v-for="result in sortedVisibleResults"
          :key="result.id"
          class="p-3 flex items-center space-x-4 hover:bg-gray-100 cursor-pointer"
          @click="handleGameClick(result.name)"
        >
          <img
            :src="result.cover"
            alt="Game Cover"
            class="w-12 h-12 rounded-lg object-cover"
          />
          <div class="flex-1">
            <p class="text-sm font-semibold capitalize">{{ result.name }}</p>
            <p class="text-xs text-gray-600">
              Rating: {{ result.aggregated_rating }}
            </p>
          </div>
        </li>
      </ul>
    </transition>
  </form>
</template>

<script>
import gameService from "@/services/gameService";

export default {
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      visibleResults: [],
    };
  },
  computed: {
    sortedVisibleResults() {
      return this.visibleResults
        .slice()
        .sort((a, b) => b.aggregated_rating - a.aggregated_rating);
    },
  },
  methods: {
    async handleSearchInput() {
      try {
        if (this.searchQuery === "") {
          this.searchResults = [];
          this.visibleResults = [];
          return;
        }

        const games = await gameService.getGames();
        this.searchResults = games.filter((game) =>
          game.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        // Limit the visible results to a maximum of 20
        this.visibleResults = this.searchResults.slice(0, 20);
      } catch (error) {
        console.error("Error handling search input:", error);
      }
    },
    handleGameClick(gameName) {
      this.searchQuery = gameName;
      this.visibleResults = []; // Clear search results when clicking a game name
    },
    handleOutsideClick(event) {
      if (!this.$refs.searchForm.contains(event.target)) {
        this.visibleResults = [];
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
