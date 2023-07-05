<template>
  <div class="bg-gradient-to-r from-black to-gray-900">
    <main>
      <section class="h-screen flex items-center">
        <div class="container mx-auto px-4">
          <div class="max-w-md mx-auto">
            <div class="bg-white shadow-md rounded-md p-8">
              <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
                Sign In
              </h1>
              <Form @submit="handleLogin" :validation-schema="schema">
                <div class="mb-6">
                  <label
                    for="username"
                    class="block mb-1 text-gray-700 font-semibold"
                  >
                    Username
                  </label>
                  <Field
                    name="username"
                    type="text"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="Username"
                  />
                  <ErrorMessage name="username" class="text-red-500 mt-2" />
                </div>
                <div class="mb-6">
                  <label
                    for="password"
                    class="block mb-1 text-gray-700 font-semibold"
                  >
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" class="text-red-500 mt-2" />
                </div>
                <div>
                  <button
                    class="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
                <div class="mt-6 text-center">
                  <p class="text-gray-600">
                    Don't have an account?
                    <router-link
                      to="/sign-up"
                      class="text-red-600 font-semibold"
                    >
                      Sign Up
                    </router-link>
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import AuthService from "@/services/AuthService.js";

export default {
  name: "LoginView",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
    });
    return {
      loading: false,
      message: "",
      schema,
    };
  },
  methods: {
    handleLogin(user) {
      AuthService.login(user)
        .then((res) => {
          console.log(res);
          this.$router.push({ name: "game-card" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
