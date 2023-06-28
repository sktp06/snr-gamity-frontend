<template>
  <div class="game-card border border-gray-300 p-4 mb-4">
    <img :src="game.cover" alt="cover" class="w-full h-64 object-cover" />
    <h2 class="text-lg font-bold">{{ game.name }}</h2>
    <!-- <p class="mb-2">Rating: {{ game.rating }}</p>
    <p class="mb-2">
      Genres:
      <span v-for="(genre, index) in game.genres" :key="index">
        {{ genre }}
        <span v-if="index !== game.genres.length - 1">, </span>
      </span>
    </p> -->
    <p class="mb-2">Release Date: {{ game.release_dates }}</p>
    <!-- <button
      @click="addToFavorites(game.id)"
      class="bg-blue-400 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
    >
      Add to Favourites
    </button> -->
  </div>
</template>

<script>
import BookmarkService from "@/services/BookmarkService.js";

export default {
  props: ["game"],
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
