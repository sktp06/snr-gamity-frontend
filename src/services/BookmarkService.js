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
          alert("Success: " + res.data.message); // Use standard JavaScript alert
        }
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          alert("Error: " + err.response.data.message); // Use standard JavaScript alert
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
        alert("Success: " + res.data.message); // Use standard JavaScript alert
        location.reload();
      })
      .catch((err) => {
        alert("Error: " + err.response.data.message); // Use standard JavaScript alert
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
        alert("Error: " + err.response.data.message); // Use standard JavaScript alert
        console.log(err);
        throw err; // Rethrow the error
      });
  },
  recommendGames(userId) {
    return apiClient
      .post("/bookmarks/recommend", {
        userId: userId,
      })
      .then((res) => {
        if (res && res.data) {
          return res.data.recommended_games;
        }
      })
      .catch((err) => {
        alert("Error: " + err.response.data.message); // Use standard JavaScript alert
        console.log(err);
        throw err;
      });
  },
};
