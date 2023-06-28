import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import HomeView from "../views/HomeView.vue";
import BookmarkView from "../views/BookmarkView.vue";
import GameCardView from "../views/GameCardView.vue";
import BookmarkService from "@/services/BookmarkService";
import UpComingGameView from "../views/UpComingGameView.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUpView,
  },
  { path: "/:pathMatch(.*)*", redirect: "/sign-up" },
  {
    path: "/bookmark",
    name: "bookmark",
    component: BookmarkView,
    beforeEnter: () => {
      BookmarkService.getbookmarkList(
        JSON.parse(localStorage.getItem("user")).id
      );
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/bookmark" },
  {
    path: "/game-card",
    name: "game-card",
    component: GameCardView,
  },
  { path: "/:pathMatch(.*)*", redirect: "/game-card" },
  {
    path: "/upcoming-game",
    name: "upcoming",
    component: UpComingGameView,
  },
  { path: "/:pathMatch(.*)*", redirect: "/upcoming-game" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
