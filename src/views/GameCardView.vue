<template>
  <div class="bg-zinc-900 text-white min-h-screen overflow-x-hidden">
    <div class="flex justify-between items-center px-4 py-6">
      <h2 class="text-3xl font-bold mt-2">Game Library</h2>
    </div>
    <div class="container mx-auto py-8 px-4">
      <div v-for="(value, index) in displayedGames" :key="index" class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{{ value.genre }}</h2>
        <Carousel :games="value.games" @game-clicked="showGameDetail" />
      </div>
      <div
        v-if="selectedGame"
        class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-80 z-10"
      >
        <GameDetail :game="selectedGame" @close="hideGameDetail" />
        <button
          class="absolute top-4 right-4 text-white font-bold text-lg px-4 py-2 bg-red-600 rounded"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";
import gameService from "@/services/gameService";
import GameDetail from "@/components/GameDetail.vue";

export default {
  components: {
    Carousel,
    GameDetail,
  },
  data() {
    return {
      games: [],
      itemsPerPage: 15,
      currentPage: 1,
      selectedGenre: "",
      selectedGame: null,
    };
  },
  computed: {
    allGenres() {
      const allGenres = new Set();
      this.games.forEach((game) => {
        game.genres.forEach((genre) => allGenres.add(genre));
      });
      return Array.from(allGenres);
    },
    displayedGames() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      let displayedGenres = [];
      this.allGenres.forEach((genre) => {
        displayedGenres.push({
          genre: genre,
          games: this.filteredGames(genre).slice(startIndex, endIndex),
        });
      });
      return displayedGenres;
    },
  },
  async mounted() {
    try {
      this.games = await gameService.getGames();
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  },
  methods: {
    filteredGames(genre) {
      let filteredGames = this.games.filter((game) =>
        game.genres.includes(genre)
      );
      return filteredGames.sort((a, b) => b.popularity - a.popularity);
    },
    showGameDetail(game) {
      this.selectedGame = game;
    },
    hideGameDetail() {
      this.selectedGame = null;
    },
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>
<style>
.game-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 80%;
  max-width: 800px;
  background-color: #000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-popup img {
  width: 40%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
}

.game-popup .game-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.game-popup h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.game-popup p {
  font-size: 16px;
  margin-bottom: 10px;
}

.game-popup .close-button {
  cursor: pointer;
  background-color: #fff;
  color: #000;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
