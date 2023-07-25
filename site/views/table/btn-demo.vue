<template>
  <bk-button theme="primary">
    {{ btnText }}
  </bk-button>
</template>

<script>
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {},
    data() {
      return {
        btnText: 'Edit',
      };
    },
    unmounted() {
    },

    methods: {},
  });
</script>
