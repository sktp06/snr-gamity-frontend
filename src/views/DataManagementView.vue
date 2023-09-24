<template>
  <div
    class="bg-zinc-900 min-h-screen main-container"
    style="
      background-image: url('https://t3.ftcdn.net/jpg/02/64/27/90/360_F_264279006_WDXxV3OHjAOoHqH7iiLDrg23p0947g7U.jpg');
      background-size: auto;
    "
  >
    <div class="bg-zinc-900 min-h-screen ml-10 mr-10 rounded-lg">
      <div class="flex justify-between items-center px-4 py-6">
        <h2 class="text-3xl text-white font-bold mt-2">Data Management</h2>
      </div>
      <div class="mt-8 mx-4 grid">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            class="bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300 m"
          >
            <h3 class="text-lg font-bold text-gray-800">Total Games</h3>
            <p class="text-3xl font-semibold text-gray-900">
              {{ gameStatistics?.total_games }}
            </p>
          </div>
          <div
            class="bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
          >
            <h3 class="text-lg font-bold text-gray-800">Update Date</h3>
            <p class="text-xl font-semibold text-gray-900">
              {{ gameStatistics?.update_date }}
            </p>
            <p class="mt-3 text-gray-900">
              <strong>Details:</strong> Lasted fetching game data
            </p>
          </div>
          <div
            class="bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
          >
            <h3 class="text-lg font-bold text-gray-800">Total Genres</h3>
            <p class="text-xl font-semibold text-gray-900">
              {{ gameStatistics?.total_genres }}
            </p>
          </div>
          <div
            class="bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
          >
            <h3 class="text-lg font-bold text-gray-800">
              Total Upcoming Games
            </h3>
            <p class="text-xl font-semibold text-gray-900">
              {{ gameStatistics?.total_upcoming_games }}
            </p>
          </div>
        </div>
        <div
          v-if="gameStatistics"
          class="mb-4 mt-6 bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
        >
          <h3 class="text-lg font-bold text-gray-800">All Games by Genre</h3>
          <div class="mt-4">
            <canvas ref="genreChart" style="max-height: 500px"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gameService from "@/services/gameService";
import Chart from "chart.js/auto";

// Function to generate a random hex color code
function getRandomHexColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default {
  name: "data-management-page",
  data() {
    return {
      gameStatistics: null,
      genreChart: null,
    };
  },
  async mounted() {
    try {
      this.gameStatistics = await gameService.getGameStatistics();
      console.log(this.gameStatistics);

      if (this.gameStatistics) {
        await this.$nextTick(); // Wait for Vue to update the DOM
        this.createGenreChart();
      }
    } catch (error) {
      console.error("Error fetching game statistics:", error);
    }
  },
  // Inside your script section
  methods: {
    createGenreChart() {
      const genreCounts = this.gameStatistics?.genre_counts;

      // Generate an array of 23 random colors
      const randomColors = Array.from({ length: 23 }, getRandomHexColor);

      // Get the canvas element and create the pie chart
      const ctx = this.$refs.genreChart.getContext("2d");
      this.genreChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(genreCounts),
          datasets: [
            {
              label: "Total Games Based on Genre",
              data: Object.values(genreCounts),
              backgroundColor: randomColors,
              // borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
        },
      });
    },
  },
};
</script>
<style>
.main-container {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
