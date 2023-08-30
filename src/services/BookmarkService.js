import Swal from "sweetalert2";
import apiClient from "./AxiosClient";
import GStore from "@/store";

export default {
  async addBookmark(userId, gameId) {
    try {
      const res = await apiClient.post("/bookmarks/add", {
        userId: userId,
        gameId: gameId,
      });

      if (res && res.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
        });
      }
    } catch (err) {
      if (err && err.response && err.response.data) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error: " + err.response.data.message,
        });
      }
    }
  },
  async removeBookmark(userId, gameId) {
    try {
      const res = await apiClient.post("/bookmarks/remove", {
        userId: userId,
        gameId: gameId,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      location.reload();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error: " + err.response.data.message,
      });
    }
  },
  async getbookmarkList(userId) {
    try {
      const res = await apiClient.post("/bookmarks/", {
        userId: userId,
      });

      GStore.bookmarks = res.data.games;
      return res.data.games;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error: " + err.response.data.message,
      });
      console.log(err);
      throw err;
    }
  },
  async recommendGames(userId) {
    try {
      const res = await apiClient.post("/bookmarks/recommend", {
        userId: userId,
      });

      if (res && res.data) {
        return res.data.recommended_games;
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error: " + err.response.data.message,
      });
      console.log(err);
      throw err;
    }
  },
};
