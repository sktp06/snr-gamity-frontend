<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <div class="container mx-auto py-8">
      <div class="header flex justify-between mb-4">
        <h2 class="text-2xl font-bold">Game Library</h2>
      </div>
      <div v-for="(value, index) in displayedGames" :key="index">
        <h2 class="text-2xl font-bold">
          {{ value.genre }}
        </h2>
        <Carousel :games="value.games" />
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";
import gameService from "@/services/gameService";

export default {
  components: {
    Carousel,
  },
  data() {
    return {
      games: [],
      itemsPerPage: 20,
      currentPage: 1,
      selectedGenre: "",
    };
  },
  computed: {
    allGenres() {
      const allGenres = new Set();
      this.games.forEach((game) => {
        game.genres.forEach((genre) => allGenres.add(genre));
      });
      return Array.from(allGenres);
    },

    displayedGames() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      let kai = [];
      this.allGenres.forEach((genre) => {
        kai.push({
          genre: genre,
          games: this.filteredGames(genre).slice(startIndex, endIndex),
        });
      });
      console.log(kai);
      return kai;
    },
  },
  async mounted() {
    try {
      this.games = await gameService.getGames();
      console.log(this.games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  },
  methods: {
    filteredGames(genre) {
      let kai = this.games.filter((game) => game.genres.includes(genre));
      return kai.sort((a, b) => b.rating - a.rating);
    },
  },
};
</script>
