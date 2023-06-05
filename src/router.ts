import Home from "./components/Home.vue";
import Login from "./page/Login.vue";
import Faq from "./page/Faq.vue";
import Stats from "./page/Stats.vue";
import Register from "./page/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import { useCookies } from "vue3-cookies";
import {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
  createRouter,
  createWebHistory,
} from "vue-router";
import Dns from "./components/Dns.vue";
import EmailVerify from "./page/EmailVerify.vue";
import Success from "./page/Success.vue";
import Failure from "./page/Failure.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/faq",
    component: Faq,
  },
  {
    path: "/stats",
    component: Stats,
  },
  {
    path: "/success",
    component: Success,
  },
  {
    path: "/failure",
    component: Failure,
  },
  {
    path: "/login",
    component: Login,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      const { cookies } = useCookies();
      const authrouter0 = cookies.get("authrouter0");

      if (authrouter0) {
        next("/dashboard"); // Redirect to dashboard if user is authenticated
      } else {
        next(); // Proceed to login page if user is not authenticated
      }
    },
  },
  {
    path: "/register",
    component: Register,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      const { cookies } = useCookies();
      const authrouter0 = cookies.get("authrouter0");

      if (authrouter0) {
        next("/dashboard"); // Redirect to dashboard if user is authenticated
      } else {
        next(); // Proceed to register page if user is not authenticated
      }
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      const { cookies } = useCookies();
      const authrouter0 = cookies.get("authrouter0");

      if (authrouter0) {
        next(); // Proceed to dashboard if user is authenticated
      } else {
        next("/login"); // Redirect to login page if user is not authenticated
      }
    },
  },
  {
    path: "/emailverify",
    component: EmailVerify,
    props: (route: any) => ({ email: route.query.email }),
  },
  {
    path: "/dns",
    component: Dns,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      const { cookies } = useCookies();
      const authrouter0 = cookies.get("authrouter0");

      if (authrouter0) {
        next(); // Proceed to dashboard if user is authenticated
      } else {
        next("/login"); // Redirect to login page if user is not authenticated
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
