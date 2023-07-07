<template>
  <div class="game-popup">
    <div class="image-container">
      <img :src="game.cover" alt="Game Cover" class="game-image rounded-lg" />
    </div>
    <div class="game-details">
      <h3 class="text-2xl font-bold mb-4">{{ game.name }}</h3>
      <p class="mb-2">
        <span class="font-bold">Release Date:</span>
        {{ game.release_dates[0] ? game.release_dates[0] : "No release date" }}
      </p>
      <p class="mb-2">
        <span class="font-bold">Genres:</span>
        {{ game.genres.length > 0 ? game.genres.join(", ") : "No genres" }}
      </p>
      <p class="mb-4">
        <span class="font-bold">Rating:</span>
        {{ game.rating ? game.rating : "No rating" }}
      </p>
      <div>
        <p class="font-bold mb-2">Time to beat:</p>
        <ul class="mb-4">
          <li>
            <span class="font-bold">Story:</span> {{ game.main_story }} hour(s)
          </li>
          <li>
            <span class="font-bold">Extra:</span> {{ game.main_extra }} hour(s)
          </li>
          <li>
            <span class="font-bold">Completionist:</span>
            {{ game.completionist }} hour(s)
          </li>
        </ul>
      </div>
      <div>
        <p class="font-bold mb-2">List of store(s):</p>
        <ul class="mb-4 flex flex-wrap">
          <li v-for="store in game.websites" :key="store.id">
            <a
              :href="store[0]"
              target="_blank"
              class="inline-block bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 mr-2 mb-2"
              >{{ store[1] }}</a
            >
          </li>
        </ul>
      </div>
      <button
        @click="addToFavorites(game.id)"
        class="bg-blue-500 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
      >
        Add to Favorites
      </button>
    </div>
    <!-- Additional game details if needed -->
    <button
      class="close-button bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full mt-4"
      @click="$emit('close')"
    >
      Close
    </button>
  </div>
</template>

<script>
import BookmarkService from "@/services/BookmarkService.js";
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addToFavorites(gameId) {
      console.log("Adding game to favorites:", gameId);
      BookmarkService.addBookmark(
        JSON.parse(localStorage.getItem("user")).user_id,
        gameId
      );
    },
  },
};
</script>

<style scoped>
.game-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: start;
}

.image-container {
  width: 40%;
  margin-right: 20px;
}

.game-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.game-details {
  display: flex;
  flex-direction: column;
  color: #000;
}

.game-details h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.game-details p {
  font-size: 16px;
  margin-bottom: 10px;
}

.close-button {
  cursor: pointer;
  padding: 10px 20px;
}
</style>
