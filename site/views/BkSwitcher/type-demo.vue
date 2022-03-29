<template>
    <div>
        <bk-switcher v-model="demo1" theme="success" isOutline :pre-check="requestHandler"></bk-switcher>
        <bk-switcher v-model="demo1" size="large" isOutline :pre-check="requestHandler"></bk-switcher>
        <bk-switcher v-model="demo1" size="small" isOutline :pre-check="requestHandler"></bk-switcher>

        <bk-switcher v-model="demo1" theme="success" isOutline show-text :pre-check="requestHandler"></bk-switcher>
        <bk-switcher v-model="demo1" size="large" isOutline show-text :pre-check="requestHandler"></bk-switcher>
        <bk-switcher v-model="demo1" size="small" isOutline show-text :pre-check="requestHandler"></bk-switcher>

        <div class="mt20">
          <bk-switcher v-model="demo1" theme="primary" isSquare :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1" size="large" theme="primary" isSquare :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1" size="small" theme="primary" isSquare :pre-check="requestHandler"></bk-switcher>

          <bk-switcher v-model="demo1" theme="primary" isSquare show-text :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1" size="large" theme="primary" isSquare show-text :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1" size="small" theme="primary" isSquare show-text :pre-check="requestHandler"></bk-switcher>
        </div>


        <div class="mt20">

          <bk-switcher v-model="demo1"  isSquare isOutline :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1" size="large" isSquare isOutline :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1" size="small" isSquare isOutline :pre-check="requestHandler"></bk-switcher>

          <bk-switcher v-model="demo1"  isSquare isOutline show-text :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1"  isSquare isOutline show-text :pre-check="requestHandler"></bk-switcher>
          <bk-switcher v-model="demo1"  isSquare isOutline show-text :pre-check="requestHandler"></bk-switcher>
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
    const demo1 = ref(true)
    const requestHandler = (lastValue) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(lastValue)
                resolve()
            }, 1000)
        })
    }
        
    return {
      demo1,
      requestHandler
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