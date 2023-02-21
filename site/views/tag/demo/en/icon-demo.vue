<template>
  <div>
    <bk-tag>
      <template #icon>
        <bk />
      </template>
      BlueKing
    </bk-tag>
    <bk-tag>
      <template #icon>
        <weixin />
      </template>
      WeChat
    </bk-tag>
    <bk-tag>
      <template #icon>
        <qq />
      </template>
      QQ
    </bk-tag>
  </div>
</template>

<script>
  import { Bk, Qq, Weixin } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      Bk,
      Qq,
      Weixin,
    },
    setup() {
      return {};
    },
  });
</script>
