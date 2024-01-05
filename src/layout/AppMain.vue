<template>
  <section class="app-container">
    <router-view v-slot="{ Component, route }">
      <!-- <transition name="fade-transform" mode="out-in"> -->
      <component :is="Component" :key="route.path" />
      <!-- </transition> -->
    </router-view>
  </section>
</template>
<style lang="scss" scoped>
.app-container {
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  background-color: #f4f4f4;
}
</style>
