<template>
  <div class="bg-gray-900 min-h-screen">
    <div class="flex justify-between items-center px-4">
      <h2
        class="text-2xl font-bold text-white transform hover:-translate-y-1 hover:scale-105 transition duration-300"
      >
        Upcoming Games
      </h2>
    </div>
    <div class="flex flex-wrap -mx-4">
      <div v-for="game in upcomingGames" :key="game.id" class="w-1/5 px-4">
        <div
          class="bg-white transform hover:-translate-y-1 hover:scale-105 transition duration-300 shadow-lg rounded-md ml-2 mr-2"
        >
          <GameCard :game="game" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameCard from "@/components/GameCard.vue";
import apiClient from "@/services/AxiosClient.js";

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      upcomingGames: [],
      error: null,
    };
  },
  mounted() {
    this.fetchUpcomingGames();
  },
  methods: {
    async fetchUpcomingGames() {
      try {
        const response = await apiClient.get("/game/data");
        const games = response.data;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Month index starts from 0

        this.upcomingGames = games.filter((game) => {
          if (game.release_dates) {
            const releaseDates = game.release_dates.map(
              (date) => new Date(date)
            );
            const upcomingReleaseDates = releaseDates.filter((releaseDate) => {
              const releaseYear = releaseDate.getFullYear();
              const releaseMonth = releaseDate.getMonth() + 1;

              // Check if the release year is greater than or equal to the current year
              // and the release month is greater than the current month
              if (releaseYear > currentYear) {
                return true;
              } else if (
                releaseYear === currentYear &&
                releaseMonth > currentMonth
              ) {
                return true;
              }
            });

            if (upcomingReleaseDates.length > 0) {
              game.release_dates = upcomingReleaseDates;
              return true;
            }
          }
          return false;
        });

        // Sort the upcoming games by release dates from closest to farthest
        this.upcomingGames.sort((a, b) => {
          const releaseDateA = a.release_dates[0];
          const releaseDateB = b.release_dates[0];
          return releaseDateA - releaseDateB;
        });

        this.error = null;
      } catch (error) {
        console.error("Error fetching upcoming games:", error);
        this.upcomingGames = [];
        this.error = "Error fetching upcoming games. Please try again later.";
      }
    },
  },
};
</script>
