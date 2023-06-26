<template>
  <div>
    Genre 1
    <Carousel :games="games" />
    Genre 2
    <Carousel :games="games" />
    Genre 3
    <Carousel :games="games" />
  </div>
</template>

<script>
import Carousel from "@/components/Carousel.vue";

export default {
  name: "login-page",
  components: {
    Carousel,
  },
  data() {
    return {
      games: [
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1wfq.jpg",
          },
        },
        {
          id: 107599,
          aggregated_rating: 78.25,
          aggregated_rating_count: 6,
          cover: {
            id: 88694,
            url: "//images.igdb.com/igdb/image/upload/t_thumb/co1wfq.jpg",
          },
        },
      ],
    };
  },
};
</script>
