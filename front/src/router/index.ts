import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import(".")
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});