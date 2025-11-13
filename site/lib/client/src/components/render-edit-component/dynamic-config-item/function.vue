<template>
    <pre class="config-item-func g-scrollbar">
        <code v-html="RenderFunc()"></code>
    </pre>
</template>

<script lang="ts" setup>
import {
  useHighLightJs,
} from '@/hooks/use-highlighjs';
interface IProps {
    modelValue: string;
}
const props = defineProps<IProps>();
const { highlightFactory } = useHighLightJs();
const RenderFunc = () => highlightFactory(
 props.modelValue?.trim() || '--' , 'typescript'
);
</script>

<style lang="postcss" scoped>
.config-item-func {
    font-size: 0;
    padding: 10px;
    border: 1px solid #c4c6cc;
    border-radius: 2px;
    max-height: 200px;
    overflow: auto;
    code {
        font-size: 12px;
    }
}
</style>