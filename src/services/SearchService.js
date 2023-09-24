import apiClient from "@/services/AxiosClient.js";
import GStore from "@/store";

export default {
  search(query) {
    return apiClient.post("/game/search", { query: query }).then((response) => {
      GStore.searchGameList = response.data;
      console.log(GStore.searchGameList);
    });
  },
};
