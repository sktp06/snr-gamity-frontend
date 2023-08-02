import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import GStore from "./store";
import "./assets/tailwind.css";
import "@/services/AxiosInterceptorSetup.js";
import "@fortawesome/fontawesome-free/css/all.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const app = createApp(App);

app.use(VueSweetalert2);

app.provide("GStore", GStore).use(router).mount("#app");
