<template>
  <div class="bg-gray-900 min-h-screen">
    <div class="flex justify-between items-center px-4">
      <h2
        class="text-2xl font-bold text-white mt-2 transform hover:-translate-y-1 hover:scale-105 transition duration-300"
      >
        Data Management
      </h2>
    </div>
    <div class="mt-8 mx-4 grid">
      <div
        class="mb-4 bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-105 transition duration-300"
      >
        <h3 class="text-lg font-bold text-gray-800">Total Games</h3>
        <p class="text-3xl font-semibold text-gray-900">
          {{ gameStatistics?.total_games }}
        </p>
      </div>
      <div
        class="mb-4 bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-105 transition duration-300"
      >
        <h3 class="text-lg font-bold text-gray-800">Update Date</h3>
        <p class="text-xl font-semibold text-gray-900">
          {{ gameStatistics?.update_date }}
        </p>
      </div>
      <div
        class="mb-4 bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-105 transition duration-300"
      >
        <h3 class="text-lg font-bold text-gray-800">Total Games by Genre</h3>
        <div class="mt-4 grid grid-cols-3 gap-4">
          <div
            v-for="(count, genre) in gameStatistics?.genre_counts"
            :key="genre"
          >
            <p class="text-base font-semibold text-gray-900">{{ genre }}:</p>
            <p class="text-xl font-semibold text-gray-900">{{ count }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gameService from "@/services/gameService";

export default {
  name: "data-management-page",
  data() {
    return {
      gameStatistics: null,
    };
  },
  async mounted() {
    try {
      this.gameStatistics = await gameService.getGameStatistics();
      console.log(this.gameStatistics);
    } catch (error) {
      console.error("Error fetching game statistics:", error);
    }
  },
};
</script>
