<template>
  <div class="bg-zinc-900 text-white min-h-screen">
    <div class="flex justify-between items-center px-4 py-6">
      <h2 class="text-3xl text-white font-bold mt-2">Game Library</h2>
    </div>
    <div v-for="(value, index) in displayedGenres" :key="index">
      <h2 class="text-2xl font-bold mx-4 my-2">{{ value.genre }}</h2>
      <Carousel
        :games="value.games"
        @game-clicked="showGameDetail"
        :items-to-show="5.5"
        class="mx-4"
      />
      <button class="see-more mx-4" @click="toggleGenrePopup(value.genre)">
        {{ expandedGenres.includes(value.genre) ? "See Less" : "See More" }}
      </button>
      <div
        v-if="expandedGenres.includes(value.genre)"
        class="genre-popup"
        @click.self="hideGenrePopup"
      >
        <div class="popup-content">
          <button class="close-button" @click="hideGenrePopup">Close</button>
          <div class="game-grid">
            <div
              v-for="(game, gameIndex) in filteredGames(value.genre).slice(
                30,
                60
              )"
              :key="gameIndex"
              class="game-item"
              @click="showGameDetail(game)"
            >
              <img :src="game.cover" :alt="game.name" class="game-image" />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedGame"
        class="game-popup"
        :class="{ 'show-popup': selectedGame }"
      >
        <div class="overlay"></div>
        <GameDetail :game="selectedGame" @close="hideGameDetail" />
        <button class="close-button" @click="hideGameDetail">Close</button>
      </div>
      <div v-if="showSeeMore" class="see-more-popup">
        <div class="popup-content">
          <h2 class="text-2xl font-bold">
            {{ displayedGenres[seeMoreIndex].genre }}
          </h2>
          <div class="game-grid">
            <div
              v-for="game in filteredGames(
                displayedGenres[seeMoreIndex].genre
              ).slice(30, 60)"
              :key="game.id"
              class="game-item"
            >
              <img :src="game.cover" alt="Game Cover" class="game-image" />
            </div>
          </div>
          <button class="close-button" @click="hideSeeMorePopup">Close</button>
        </div>
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
      itemsPerGenre: 50,
      selectedGenre: "",
      selectedGame: null,
      expandedGenres: [],
      showSeeMore: false,
      seeMoreIndex: null,
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
    displayedGenres() {
      return this.allGenres.map((genre) => ({
        genre,
        games: this.filteredGames(genre).slice(0, this.itemsPerGenre),
      }));
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
      let filtered = this.games.filter((game) => game.genres.includes(genre));
      return filtered.sort((a, b) => b.rating - a.rating);
    },
    showGameDetail(game) {
      this.selectedGame = game;
      this.disableScroll();
    },
    hideGameDetail() {
      this.selectedGame = null;
      this.enableScroll();
    },
    toggleGenrePopup(genre) {
      const index = this.expandedGenres.indexOf(genre);
      if (index === -1) {
        this.expandedGenres.push(genre);
      } else {
        this.expandedGenres.splice(index, 1);
      }
    },
    showSeeMorePopup(index) {
      this.showSeeMore = true;
      this.seeMoreIndex = index;
      this.disableScroll();
    },
    hideSeeMorePopup() {
      this.showSeeMore = false;
      this.seeMoreIndex = null;
      this.enableScroll();
    },
    hideGenrePopup() {
      this.expandedGenres = [];
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

<style>
.game-popup {
  width: 50%;
}

.genre-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.popup-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  max-width: 1000px;
  max-height: 1000px;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 10px;
}

.genre-popup.show-popup {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s, visibility 0.3s;
}
.genre-popup .game-item {
  width: calc(
    16.666% - 20px
  ); /* Adjust the width calculation based on your needs */
  height: calc(
    20% - 20px
  ); /* Adjust the height calculation based on your needs */
  margin: 10px;
  cursor: pointer;
  transition: transform 0.3s;
}
.genre-popup .game-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 10px; /* Add a gap between the game images */
}

.genre-popup .game-item {
  width: calc(25% - 10px);
  height: fit-content; /* Adjust the width calculation based on your needs */
}

.genre-popup .game-item:hover {
  transform: scale(1.05);
}

.genre-popup .game-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
}

.genre-popup h3 {
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
  color: #fff;
}

.see-more-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.see-more-popup .popup-content {
  background-color: #000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-height: 90vh; /* Limit the maximum height of the popup to 90% of the viewport height */
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the game items horizontally */
  align-items: center; /* Center the game items vertically */
}

.see-more-popup .game-item {
  width: 200px; /* Adjust the width of each game item based on your needs */
  height: 200px; /* Set the height equal to the width to make the popup square */
  margin-right: 20px; /* Adjust the spacing between game items based on your needs */
  margin-bottom: 20px; /* Adjust the spacing between game items based on your needs */
}

.see-more-popup .game-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.see-more-popup .game-title {
  font-size: 16px;
  text-align: center;
  color: #fff;
  margin-top: 10px;
}

.close-button {
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 20px;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}
/* .game-item {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
} */
</style>
