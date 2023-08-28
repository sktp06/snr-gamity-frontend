import apiClient from "@/services/AxiosClient.js";

export default {
  async getGames() {
    try {
      const response = await apiClient.get("/game/data");
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  },
  async get_clean_gameplay() {
    try {
      const response = await apiClient.get("/game/clean_data");
      return response.data;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw error;
    }
  },
  async getGameStatistics() {
    try {
      const response = await apiClient.get("/game/stat");
      return response.data.content; // Return the content object from the response
    } catch (error) {
      console.error("Error fetching game statistics:", error);
      throw error;
    }
  },
};
