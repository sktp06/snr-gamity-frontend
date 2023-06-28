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
  // async getGameGenres() {
  //   try {
  //     const response = await apiClient.get("/game/genre");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching game genres:", error);
  //     throw error;
  //   }
  // },
};
