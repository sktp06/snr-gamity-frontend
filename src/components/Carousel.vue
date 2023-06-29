<template>
  <carousel :items-to-show="5.5">
    <slide
      v-for="(game, index) in games"
      :key="index"
      @click="gameClicked(game)"
    >
      <img :src="game.cover" alt="cover" class="w-full h-64 object-cover" />
    </slide>
    <GameDetail
      v-if="selectedGame"
      :game="selectedGame"
      @close="hideGameDetail"
    />
    <template #addons>
      <navigation />
      <pagination />
    </template>
  </carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import GameDetail from "@/components/GameDetail.vue";
export default {
  name: "App",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    GameDetail,
  },
  data() {
    return {
      selectedGame: null,
    };
  },
  props: {
    itemsToShow: {
      type: Number,
      default: 5.5,
      required: false,
    },
    games: {
      default: [],
      required: true,
    },
  },
  methods: {
    gameClicked(game) {
      this.$emit("game-clicked", game);
    },
    showGameDetail(game) {
      this.selectedGame = game;
    },
    hideGameDetail() {
      this.selectedGame = null;
    },
  },
};
</script>

<style>
.carousel__icon {
  color: white !important;
  font-size: 2rem !important;
}
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
