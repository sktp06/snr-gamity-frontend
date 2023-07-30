import apiClient from "./AxiosClient";
import GStore from "@/store";

export default {
  addBookmark(userId, gameId) {
    return apiClient
      .post("/bookmarks/add", {
        userId: userId,
        gameId: gameId,
      })
      .then((res) => {
        if (res && res.data) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          alert(err.response.data.message);
        }
      });
  },
  removeBookmark(userId, gameId) {
    return apiClient
      .post("/bookmarks/remove", {
        userId: userId,
        gameId: gameId,
      })
      .then((res) => {
        alert(res.data.message);
        location.reload();
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  },
  getbookmarkList(userId) {
    return apiClient
      .post("/bookmarks/", {
        userId: userId,
      })
      .then((res) => {
        GStore.bookmarks = res.data.games;
        return res.data.games; // Return the games data
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
        throw err; // Rethrow the error
      });
  },
};
