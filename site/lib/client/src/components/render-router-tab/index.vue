<template>
  <section
    class="router-tab"
  >
    <router-link
      v-for="router in routers"
      :key="router.to"
      :to="{ name: router.to, query: $route.query, params: $route.params }"
    >
      {{ router.name }}
    </router-link>
  </section>
</template>

<script setup lang="ts">
interface IProps {
  routers: Array<{
    to: string;
    name: string;
  }>;
}

defineProps<IProps>();
</script>

<style lang="postcss" scoped>
.router-tab {
  display: flex;
  background: #FFFFFF;
  box-shadow: 0 3px 3px 0 #0000000f;
  padding: 0 40px;
  a {
    padding-bottom: 13px;
    margin-right: 40px;
    font-size: 14px;
    line-height: 22px;
    color: #313238;
    box-sizing: border-box;
    &.router-link-exact-active {
      color: #3A84FF;
      border-bottom: 3px solid #3A84FF;
    }
  }
}
</style>
