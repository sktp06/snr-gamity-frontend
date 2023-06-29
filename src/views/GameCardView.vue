<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto py-8">
      <div class="header flex justify-between m-4">
        <h2 class="text-2xl font-bold">Game Library</h2>
      </div>
      <div v-for="(value, index) in displayedGames" :key="index">
        <h2 class="text-2xl font-bold">{{ value.genre }}</h2>
        <Carousel :games="value.games" @game-clicked="showGameDetail" />
      </div>
      <div v-if="selectedGame" class="game-popup">
        <GameDetail :game="selectedGame" @close="hideGameDetail" />
        <button class="close-button" @click="$emit('close')">Close</button>
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
      itemsPerPage: 85,
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
      let kai = [];
      this.allGenres.forEach((genre) => {
        kai.push({
          genre: genre,
          games: this.filteredGames(genre).slice(startIndex, endIndex),
        });
      });
      console.log(kai);
      return kai;
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
    filteredGames(genre) {
      let kai = this.games.filter((game) => game.genres.includes(genre));
      return kai.sort((a, b) => b.rating - a.rating);
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
