import apiClient from "@/services/AxiosClient.js";
import GStore from "@/store";

export default {
  getGameList() {
    return apiClient.get("/game").then((res) => {
      GStore.gameList = res.data;
    });
  },
};
