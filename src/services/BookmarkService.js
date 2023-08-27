import apiClient from "./AxiosClient";
import GStore from "@/store";
import Swal from "sweetalert2";

export default {
  addBookmark(userId, gameId) {
    return apiClient
      .post("/bookmarks/add", {
        userId: userId,
        gameId: gameId,
      })
      .then((res) => {
        if (res && res.data) {
          Swal.fire("Success", res.data.message, "success");
        }
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          Swal.fire("Error", err.response.data.message, "error");
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
        Swal.fire("Success", res.data.message, "success").then(() => {
          location.reload();
        });
      })
      .catch((err) => {
        Swal.fire("Error", err.response.data.message, "error");
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
        Swal.fire("Error", err.response.data.message, "error");
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
        Swal.fire("Error", err.response.data.message, "error");
        console.log(err);
        throw err;
      });
  },
};
