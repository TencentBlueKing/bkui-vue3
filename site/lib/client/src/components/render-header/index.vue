<template>
  <h3
    class="wiki-title"
  >
    {{ props.title }}
    {{ props.titleCN }}
  </h3>
  <h5
    class="wiki-description"
  >
    {{ props.description }}
  </h5>
</template>

<script lang="ts" setup>
interface IProps {
  title: string;
  titleCN: string;
  description: string;
}

const props = defineProps<IProps>();
</script>

<style lang="postcss" scoped>
.wiki-title {
  padding: 16px 16px 11px 40px;
  font-weight: 600;
  font-size: 32px;
  line-height: 45px;
  color: #000000;
  background: #fff;
}
.wiki-description {
  padding: 0 16px 17px 40px;
  font-size: 14px;
  color: #313238;
  line-height: 22px;
  background: #fff;
}
</style>