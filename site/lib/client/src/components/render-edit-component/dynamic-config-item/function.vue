<template>
    <pre class="config-item-func g-scrollbar">
        <code v-html="RenderFunc"></code>
    </pre>
</template>

<script lang="ts" setup>
import {
  useHighLightJs,
} from '@/hooks/use-highlighjs';
import {
  formatCodeIndent,
} from '../code/parser/script/script-parser';
import type {
  CodeLanguages,
} from '@/types/component';
import { computed } from 'vue';
interface IProps {
    modelValue: string;
    activeLanguage: CodeLanguages;
}
const props = defineProps<IProps>();
const { highlightFactory } = useHighLightJs();
const RenderFunc = computed(() => {
    const isTypeScript = props.activeLanguage === 'typescript';
    return highlightFactory(
        formatCodeIndent(props.modelValue, 2, isTypeScript) || '--' , 'typescript'
    );
})
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