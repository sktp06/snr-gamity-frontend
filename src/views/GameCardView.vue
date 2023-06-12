<template>
  <div>
    <h1>Game List</h1>
    <div v-for="game in displayedGames" :key="game.id">
      <GameCard :game="game" />
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">
        Previous
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
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
      itemsPerPage: 20, // Number of games to display per page
      currentPage: 1, // Current page number
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.games.length / this.itemsPerPage);
    },
    displayedGames() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.games.slice(startIndex, endIndex);
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
/* Styles for the GameList component */
.pagination {
  margin-top: 10px;
}
</style>
