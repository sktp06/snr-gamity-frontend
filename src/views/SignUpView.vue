<template>
  <div>
    <main>
      <section class="absolute w-full h-full">
        <div
          class="absolute top-0 w-full h-full bg-grey"
          style="background-size: 100%; background-repeat: no-repeat"
        ></div>
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <div
                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-purple-100 border-0"
              >
                <div class="rounded-t mb-0 px-6 py-6">
                  <div class="text-center mb-3">
                    <h1 class="text-gray-600 text-sm font-bold uppercase">
                      Sign Up
                    </h1>
                  </div>
                  <hr class="mt-6 border-b-1 border-gray" />
                </div>
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="relative w-full mb-3">
                    <label
                      class="block uppercase text-gray-700 text-xs font-bold mb-2"
                      for="grid-password"
                      >Username</label
                    >
                    <input
                      type="text"
                      class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      v-model="username"
                      placeholder="Username"
                      style="transition: all 0.15s ease 0s"
                    />
                  </div>
                  <div class="relative w-full mb-3">
                    <label
                      class="block uppercase text-gray-700 text-xs font-bold mb-2"
                      for="grid-password"
                      >Password</label
                    >
                    <input
                      type="password"
                      class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      v-model="password"
                      placeholder="Password"
                      style="transition: all 0.15s ease 0s"
                    />
                  </div>
                  <div class="text-center mt-6">
                    <button
                      @click="signup"
                      class="bg-purple-400 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                      type="submit"
                      style="transition: all 0.15s ease 0s"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- <button @click="signup">Sign Up</button> -->
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
      AuthService.login(user)
        .then((response) => {
          // Handle successful signup
          console.log(response);
          this.$router.push("/login"); // Navigate to the login page
        })
        .catch((error) => {
          // Handle signup error
          console.error(error);
        });
    },
  },
};
</script>
