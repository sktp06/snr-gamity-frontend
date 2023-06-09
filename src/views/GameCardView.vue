<template>
  <div class="grid grid-cols-4 gap-5 p-[50px]">
    <GameCard v-for="item in GStore.gameList" :key="item.id" :item="item" />
  </div>
</template>
<script>
import GameCard from "../components/GameCard.vue";
export default {
  inject: ["GStore"],
  name: "game-card",
  components: {
    GameCard,
  },
};
</script>
