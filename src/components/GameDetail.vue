<template>
  <div class="game-popup">
    <img :src="game.cover" alt="Game Cover" class="game-image" />
    <div class="game-details">
      <h3>{{ game.name }}</h3>
      <p>Rating: {{ game.rating }}</p>
      <!-- Additional game details if needed -->
    </div>
    <button class="close-button" @click="$emit('close')">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.game-detail {
  /* Add your styling for the game detail popup */
}

.game-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 80%;
  background-color: #000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-popup img {
  width: 40%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.game-popup .game-details {
  display: flex;
  flex-direction: column;
  align-items: center;
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
