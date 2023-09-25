<template>
  <button
    class="back-to-top"
    @click="scrollToTop"
    v-if="showButton"
    title="Back to Top"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      ></path>
    </svg>
  </button>
</template>
<script>
export default {
  data() {
    return {
      showButton: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Add smooth scrolling behavior
      });
    },
    handleScroll() {
      // Show the button when the user scrolls down, hide it when at the top
      this.showButton = window.scrollY > 0;
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    // Use the `unmounted` lifecycle hook instead of `destroyed`
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style scoped>
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s;
}

.back-to-top:hover {
  opacity: 1;
  transform: scale(1.1);
}
</style>
