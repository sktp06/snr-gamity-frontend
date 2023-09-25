<template>
  <div
    class="bg-zinc-900 min-h-screen main-container"
    style="
      background-image: url('https://t3.ftcdn.net/jpg/02/64/27/90/360_F_264279006_WDXxV3OHjAOoHqH7iiLDrg23p0947g7U.jpg');
      background-size: auto;
    "
  >
    <div class="bg-zinc-900 min-h-screen ml-10 mr-10 rounded-lg">
      <div class="flex justify-between items-center px-4 py-6">
        <h2 class="text-3xl text-white font-bold">Game Library</h2>
        <div class="relative inline-block">
          <select
            class="block appearance-none bg-zinc-800 text-white px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-zinc-700"
            v-model="sortingOption"
          >
            <option value="popularity">Trending</option>
            <option value="release_dates">New Released</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 12l-6-6 1.5-1.5L10 9.8l4.5-4.3L16 6l-6 6z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div v-for="(value, index) in displayedGenres" :key="index">
        <h2 class="text-xl font-bold mx-4 my-2 text-white">
          {{ value.genre }}
        </h2>
        <Carousel
          :games="value.games"
          @game-clicked="showGameDetail"
          :items-to-show="5.5"
          class="mx-4"
        />
        <button
          class="see-more mx-4 text-white"
          @click="toggleGenrePopup(value.genre)"
        >
          {{ expandedGenres.includes(value.genre) ? "See Less" : "See More" }}
        </button>

        <div
          v-if="expandedGenres.includes(value.genre)"
          class="genre-popup"
          @click.self="hideGenrePopup"
        >
          <div class="popup-content">
            <div class="mt-5">
              <button class="close-button" @click="hideGenrePopup"></button>
              <div class="game-grid">
                <!-- <h2 class="genre-title">{{ value.genre }}</h2> -->
                <div
                  v-for="(game, gameIndex) in filteredGames(value.genre).slice(
                    0,
                    250
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
        </div>
      </div>
      <div
        v-if="selectedGame"
        class="game-popup"
        :class="{ 'show-popup': selectedGame }"
      >
        <div v-if="selectedGame" class="overlay" @click="hideGameDetail"></div>
        <GameDetail :game="selectedGame" @close="hideGameDetail" />
        <button @click="hideGameDetail"></button>
      </div>
    </div>
    <BackToTopButton />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import gameService from "@/services/gameService";
import BackToTopButton from "@/components/BackToTopButton.vue";

const AsyncCarousel = defineAsyncComponent(() =>
  import("@/components/Carousel.vue")
);

const AsyncGameDetail = defineAsyncComponent(() =>
  import("@/components/GameDetail.vue")
);

export default {
  components: {
    Carousel: AsyncCarousel,
    GameDetail: AsyncGameDetail,
    BackToTopButton,
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
      sortingOption: "popularity",
    };
  },
  computed: {
    allGenres() {
      const allGenres = new Set();
      this.games.forEach((game) => {
        game.genres.forEach((genre) => allGenres.add(genre));
      });
      return Array.from(allGenres).sort();
    },
    displayedGenres() {
      return this.allGenres.map((genre) => ({
        genre,
        games: this.filteredGames(genre)
          .sort((a, b) => {
            if (this.sortingOption === "popularity") {
              return b.popularity - a.popularity;
            } else if (this.sortingOption === "release_dates") {
              return new Date(b.release_dates) - new Date(a.release_dates);
            }
            return 0;
          })
          .slice(0, this.itemsPerGenre),
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
      const currentYear = new Date().getFullYear();

      let filtered = this.games.filter((game) => {
        return (
          game.genres.includes(genre) &&
          new Date(game.release_dates).getFullYear() <= currentYear
        );
      });

      if (this.sortingOption !== "release_dates") {
        filtered = filtered.sort((a, b) => b.popularity - a.popularity);
      }

      return filtered;
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
  width: calc(16.666% - 20px);
  height: calc(20% - 20px);
  margin: 10px;
  cursor: pointer;
  transition: transform 0.3s;
}
.genre-popup .game-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  gap: 20px;
}

.genre-popup .game-item {
  width: calc(20% - 10px);
  height: fit-content;
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

.genre-popup .popup-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.genre-popup .popup-content::-webkit-scrollbar {
  display: none;
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
.main-container {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
