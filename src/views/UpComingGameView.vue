<template>
  <div class="bg-zinc-900 min-h-screen overflow-x-hidden">
    <div class="flex justify-between items-center px-4 py-6">
      <h2 class="text-3xl text-white font-bold">Upcoming Games</h2>
      <h2
        v-if="selectedYear"
        class="ml-2 mt-4 mb-2 font-bold text-xl text-white"
      >
        {{ formatYear(selectedYear) }}
      </h2>
      <div class="flex items-center">
        <label for="year" class="mr-2 mt-4 mb-2 text-white"
          >Filter by Year:</label
        >
        <select
          id="year"
          v-model="selectedYear"
          @change="filterGamesByYear"
          class="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white mx-4"
        >
          <option value="">All</option>
          <option v-for="year in sortedUniqueYears" :value="year" :key="year">
            {{ formatYear(year) }}
          </option>
        </select>
        <label for="genre" class="mr-2 mt-4 mb-2 text-white"
          >Filter by Genre:</label
        >
        <select
          id="genre"
          v-model="selectedGenre"
          @change="filterGamesByGenre"
          class="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white mx-4"
        >
          <option value="">All</option>
          <option v-for="genre in uniqueGenres" :value="genre" :key="genre">
            {{ genre }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex flex-wrap -mx-4">
      <div v-for="game in filteredGames" :key="game.id" class="w-1/6 px-4">
        <div
          class="bg-white transform hover:-translate-y-1 hover:scale-105 transition duration-300 shadow-lg rounded-md ml-2 mr-2"
        >
          <GameCard :game="game" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import apiClient from "@/services/AxiosClient.js";

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      upcomingGames: [],
      error: null,
      selectedYear: "", // Stores the selected year for filtering
      selectedGenre: "", // Stores the selected genre for filtering
    };
  },
  computed: {
    uniqueGenres() {
      // Get unique genres from the upcoming games
      const genres = new Set(
        this.upcomingGames.reduce((acc, game) => {
          acc.push(...game.genres);
          return acc;
        }, [])
      );
      return Array.from(genres);
    },
    uniqueYears() {
      // Get unique years from the upcoming games
      const years = [
        ...new Set(
          this.upcomingGames.map((game) =>
            this.getYearFromReleaseDate(game.release_dates)
          )
        ),
      ];
      return years;
    },
    sortedUniqueYears() {
      // Create a new sorted array in ascending order
      return [...this.uniqueYears].sort((a, b) => a - b);
    },
    filteredGames() {
      // Apply the year and genre filters on upcoming games
      if (this.selectedYear && this.selectedGenre) {
        return this.upcomingGames.filter(
          (game) =>
            this.getYearFromReleaseDate(game.release_dates).toString() ===
              this.selectedYear && game.genres.includes(this.selectedGenre)
        );
      } else if (this.selectedYear) {
        return this.upcomingGames.filter(
          (game) =>
            this.getYearFromReleaseDate(game.release_dates).toString() ===
            this.selectedYear
        );
      } else if (this.selectedGenre) {
        return this.upcomingGames.filter((game) =>
          game.genres.includes(this.selectedGenre)
        );
      } else {
        return this.upcomingGames;
      }
    },
  },
  mounted() {
    this.fetchUpcomingGames();
  },
  methods: {
    async fetchUpcomingGames() {
      try {
        const response = await apiClient.get("/game/data");
        const games = response.data;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Month index starts from 0

        this.upcomingGames = games.filter((game) => {
          if (game.release_dates) {
            const releaseDate = new Date(game.release_dates);
            const releaseYear = releaseDate.getFullYear();
            const releaseMonth = releaseDate.getMonth() + 1;

            // Check if the release year is greater than or equal to the current year
            // and the release month is greater than the current month
            if (releaseYear > currentYear) {
              return true;
            } else if (
              releaseYear === currentYear &&
              releaseMonth > currentMonth
            ) {
              return true;
            }
          }
          return false;
        });

        // Sort the upcoming games by release dates from closest to farthest
        this.upcomingGames.sort((a, b) => {
          const releaseDateA = new Date(a.release_dates);
          const releaseDateB = new Date(b.release_dates);
          return releaseDateA - releaseDateB;
        });

        this.error = null;
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
        this.upcomingGames = [];
        this.error = "Error fetching upcoming games. Please try again later.";
      }
    },
    getYearFromReleaseDate(releaseDate) {
      const parts = releaseDate.split("-");
      return parts[0];
    },
    formatYear(year) {
      // Format the year as desired
      return year;
    },
    filterGamesByYear() {
      // Apply the selected year filter
      // This will trigger the computed property 'filteredGames'
    },
    filterGamesByGenre() {
      // Apply the selected genre filter
      // This will trigger the computed property 'filteredGames'
    },
  },
};
</script>
