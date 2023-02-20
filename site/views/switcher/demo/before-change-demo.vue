<template>
  <div>
    <bk-switcher
      v-model="loadingDemo"
      :before-change="requestHandler"
    />
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  import BkSwitcher from '@bkui-vue/switcher';

  export default defineComponent({
    name: 'SiteBkSwitcher',
    components: {
      BkSwitcher,
    },
    setup() {
      const loadingDemo = ref(true);
      const requestHandler = lastValue => new Promise((resolve) => {
        setTimeout(() => {
          console.log(lastValue);
          resolve();
        }, 3000);
      });

      return {
        loadingDemo,
        requestHandler,
      };
    },
  });

</script>
