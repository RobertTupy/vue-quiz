import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "task",
      component: () => import("../views/TaskView.vue"),
    },
    {
      path: "/quiz",
      name: "quiz",
      component: () => import("../views/QuizView.vue"),
    },
    {
      path: "/vue-welcome",
      name: "vue-welcome",
      component: () => import("../views/VueWelcome.vue"),
    },
  ],
});

export default router;
