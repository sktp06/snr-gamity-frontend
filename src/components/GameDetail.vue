<template>
  <div class="game-popup">
    <img :src="game.cover" alt="Game Cover" class="game-image" />
    <div class="game-details">
      <h3>{{ game.name }}</h3>
      <p>
        Release Date:
        {{ game.release_dates[0] ? game.release_dates[0] : "no release date" }}
      </p>
      <p>
        Genres:
        {{ game.genres.length > 0 ? game.genres.join(", ") : "no genres" }}
      </p>
      <p>
        rating:
        {{ game.rating ? game.rating : "no rating" }}
      </p>
      <div>
        <p>Time to beat:</p>
        <ul>
          <li>Story: {{ game.main_story }} hour(s)</li>
          <li>Extra: {{ game.main_extra }} hour(s)</li>
          <li>Completionist: {{ game.completionist }} hour(s)</li>
        </ul>
      </div>
      <div>
        <p>List of store(s):</p>
        <ul>
          <li v-for="store in game.websites" :key="store.id">
            <a :href="store[0]" target="_blank">{{ store[1] }}</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- Additional game details if needed -->
    <button class="close-button" @click="$emit('close')">Close</button>
    <button
      @click="addToFavorites(game.id)"
      class="bg-blue-400 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
    >
      Add to Favourites
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
      BookmarkService.addBookmark(
        JSON.parse(localStorage.getItem("user")).id,
        gameId,
        console.log("Adding game to favorites:", gameId)
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
  width: 50%;
  background-color: #000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: start;
}

.game-popup img {
  width: 40%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
  align-self: center;
}

.game-popup .game-details {
  display: flex;
  flex-direction: column;
  color: #fff;
  margin-bottom: 20px;
}

.game-popup h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.game-popup p {
  font-size: 16px;
  margin-bottom: 10px;
}

.game-popup .close-button {
  cursor: pointer;
  background-color: #fff;
  color: #000;
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
