<template>
  <div class="game-card border border-gray-300 p-4 mb-4">
    <img :src="game.cover" alt="cover" class="w-full h-64 object-cover" />
    <h2 class="text-lg font-bold">{{ game.name }}</h2>
    <p class="mb-2">Rating: {{ game.rating }}</p>
    <p class="mb-2">
      Genres:
      <span v-for="(genre, index) in game.genres" :key="index">
        {{ genre }}
        <span v-if="index !== game.genres.length - 1">, </span>
      </span>
    </p>
    <p class="mb-2">Release Date: {{ game.release_dates }}</p>
    <button
      @click="addToFavorites"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add to Favorites
    </button>
  </div>
</template>

<script>
export default {
  props: ["game"],
  mounted() {
    console.log(this.game); // Check the structure of the game object
  },
  methods: {
    addToFavorites() {
      // Add your logic here to handle adding the game to favorites
      // For example, you can emit an event or call a Vuex action to update the favorites state
    },
  },
};
</script>
