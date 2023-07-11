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
            <!-- <h2 class="genre-title">{{ value.genre }}</h2> -->
            <!-- Moved above the div block -->
            <div
              v-for="(game, gameIndex) in filteredGames(value.genre).slice(
                0,
                100
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
      return filtered.sort((a, b) => b.popularity - a.popularity);
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
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 #edf2f7;
}

.genre-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9997;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  /* align-items: flex-start; */
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
  width: calc(
    20% - 10px
  ); /* Adjust the width calculation based on your needs */
  height: fit-content; /* Adjust the height calculation based on your needs */
  margin: 10px;
  cursor: pointer;
  transition: transform 0.3s;
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
.genre-popup .popup-content {
  /* Other existing styles */

  /* Customize the scroll bar style */
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 #edf2f7;
}

.genre-popup .popup-content::-webkit-scrollbar-track {
  background-color: #edf2f7;
}

.genre-popup .popup-content::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 10px;
}

.genre-popup .popup-content::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>
