<template>
  <div class="bg-zinc-900 min-h-screen">
    <div class="flex justify-between items-center px-4 py-6">
      <h2 class="text-3xl text-white font-bold mt-2">My List</h2>
    </div>
    <div class="grid grid-cols-2 gap-10 md:grid-cols-5 mx-4">
      <div
        v-for="game in GStore.bookmarks"
        :key="game.id"
        class="relative rounded-lg shadow-md overflow-hidden hover:shadow-lg border border-amber-200 mb-4"
        style="height: 300px; width: 230px"
        @click="showGameDetail(game)"
      >
        <div
          class="relative rounded-lg shadow-md overflow-hidden hover:shadow-lg border border-amber-200 mb-4"
          style="height: 300px; width: 230px"
          @click="showGameDetail(game)"
        >
          <div class="h-250px relative">
            <img
              :src="game.cover"
              alt="image"
              class="object-cover w-full h-full transform transition-transform hover:scale-105"
              style="z-index: 0"
              @click="selectedGame = game"
            />
            <div v-if="selectedGame" class="game-popup">
              <div class="overlay"></div>
              <GameDetail :game="selectedGame" @close="selectedGame = null" />
              <button class="close-button" @click="selectedGame = null">
                Close
              </button>
            </div>
            <div
              v-if="remainingDays(game) !== null && isRecentlyReleased(game)"
              class="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-80"
            >
              <p class="text-white text-center font-bold text-lg">
                In ({{ remainingDays(game) }}) days until the game's release
              </p>
            </div>
          </div>
          <div class="remove-favorite-container" style="z-index: 9999">
            <button
              @click="removeFromFavorite(game.id)"
              class="absolute top-2 right-2 p-4 text-white hover:text-red-500 transition-colors duration-300"
              style="z-index: 9999"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedGame" class="game-popup">
      <div class="overlay"></div>
      <div class="popup-content">
        <GameDetail :game="selectedGame" @close="hideGameDetail" />
        <button class="close-button" @click="hideGameDetail">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import BookmarkService from "@/services/BookmarkService.js";
import GameDetail from "@/components/GameDetail.vue";

export default {
  name: "bookmark-page",
  inject: ["GStore"],
  components: {
    GameDetail,
  },
  data() {
    return {
      selectedGame: null,
      isRemovingFromFavorites: false,
    };
  },
  methods: {
    removeFromFavorite(gameId) {
      this.isRemovingFromFavorites = true; // Set the flag before removing from favorites

      BookmarkService.removeBookmark(
        JSON.parse(localStorage.getItem("user")).user_id,
        gameId
      )
        .then(() => {
          this.getBookmarks();
          this.selectedGame = null; // Set selectedGame to null after removing from favorites
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isRemovingFromFavorites = false; // Reset the flag after the removal process is complete
        });
    },
    getBookmarks() {
      BookmarkService.getbookmarkList(
        JSON.parse(localStorage.getItem("user")).user_id
      )
        .then((games) => {
          this.GStore.bookmarks = games;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    remainingDays(game) {
      const releaseDate = new Date(game.release_dates);
      const today = new Date();
      const differenceInTime = releaseDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays > 0 ? differenceInDays : null;
    },
    showGameDetail(game) {
      if (game.id !== this.selectedGame?.id && !this.isRemovingFromFavorites) {
        this.selectedGame = game;
        this.disableScroll();
      }
    },
    hideGameDetail() {
      this.selectedGame = null;
      this.enableScroll();
    },
    disableScroll() {
      document.body.style.overflow = "hidden";
    },
    enableScroll() {
      document.body.style.overflow = "";
    },
  },
  computed: {
    isRecentlyReleased() {
      const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000; // Assuming one month is 30 days
      const now = new Date();
      return (game) => {
        const releaseDate = new Date(game.release_dates);
        return now - releaseDate <= oneMonthInMilliseconds;
      };
    },
  },
  mounted() {
    this.getBookmarks(); // Fetch the bookmarked games when the component is mounted
  },
};
</script>

<style>
.game-popup {
  width: 50%;
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 #edf2f7;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9997;
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
</style>
