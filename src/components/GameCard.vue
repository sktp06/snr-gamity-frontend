<template>
  <div
    class="game-card relative border border-gray-300 p-4 mb-4 text-center rounded-lg overflow-hidden transform transition duration-200 hover:scale-105"
  >
    <img
      :src="game.cover || defaultCover"
      alt="cover"
      class="w-full h-64 object-cover rounded-t-lg"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold h-16 overflow-hidden line-clamp-2 mt-2">
        {{ game.name }}
      </h2>
      <div class="h-12">
        <p class="mb-2 text-sm text-gray-600 overflow-hidden line-clamp-2">
          {{ game.genres.length > 0 ? game.genres.join(", ") : "no genres" }}
        </p>
      </div>
      <p class="text-gray-600 font-bold">{{ formattedReleaseDate }}</p>
      <p v-if="remainingDays" class="text-sm text-gray-500">
        In ( {{ remainingDays }} ) days
      </p>
    </div>
  </div>
</template>

<script>
import defaultCoverImage from "@/assets/no-image-available.png";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultCover: defaultCoverImage,
      isFavorite: false,
    };
  },
  computed: {
    formattedReleaseDate() {
      const releaseDate = new Date(this.game.release_dates);
      return releaseDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    remainingDays() {
      const releaseDate = new Date(this.game.release_dates);
      const today = new Date();
      const differenceInTime = releaseDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays > 0 ? differenceInDays : null;
    },
  },
};
</script>
