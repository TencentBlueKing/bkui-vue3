<template>
  <div>
    <bk-switcher
      v-model="demo1"
      theme="success"
      is-outline
      :pre-check="requestHandler"
    />
    <bk-switcher
      v-model="demo1"
      size="large"
      is-outline
      :pre-check="requestHandler"
    />
    <bk-switcher
      v-model="demo1"
      size="small"
      is-outline
      :pre-check="requestHandler"
    />

    <bk-switcher
      v-model="demo1"
      theme="success"
      is-outline
      show-text
      :pre-check="requestHandler"
    />
    <bk-switcher
      v-model="demo1"
      size="large"
      is-outline
      show-text
      :pre-check="requestHandler"
    />
    <bk-switcher
      v-model="demo1"
      size="small"
      is-outline
      show-text
      :pre-check="requestHandler"
    />

    <div class="mt20">
      <bk-switcher
        v-model="demo1"
        theme="primary"
        is-square
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        size="large"
        theme="primary"
        is-square
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        size="small"
        theme="primary"
        is-square
        :pre-check="requestHandler"
      />

      <bk-switcher
        v-model="demo1"
        theme="primary"
        is-square
        show-text
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        size="large"
        theme="primary"
        is-square
        show-text
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        size="small"
        theme="primary"
        is-square
        show-text
        :pre-check="requestHandler"
      />
    </div>


    <div class="mt20">
      <bk-switcher
        v-model="demo1"
        is-square
        is-outline
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        size="large"
        is-square
        is-outline
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        size="small"
        is-square
        is-outline
        :pre-check="requestHandler"
      />

      <bk-switcher
        v-model="demo1"
        is-square
        is-outline
        show-text
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        is-square
        is-outline
        show-text
        :pre-check="requestHandler"
      />
      <bk-switcher
        v-model="demo1"
        is-square
        is-outline
        show-text
        :pre-check="requestHandler"
      />
    </div>
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
    const demo1 = ref(true);
    const requestHandler = lastValue => new Promise((resolve) => {
      setTimeout(() => {
        console.log(lastValue);
        resolve();
      }, 1000);
    });

    return {
      demo1,
      requestHandler,
    };
  },
});

</script>


<style scoped>
  .bk-switcher {
    margin-right: 10px;
  }
  .mt20 {
    margin-top: 20px
  }
</style>
