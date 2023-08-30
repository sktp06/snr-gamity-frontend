<template>
  <div class="bg-zinc-900 min-h-screen">
    <form ref="searchForm">
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-black"
      >
        Search
      </label>
      <div class="relative">
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
          @focus="handleInputFocus"
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
    <div v-if="selectedGame" class="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 class="text-lg font-semibold capitalize">{{ selectedGame.name }}</h3>
      <p>Main Story: {{ selectedGame.main_story }}</p>
      <p>Main Extra: {{ selectedGame.main_extra }}</p>
      <p>Completionist: {{ selectedGame.completionist }}</p>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700"
          >Select Game Mode</label
        >
        <select v-model="selectedGameMode" class="mt-1 block w-full rounded-md">
          <option value="mainStory">
            Main Story : {{ selectedGame.main_story }} hr
          </option>
          <option value="mainExtra">
            Main Extra : {{ selectedGame.main_extra }} hr
          </option>
          <option value="completionist">
            Completionist : {{ selectedGame.completionist }} hr
          </option>
        </select>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700"
          >Select Time Range</label
        >
        <VueDatePicker
          v-model="date"
          range
          :minDate="new Date()"
          :enable-time-picker="false"
        />
      </div>
      <div>
        <button @click="openCalendar" type="button">Confirm</button>
      </div>
    </div>
    <div v-if="showCalendar">
      <CalendarPreview :show="showCalendar" @close="closeCalendar" />
    </div>
  </div>
</template>

<script>
import gameService from "@/services/gameService";
import VueDatePicker from "@vuepic/vue-datepicker";
import CalendarPreview from "@/components/CalendarPreview.vue";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: { VueDatePicker, CalendarPreview },
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      visibleResults: [],
      selectedGame: null,
      selectedGameMode: "mainStory",
      date: null,
      showCalendar: false,
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

        const games = await gameService.get_clean_gameplay();
        this.searchResults = games.filter((game) =>
          game.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        this.visibleResults = this.searchResults.slice(0, 20);
      } catch (error) {
        console.error("Error handling search input:", error);
      }
    },
    handleGameClick(gameName) {
      this.searchQuery = gameName;
      this.visibleResults = [];
      this.selectedGame = this.searchResults.find(
        (game) => game.name === gameName
      );
    },
    openCalendar() {
      this.showCalendar = true;
    },
    closeCalendar() {
      this.showCalendar = false;
    },
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
