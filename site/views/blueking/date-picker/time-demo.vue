<template>
  <date-picker
    v-model="recent"
    class="common-picker"
  />
  <date-picker
    v-model="future"
    class="common-picker"
  />
  <date-picker
    v-model="natural"
    class="common-picker"
  />
  <date-picker
    v-model="range"
    class="common-picker"
  />
  <date-picker
    v-model="range2"
    class="common-picker"
  />
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import DatePicker from '@blueking/date-picker';

  import '@blueking/date-picker/dist/vue3-light.css';
  const recent = ref(['now-2d', 'now']);
  const future = ref(['now', 'now+2d']);
  const natural = ref(['now-1w/w', 'now-1w/w']);
  const range = ref(['2024-03-11 00:20:00', 'now']);
  const range2 = ref(['2024-03-11 00:20:00', '2024-06-11 00:20:00']);
</script>
<style>
.common-picker {
  margin: 0 10px
}
</style>
