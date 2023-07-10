import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import BookmarkView from "../views/BookmarkView.vue";
import GameCardView from "../views/GameCardView.vue";
import UpComingGameView from "../views/UpComingGameView.vue";
import DataManagementView from "../views/DataManagementView.vue";
import ErrorPage from "../views/ErrorPage.vue";

const routes = [
  {
    path: "/404",
    name: "404",
    component: ErrorPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUpView,
  },
  {
    path: "/bookmark",
    name: "bookmark",
    component: BookmarkView,
    meta: { requiresAuth: true, allowedRoles: ["user"] },
  },
  {
    path: "/home",
    name: "game-card",
    component: GameCardView,
    meta: { requiresAuth: true, allowedRoles: ["admin", "user"] },
  },
  {
    path: "/upcoming-game",
    name: "upcoming",
    component: UpComingGameView,
    meta: { requiresAuth: true, allowedRoles: ["admin", "user"] },
  },
  {
    path: "/data-management",
    name: "data-management",
    component: DataManagementView,
    meta: { requiresAuth: true, allowedRoles: ["admin"] },
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  if (!requiresAuth) {
    // Route doesn't require authentication, allow access
    next();
  } else {
    // Route requires authentication
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      // User not logged in, redirect to login page
      next("/login");
    } else {
      // User logged in, check role
      const allowedRoles = to.meta.allowedRoles;
      if (allowedRoles.includes(user.role)) {
        // User has the required role, allow access
        next();
      } else {
        // User doesn't have the required role, redirect to login page
        next("/404");
      }
    }
  }
});

export default router;
