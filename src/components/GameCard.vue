<template>
  <div class="game-card border border-gray-300 p-4 mb-4">
    <h2 class="text-lg font-bold">{{ game.name }}</h2>
    <p class="mb-2">Rating: {{ game.rating }}</p>
    <p class="mb-2">Genre: {{ game.genre }}</p>
    <p class="mb-2">Release Date: {{ game.release_date }}</p>
  </div>
</template>

<script>
export default {
  props: ["game"],
  mounted() {
    console.log(this.game); // Check the structure of the game object
  },
};
</script>

<style scoped>
/* Styles for the GameCard component */
</style>
