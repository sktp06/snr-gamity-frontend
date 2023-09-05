<template>
  <div class="game-popup">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Game Cover on the Left -->
      <div class="md:col-span-1">
        <div class="image-container">
          <img
            :src="game.cover || defaultCover"
            alt="Game Cover"
            class="game-image rounded-lg mb-2"
          />
        </div>
        <div class="px-10">
          <button
            @click="toggleBookmark"
            class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            <i v-if="isGameInMyList" class="fas fa-minus-circle"></i>
            <i v-else class="fas fa-plus-circle"></i>
            {{ isGameInMyList ? "Remove from My List" : "Add to My List" }}
          </button>
        </div>
      </div>

      <!-- Game Details on the Right -->
      <div class="md:col-span-2 px-4">
        <h3 class="text-2xl font-bold mb-4 capitalize text-center">
          {{ game.name }}
        </h3>
        <p class="mb-2 text-justify">
          <span class="font-bold">Description:</span>
          {{ game.unclean_summary }}
        </p>
        <p class="mb-2">
          <span class="font-bold">Release Date:</span>
          {{
            game.release_dates
              ? formatDate(game.release_dates) + getReleaseStatus(game)
              : "No release date"
          }}
        </p>
        <p class="mb-2">
          <span class="font-bold">Genres:</span>
          {{
            game.genres && game.genres.length > 0
              ? game.genres.join(", ")
              : "No genres"
          }}
        </p>
        <p class="mb-4">
          <span class="font-bold">Rating:</span>
          {{ game.rating ? Math.round(game.rating) : "No rating" }}
        </p>
        <p class="mb-4">
          <span class="font-bold">Aggregate Rating:</span>
          {{
            game.aggregated_rating
              ? Math.round(game.aggregated_rating)
              : "No rating"
          }}
        </p>
        <div>
          <p class="font-bold mb-2">Time to Beat:</p>
          <ul class="mb-4">
            <li>
              <span class="font-bold">Story:</span>
              {{ game.main_story ? game.main_story : "--" }} hour(s)
            </li>
            <li>
              <span class="font-bold">Extra:</span>
              {{ game.main_extra ? game.main_extra : "--" }} hour(s)
            </li>
            <li>
              <span class="font-bold">Completionist:</span>
              {{ game.completionist ? game.completionist : "--" }}
              hour(s)
            </li>
          </ul>
        </div>
        <div>
          <p class="font-bold mb-2">List of store(s):</p>
          <ul class="mb-4 flex flex-wrap">
            <li v-for="store in game.websites" :key="store.id">
              <a
                :href="store[0]"
                target="_blank"
                class="inline-block bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 mr-2 mb-2"
                >{{ store[1] }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <button
      class="close-button bg-gray-200 text-gray-500 font-bold py-2 px-4 rounded-full mt-4"
      @click="$emit('close')"
    >
      Close
    </button>
  </div>
</template>

<script>
import BookmarkService from "@/services/BookmarkService.js";
import defaultCoverImage from "@/assets/no-image-available.png";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
    hideAddToFavoritesButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isGameInMyList: false, // Track if the game is already a favorite
      defaultCover: defaultCoverImage,
    };
  },
  methods: {
    async toggleBookmark() {
      const userId = JSON.parse(localStorage.getItem("user")).user_id;
      const gameId = this.game.id;

      try {
        if (this.isGameInMyList) {
          // Remove the game from the bookmark list
          await BookmarkService.removeBookmark(userId, gameId);
          console.log("Removed game from My List:", gameId);
        } else {
          // Add the game to the bookmark list
          await BookmarkService.addBookmark(userId, gameId);
          console.log("Added game to My List:", gameId);
        }

        // Toggle the isGameInMyList value
        this.isGameInMyList = !this.isGameInMyList;

        // Emit a custom event to forward the change to the parent component
        this.$emit("bookmark-updated", {
          gameId: this.game.id,
          isGameInMyList: this.isGameInMyList,
        });
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        // You can handle the error in your Vue component or display an error message here if needed.
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    },
    hasReleased(game) {
      if (!game.release_dates) {
        return false;
      }

      const releaseDate = new Date(game.release_dates);
      const today = new Date();
      return today >= releaseDate;
    },

    getReleaseStatus(game) {
      if (!game.release_dates) {
        return "";
      }

      const releaseDate = new Date(game.release_dates);
      const today = new Date();
      const differenceInTime = releaseDate.getTime() - today.getTime();
      const differenceInDays = Math.floor(
        differenceInTime / (1000 * 3600 * 24)
      );

      if (differenceInDays > 0) {
        return ` (In ${differenceInDays} day${
          differenceInDays > 1 ? "s" : ""
        })`;
      } else if (differenceInDays < 0) {
        const differenceInMonths = Math.abs(Math.floor(differenceInDays / 30));
        const differenceInYears = Math.floor(differenceInMonths / 12);
        const remainingMonths = differenceInMonths % 12;

        if (differenceInYears > 0) {
          if (remainingMonths > 0) {
            return ` (${differenceInYears} year${
              differenceInYears > 1 ? "s" : ""
            } and ${remainingMonths} month${
              remainingMonths > 1 ? "s" : ""
            } ago)`;
          } else {
            return ` (${differenceInYears} year${
              differenceInYears > 1 ? "s" : ""
            } ago)`;
          }
        } else if (remainingMonths > 0) {
          return ` (${remainingMonths} month${
            remainingMonths > 1 ? "s" : ""
          } ago)`;
        } else {
          return " (Just Released)";
        }
      } else {
        return " (Released today)";
      }
    },
    getRemainingDays(game) {
      if (!game.release_dates) {
        return 0;
      }

      const releaseDate = new Date(game.release_dates);
      const today = new Date();
      const differenceInTime = releaseDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays;
    },
  },
};
</script>

<style scoped>
.game-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998; /* Set a lower z-index for the card */
  width: 80%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: start;
  overflow-y: auto;
  max-height: 80vh;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.swal2-container {
  z-index: 9999;
}
.game-popup::-webkit-scrollbar {
  width: 0;
  display: none;
}

.game-popup::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.game-popup::-webkit-scrollbar-track {
  background-color: #edf2f7; /* Set the color of the scrollbar track */
}

.image-container {
  display: flex;
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
  margin-top: 30%;
}

.game-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
}

.game-details {
  display: flex;
  flex-direction: column;
  color: #000;
}

.game-details h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.game-details p {
  font-size: 16px;
  margin-bottom: 10px;
}

.close-button {
  cursor: pointer;
  padding: 10px 20px;
  background-color: transparent;
  transition: background-color 0.3s;
}

.close-button:hover {
  background-color: #c1c2c4; /* Add grey background on hover */
}
</style>
