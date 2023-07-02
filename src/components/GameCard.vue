<template>
  <div class="game-card border border-gray-300 p-4 mb-4 text-center">
    <img
      :src="game.cover || defaultCover"
      alt="cover"
      class="w-full h-64 object-cover"
    />
    <h2 class="text-lg font-bold h-16 overflow-hidden line-clamp-2 mt-2">
      {{ game.name }}
    </h2>
    <p class="mb-2">Release Date: {{ formattedReleaseDate }}</p>
  </div>
</template>

<script>
import BookmarkService from "@/services/BookmarkService.js";
import defaultCoverImage from "@/assets/no-image-available.png"; // Path to your default cover image

export default {
  props: ["game"],
  data() {
    return {
      defaultCover: defaultCoverImage,
    };
  },
  computed: {
    formattedReleaseDate() {
      const releaseDate = new Date(this.game.release_dates);
      const day = releaseDate.getDate();
      const month = releaseDate.getMonth() + 1;
      const year = releaseDate.getFullYear();

      return `${day}-${month}-${year}`;
    },
  },
  mounted() {
    console.log(this.game); // Check the structure of the game object
  },
  methods: {
    addToFavorites(gameId) {
      BookmarkService.addBookmark(
        JSON.parse(localStorage.getItem("user")).id,
        gameId
      );
    },
  },
};
</script>
