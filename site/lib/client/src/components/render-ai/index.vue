<template>
  <AIBlueking
    :url="apiUrl"
  />
</template>

<script lang="ts" setup>
import AIBlueking from '@blueking/ai-blueking';
import '@blueking/ai-blueking/dist/vue3/style.css';

const apiUrl = process.env.BK_AI_URL;
</script>
