<template>
  <section class="edit-component-presets">
    预设场景
  </section>
</template>

<script lang="ts" setup>
import type {
  IComponentWiki,
} from '@/types/component';

interface IProps {
  presets: IComponentWiki['presets'];
  index: number;
}
interface IEmits {
  (e: 'choose', value: IComponentWiki['presets'][number]): void;
}

defineProps<IProps>();
defineEmits<IEmits>();
</script>

<style lang="postcss" scoped>
.edit-component-presets {
  background: #FFFFFF;
  box-shadow: 1px 0 0 0 #DCDEE5;
  height: 100%;
}
</style>
