import apiClient from "./AxiosClient";
import GStore from "@/store";

export default {
  addBookmark(userId, gameId) {
    apiClient
      .post("/bookmarks/add", {
        userId: userId,
        gameId: gameId,
      })
      .then((res) => {
        if (res && res.data) {
          alert(res.data.message);
        } else {
          alert("Unexpected response from the server.");
        }
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          alert(err.response.data.message);
        } else {
          alert("An error occurred while adding the bookmark.");
        }
      });
  },
  removeBookmark(userId, gameId) {
    apiClient
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
    apiClient
      .post("/bookmarks/", {
        userId: userId,
      })
      .then((res) => {
        GStore.bookmarks = res.data.games;
        return res.data; // Return the response data
      })
      .catch((err) => {
        console.log(err);
        throw err; // Rethrow the error
      });
  },
};
