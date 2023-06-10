import apiClient from "@/services/AxiosClient.js";
import GStore from "@/store";

export default {
  // getGameName(query) {
  //   return apiClient.post(`/game/name?query=${query}`).then((response) => {
  //     GStore.gameList = response.data;
  //     console.log(GStore);
  //   });
  // },
  // getGameSummary(query) {
  //   return apiClient.post(`/game/summary?query=${query}`).then((response) => {
  //     GStore.gameList = response.data;
  //     console.log(GStore);
  //   });
  // },
  search(query) {
    return apiClient.post(`/game/search?query=${query}`).then((response) => {
      GStore.gameList = response.data;
      console.log(GStore);
    });
  },
};
