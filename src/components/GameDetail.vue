<template>
  <div class="game-popup">
    <div class="game-details">
      <h3 class="mb-2text-2xl font-bold mb-4 capitalize text-center">
        {{ game.name }}
      </h3>
      <div class="image-container">
        <img
          :src="game.cover || defaultCover"
          alt="Game Cover"
          class="game-image rounded-lg mb-2"
        />
      </div>
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
      <p v-if="!hasReleased(game)" class="mb-2">
        <span class="font-bold">Remaining Days:</span>
        {{ getRemainingDays(game) }}
      </p>
      <p class="mb-2">
        <span class="font-bold">Genres:</span>
        {{ game.genres.length > 0 ? game.genres.join(", ") : "No genres" }}
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
            <span class="font-bold">Story:</span> {{ game.main_story }} hour(s)
          </li>
          <li>
            <span class="font-bold">Extra:</span> {{ game.main_extra }} hour(s)
          </li>
          <li>
            <span class="font-bold">Completionist:</span>
            {{ game.completionist }} hour(s)
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
      <button
        @click="addToFavorites(game.id)"
        :class="{
          'bg-gray-500 hover:bg-gray-900': isFavorite,
          'bg-red-500 hover:bg-red-900': !isFavorite,
        }"
        class="text-white font-bold py-2 px-4 rounded-full mt-4"
        :style="{
          'background-color': isFavorite ? 'gray' : 'red',
          hover: {
            'background-color': isFavorite ? 'grey' : 'green',
          },
        }"
      >
        {{ isFavorite ? "Remove from Favorites" : "Add to Favorites" }}
      </button>
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
  },
  data() {
    return {
      isFavorite: false, // Track if the game is already a favorite
      defaultCover: defaultCoverImage,
    };
  },
  methods: {
    addToFavorites(gameId) {
      const userId = JSON.parse(localStorage.getItem("user")).user_id;

      if (this.isFavorite) {
        BookmarkService.removeBookmark(userId, gameId)
          .then(() => {
            console.log("Removed game from favorites:", gameId);
            this.isFavorite = false;
          })
          .catch((error) => {
            console.log("Error removing game from favorites:", error);
          });
      } else {
        BookmarkService.addBookmark(userId, gameId)
          .then(() => {
            console.log("Added game to favorites:", gameId);
            this.isFavorite = true;
          })
          .catch((error) => {
            console.log("Error adding game to favorites:", error);
          });
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
  },
};
</script>

<style scoped>
.game-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 80%;
  max-width: 600px;
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
  justify-content: center;
  align-items: center;
}

.game-image {
  width: 50%;
  height: 50%;
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
