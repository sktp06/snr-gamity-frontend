<template>
  <div
    class="game-card relative border border-gray-300 p-4 mb-4 text-center rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:rotate-3"
  >
    <img
      :src="game.cover || defaultCover"
      alt="cover"
      class="w-full h-64 object-cover rounded-t-lg"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold h-16 overflow-hidden line-clamp-2 mt-2">
        {{ game.name }}
      </h2>
      <div class="h-12">
        <p class="mb-2 text-sm text-gray-600 overflow-hidden line-clamp-2">
          {{ game.genres.length > 0 ? game.genres.join(", ") : "no genres" }}
        </p>
      </div>
      <p class="text-gray-600 font-bold">{{ formattedReleaseDate }}</p>
      <p v-if="remainingDays" class="text-sm text-gray-500">
        In ( {{ remainingDays }} ) days
      </p>
    </div>
    <!-- <button @click="toggleFavorite(game.id)" class="favorite-button">
      <i :class="['fa', isFavorite ? 'fas' : 'far', 'fa-heart']"></i>
    </button> -->
  </div>
</template>

<script>
import defaultCoverImage from "@/assets/no-image-available.png";
// import BookmarkService from "@/services/BookmarkService.js";

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
  mounted() {
    // Check if the game is already in bookmarks
    // const gameId = this.game.id;
    // const userId = JSON.parse(localStorage.getItem("user")).id;
    // BookmarkService.getbookmarkList(userId)
    //   .then((games) => {
    //     this.isFavorite = games.some((game) => game.id === gameId);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
  // methods: {
  //   toggleFavorite() {
  //     const gameId = this.game.id;
  //     const userId = JSON.parse(localStorage.getItem("user")).id;
  //     if (this.isFavorite) {
  //       BookmarkService.removeBookmark(userId, gameId)
  //         .then(() => {
  //           this.isFavorite = false;
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     } else {
  //       BookmarkService.addBookmark(userId, gameId)
  //         .then(() => {
  //           this.isFavorite = true;
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   },
  // },
};
</script>

<style scoped>
/* Add custom font for a game-like feel */
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.game-card {
  /* Add 3D visual effect */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform-origin: center;
}

.favorite-button {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: transparent;
  color: red;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.3s ease-in-out;
}

.favorite-button:hover {
  color: darkred;
}
</style>
