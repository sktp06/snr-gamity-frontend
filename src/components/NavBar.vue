<template>
  <div
    class="top-0 flex justify-between items-center px-3 md:px-6 w-full h-[60px] bg-blue-200"
  >
    <div
      class="text-sm font-bold leading-relaxed i -2 whitespace-nowrap uppercase text-blue-900 gap-x-3 flex flex-row drop-shadow-lg shadow-blue-600/50"
    >
      <router-link
        to="/game-card"
        class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300"
        >Gamity</router-link
      >
      <router-link
        v-if="GStore.currentUser && !isAdmin"
        to="/bookmark"
        class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300"
        >Bookmark</router-link
      >
      <router-link
        v-if="GStore.currentUser"
        to="/upcoming-game"
        class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300"
        >Upcoming</router-link
      >
      <router-link
        v-if="GStore.currentUser && isAdmin"
        to="/data-management"
        class="transform hover:-translate-y-0.5 focus:-translate-y-0.5 transition-all duration-300"
        >Data-Management</router-link
      >
    </div>
    <div
      v-if="GStore.currentUser"
      class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start"
    >
      <Form
        @submit="onSearch"
        :validation-schema="schema"
        class="flex border-2 rounded h-9 ml-4"
      >
        <Field
          class="px-4 py-2 w-80"
          type="text"
          name="query"
          v-model="searchQuery"
          placeholder="Search..."
        />
        <button
          class="flex items-center justify-center px-4 border-l"
          type="submit"
        >
          <svg
            class="w-6 h-6 text-blue-300"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
            />
          </svg>
        </button>
      </Form>
    </div>
    <button
      v-if="!GStore.currentUser && $route.name != 'login'"
      @click="$router.push('login')"
      class="bg-white text-gray-800 active:bg-gray-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 m-3 animate-bounce"
    >
      Login
    </button>
    <div
      class="flex flex-row items-center justify-center gap-x-[12px]"
      v-if="GStore.currentUser"
    >
      <p class="text-gray-900 text-xs font-bold uppercase text-rose-700">
        Username: {{ GStore.currentUser && GStore.currentUser.username }}
      </p>
      <button
        @click="handleLogout"
        class="bg-white text-gray-800 active:bg-gray-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import SearchService from "@/services/SearchService.js";
import SpellService from "@/services/SpellService.js";
import { Form, Field } from "vee-validate";
import * as yup from "yup";

export default {
  inject: ["GStore"],
  name: "navbar-component",
  components: {
    Form,
    Field,
  },
  data() {
    const schema = yup.object().shape({
      query: yup.string().required(),
    });
    return {
      schema,
      showMenu: false,
      searchQuery: "",
    };
  },
  computed: {
    isAdmin() {
      // Assuming your user object has a "role" property indicating the user's role
      return (
        this.GStore.currentUser && this.GStore.currentUser.role === "admin"
      );
    },
  },
  methods: {
    handleLogout() {
      AuthService.logout();
      this.$router.push("/login");
    },
    onSearch() {
      const query = this.searchQuery; // Use the updated searchQuery property

      SpellService.correction(query)
        .then((res) => {
          if (query !== res.data) {
            alert("Maybe you mean: " + res.data);
            return SearchService.search(res.data);
          } else {
            return SearchService.search(query);
          }
        })
        .then(() => {
          this.$router.push("/game-card");
        });
    },
  },
};
</script>
