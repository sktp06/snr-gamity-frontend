<template>
  <div>
    <h1>Game List</h1>
    <div v-for="game in games" :key="game.id">
      <GameCard :game="game" />
    </div>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue"; // Import the GameCard component
import gameService from "@/services/gameService";

export default {
  components: {
    GameCard, // Register the GameCard component
  },
  data() {
    return {
      games: [],
    };
  },
  async mounted() {
    try {
      this.games = await gameService.getGames();
      console.log(this.games); // Check if the data is logged correctly
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  },
};
</script>

<style scoped>
/* Styles for the GameList component */
</style>
