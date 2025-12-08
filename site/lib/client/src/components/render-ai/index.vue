<template>
  <AIBlueking
    v-if="apiUrl"
    :url="apiUrl"
    @sdk-error="handleSdkError"
  />
</template>

<script lang="ts" setup>
import AIBlueking from '@blueking/ai-blueking';

import '@blueking/ai-blueking/dist/vue3/style.css';

const apiUrl = process.env.BK_AI_URL;

const handleSdkError = (error: { message: string }) => {
  if (error.message.includes('user authentication failed')) {
    const loginUrl = new URL(process.env.BK_LOGIN_URL);
    loginUrl.searchParams.append('c_url', location.origin);
    location.href = loginUrl.href;
  }
};
</script>
