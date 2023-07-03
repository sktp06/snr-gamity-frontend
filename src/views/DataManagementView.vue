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
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          class="bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
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
        </div>
        <div
          class="bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
        >
          <h3 class="text-lg font-bold text-gray-800">Total Genres</h3>
          <p class="text-xl font-semibold text-gray-900">
            {{ gameStatistics?.total_genres }}
          </p>
        </div>
      </div>
      <div
        class="mb-4 mt-6 bg-slate-300 rounded-lg shadow-md p-6 transform hover:-translate-y-1 hover:scale-102 transition duration-300"
      >
        <h3 class="text-lg font-bold text-gray-800">All Games by Genre</h3>
        <div class="mt-4">
          <canvas ref="genreChart" style="max-height: 500px"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gameService from "@/services/gameService";
import Chart from "chart.js/auto";

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

      this.createGenreChart();
    } catch (error) {
      console.error("Error fetching game statistics:", error);
    }
  },
  methods: {
    createGenreChart() {
      const genreCounts = this.gameStatistics?.genre_counts;

      // Get the canvas element and create the bar chart
      const ctx = this.$refs.genreChart.getContext("2d");
      this.genreChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(genreCounts),
          datasets: [
            {
              label: "Total Games Based on Genre",
              data: Object.values(genreCounts),
              backgroundColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
          indexAxis: "y", // Set the chart axis to vertical
          responsive: true,
          layout: {
            padding: {
              left: 80, // Add padding on the left side
            },
          },
        },
      });
    },
  },
};
</script>
