<template>
  <div class="game-detail">
    <img :src="game.cover" alt="cover" class="w-full h-64 object-cover" />
    <h3>{{ game.title }}</h3>
    <p>Genre: {{ game.genre }}</p>
    <p>Rating: {{ game.rating }}</p>
    <!-- Add more details as needed -->
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.game-detail {
  /* Add your styling for the game detail popup */
}
</style>
