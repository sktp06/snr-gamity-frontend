<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto py-8">
      <div class="header flex justify-between mb-4">
        <h2 class="text-2xl font-bold">Game Library</h2>
        <div>
          <label for="genreFilter" class="text-gray-300 mr-2"
            >Filter by Genre:</label
          >
          <select
            id="genreFilter"
            v-model="selectedGenre"
            class="bg-gray-800 text-white py-1 px-2 rounded"
          >
            <option value="">All Genres</option>
            <option v-for="genre in allGenres" :value="genre" :key="genre">
              {{ genre }}
            </option>
          </select>
        </div>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <GameCard v-for="game in displayedGames" :key="game.id" :game="game" />
      </div>
    </div>
    <!-- Pagination buttons -->
    <div class="flex justify-center mb-8">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="bg-red-700 text-white py-2 px-4 rounded mr-2"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="bg-red-700 text-white py-2 px-4 rounded"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import gameService from "@/services/gameService";

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      games: [],
      itemsPerPage: 20,
      currentPage: 1,
      selectedGenre: "",
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredGames.length / this.itemsPerPage);
    },
    filteredGames() {
      if (this.selectedGenre === "") {
        return this.games;
      } else {
        return this.games.filter((game) =>
          game.genres.includes(this.selectedGenre)
        );
      }
    },
    displayedGames() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const sortedGames = [...this.filteredGames].sort(
        (a, b) => b.rating - a.rating
      );
      return sortedGames.slice(startIndex, endIndex);
    },
    allGenres() {
      const allGenres = new Set();
      this.games.forEach((game) => {
        game.genres.forEach((genre) => allGenres.add(genre));
      });
      return Array.from(allGenres);
    },
  },
  async mounted() {
    try {
      this.games = await gameService.getGames();
      console.log(this.games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
/* Styles for the GameCardView component */
/* ... your existing styles ... */
</style>
