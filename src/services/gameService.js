import Swal from "sweetalert2";
import apiClient from "@/services/AxiosClient.js";

export default {
  async getGames() {
    try {
      const response = await apiClient.get("/game/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Games",
        text: "An error occurred while fetching games.",
      });
      throw error;
    }
  },
  async get_clean_gameplay() {
    try {
      const response = await apiClient.get("/game/clean_data");
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Games",
        text: "An error occurred while fetching games.",
      });
      throw error;
    }
  },
  async getGameStatistics() {
    try {
      const response = await apiClient.get("/game/stat");
      return response.data.content;
    } catch (error) {
      console.error("Error fetching game statistics:", error);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Game Statistics",
        text: "An error occurred while fetching game statistics.",
      });
      throw error;
    }
  },
  async searchGames(query) {
    try {
      const response = await apiClient.post("/game/search", { query });
      return response.data;
    } catch (error) {
      console.error("Error searching games:", error);
      Swal.fire({
        icon: "error",
        title: "Error Searching Games",
        text: "An error occurred while searching for games.",
      });
      throw error;
    }
  },
};
