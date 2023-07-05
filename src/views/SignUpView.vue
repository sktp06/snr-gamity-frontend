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
              <Form
                @submit="signup"
                :validation-schema="schema"
                class="flex-auto px-4 lg:px-10 py-10 pt-0"
              >
                <div class="mb-6">
                  <label
                    for="username"
                    class="block mb-1 text-gray-700 font-semibold"
                  >
                    Username
                  </label>
                  <Field
                    name="username"
                    v-model="username"
                    type="text"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="Username"
                  />
                  <ErrorMessage name="username" class="text-red-900" />
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
                    v-model="password"
                    type="password"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" class="text-red-900" />
                </div>
                <div class="mb-6">
                  <label
                    for="confirmPassword"
                    class="block mb-1 text-gray-700 font-semibold"
                  >
                    Confirm Password
                  </label>
                  <Field
                    name="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage name="confirmPassword" class="text-red-900" />
                </div>
                <div>
                  <button
                    type="submit"
                    class="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none"
                  >
                    Sign Up
                  </button>
                </div>
                <div class="mt-6 text-center">
                  <p class="text-gray-600">
                    Already have an account?
                    <router-link to="/login" class="text-red-900 font-semibold">
                      Sign In
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
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      schema: yup.object().shape({
        username: yup.string().required("Username is required!"),
        password: yup.string().required("Password is required!"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required!"),
      }),
    };
  },
  methods: {
    signup() {
      if (this.password !== this.confirmPassword) {
        console.error("Passwords do not match.");
        return;
      }

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
