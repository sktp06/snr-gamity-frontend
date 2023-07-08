<template>
  <div class="bg-zinc-900 min-h-screen">
    <div class="flex justify-between items-center px-4 py-6">
      <h2 class="text-3xl text-white font-bold mt-2">My List</h2>
    </div>
    <div class="grid grid-cols-2 gap-10 md:grid-cols-5 mx-4">
      <div
        v-for="game in GStore.bookmarks"
        :key="game.id"
        class="relative rounded-lg shadow-md overflow-hidden hover:shadow-lg border border-amber-200 mb-4"
        style="height: 280px; width: 230px"
      >
        <img
          :src="game.cover"
          alt="image"
          class="object-cover w-full h-full transform transition-transform hover:scale-105"
        />
        <button
          @click="removeFromFavorite(game.id)"
          class="absolute top-2 right-2 p-4 text-white hover:text-red-500 transition-colors duration-300"
        >
          <svg
            class="h-10 w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BookmarkService from "@/services/BookmarkService.js";

export default {
  name: "bookmark-page",
  inject: ["GStore"],
  methods: {
    removeFromFavorite(gameId) {
      console.log("Remove game from favorites:", gameId);
      BookmarkService.removeBookmark(
        JSON.parse(localStorage.getItem("user")).user_id,
        gameId
      );
    },
    getBookmarks() {
      BookmarkService.getbookmarkList(
        JSON.parse(localStorage.getItem("user")).user_id
      )
        .then((games) => {
          this.GStore.bookmarks = games;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getBookmarks(); // Fetch the bookmarked games when the component is mounted
  },
};
</script>
