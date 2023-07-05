<template>
  <div class="bg-gradient-to-r from-black to-gray-900">
    <main>
      <section class="h-screen flex items-center">
        <div class="container mx-auto px-4">
          <div class="max-w-md mx-auto">
            <div class="bg-white bg-opacity-40 shadow-md rounded-md p-8">
              <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
                Sign Up
              </h1>
              <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div class="mb-6">
                  <label
                    for="username"
                    class="block mb-1 text-gray-700 font-semibold"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    v-model="username"
                    placeholder="Username"
                  />
                </div>
                <div class="mb-6">
                  <label
                    for="password"
                    class="block mb-1 text-gray-700 font-semibold"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    v-model="password"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <button
                    @click="signup"
                    class="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>
                <div class="mt-6 text-center">
                  <p class="text-gray-600">
                    Already have an account?
                    <router-link to="/login" class="text-black font-semibold">
                      Sign In
                    </router-link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    signup() {
      const user = {
        username: this.username,
        password: this.password,
      };
      AuthService.register(user)
        .then((response) => {
          console.log(response);
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, #000000, #4a4a4a);
}
</style>
