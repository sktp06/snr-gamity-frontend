<template>
  <div
    class="game-card relative border border-gray-300 p-4 mb-4 text-center rounded-lg overflow-hidden transform transition duration-200 hover:scale-105"
  >
    <img
      :src="game.cover || defaultCover"
      alt="cover"
      class="w-full h-64 object-cover rounded-t-lg"
    />
    <div class="p-4">
      <h2
        class="text-lg font-bold h-16 overflow-hidden line-clamp-2 mt-2 capitalize"
      >
        {{ game.name }}
      </h2>
      <p class="text-gray-600 font-bold">{{ formattedReleaseDate }}</p>
      <p v-if="remainingDays" class="text-sm text-gray-500">
        In ( {{ remainingDays }} ) days
      </p>
      <button
        @click="toggleFavorite(game.id)"
        class="favorite-button"
        :class="{ 'text-green-500': isFavorite, 'full-heart': isFavorite }"
      >
        <i v-if="isFavorite" class="fas fa-minus-circle text-red-500"></i>
        <i v-else class="fas fa-plus-circle"></i>
      </button>
    </div>
  </div>
</template>

<script>
import defaultCoverImage from "@/assets/no-image-available.png";
import BookmarkService from "@/services/BookmarkService.js";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultCover: defaultCoverImage,
      isFavorite: false,
    };
  },
  computed: {
    formattedReleaseDate() {
      const releaseDate = new Date(this.game.release_dates);
      return releaseDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    remainingDays() {
      const releaseDate = new Date(this.game.release_dates);
      const today = new Date();
      const differenceInTime = releaseDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays > 0 ? differenceInDays : null;
    },
  },
  methods: {
    toggleFavorite(gameId) {
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
  },
};
</script>

<style>
.favorite-button {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: transparent;
  color: #008000;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.3s ease-in-out;
}

.favorite-button:hover {
  color: #8b0000;
}

.full-heart {
  color: red;
}
</style>
