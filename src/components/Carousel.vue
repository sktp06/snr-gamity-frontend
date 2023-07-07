<template>
  <carousel :items-to-show="6.5" :items-to-scroll="7">
    <slide
      v-for="(game, index) in games"
      :key="index"
      @click="gameClicked(game)"
    >
      <img
        :src="game.cover"
        alt="cover"
        class="w-full h-64 object-cover mx-1 rounded-md"
      />
    </slide>
    <GameDetail
      v-if="selectedGame"
      :game="selectedGame"
      @close="hideGameDetail"
    />
    <template #addons> <navigation class="carousel__icon" /> </template>
  </carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import GameDetail from "@/components/GameDetail.vue";
export default {
  name: "App",
  components: {
    Carousel,
    Slide,
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
  font-size: 5 rem !important;
}
.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
