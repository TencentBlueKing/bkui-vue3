<template>
  {{ props }}
</template>

<script lang="ts" setup>
import type { PropValue } from '@/types/component';

interface IProps {
  props: Record<string, PropValue>;
}

defineProps<IProps>();
</script>
