<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const selectedMenu = computed(() => [route.name]);
</script>

<template>
  <a-layout>
    <a-layout-header>
      <a-menu :selected-keys="selectedMenu" mode="horizontal" theme="dark">
        <nav>
          <a-menu-item key="task">
            <RouterLink to="/">Task</RouterLink>
          </a-menu-item>
        </nav>
        <nav>
          <a-menu-item key="quiz">
            <RouterLink to="/quiz">Quiz</RouterLink>
          </a-menu-item>
        </nav>
        <nav>
          <a-menu-item key="vue-welcome"
            ><RouterLink to="/vue-welcome">Vue Welcome</RouterLink></a-menu-item
          >
        </nav>
      </a-menu>
    </a-layout-header>
    <a-layout-content>
      <RouterView />
    </a-layout-content>
    <a-layout-footer class="disclaimer">
      <span
        >created by Robert Tupý as
        <img
          alt="Vue"
          class="logo"
          src="@/assets/logo.svg"
          width="25"
          height="25"
        />
        learning project</span
      ></a-layout-footer
    >
  </a-layout>
</template>

<style scoped>
.disclaimer {
  text-align: center;
}
</style>
