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
        alert(res.data.message);
        return res.data; // Return the response data
      })
      .catch((err) => {
        alert(err.response.data.message);
        throw err; // Rethrow the error
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
        console.log(err);
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
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // getBookmarkById(gameId) {
  //   apiClient
  //     .post("/bookmarks/id", {
  //         gameId: gameId,
  //     })
  //     .then((res) => {
  //       GStore.gameDetails = res.data;
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // },
};
