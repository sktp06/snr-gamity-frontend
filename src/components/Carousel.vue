<template>
  <carousel :items-to-show="5.5">
    <slide v-for="(game, index) in games" :key="index">
      <img :src="game.cover.url" alt="cover" class="w-full h-64 object-cover" />
    </slide>
    <template #addons>
      <navigation />
      <pagination />
    </template>
  </carousel>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
export default {
  name: "App",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
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
