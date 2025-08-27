<template>
  <section class="edit-component-config">
    <DynamicConfigItem
      v-for="prop in props.props"
      :key="prop.name"
      :type="prop.type"
      :model-value="renderProps[prop.name]"
      @update:model-value="(value) => handleUpdateProps(prop.name, value)"
    />
  </section>
</template>

<script lang="ts" setup>
import type {
  IComponentWiki,
  PropValue,
} from '@/types/component';

import DynamicConfigItem from './dynamic-config-item';

interface IProps {
  props: IComponentWiki['props'];
  presetProps: IComponentWiki['presets'][number]['props'];
  renderProps: IComponentWiki['presets'][number]['props'];
}
interface IEmits {
  (e: 'update:renderProps', value: IComponentWiki['presets'][number]['props']): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const handleUpdateProps = (name: string, value: PropValue) => {
  emits(
    'update:renderProps',
    {
      ...props.renderProps,
      [name]: value,
    },
  );
};
</script>

<style lang="postcss" scoped>
.edit-component-config {
  background: #FFFFFF;
  box-shadow: -1px 0 0 0 #DCDEE5;
  height: 100%;
}
</style>
