<template>
  <bk-button @click="handleBtnClick(true)">
    Manually set IsShow=true
  </bk-button>
  <bk-button @click="handleBtnClick(false)">
    Manually set IsShow=false
  </bk-button>
  <bk-popover
    trigger="click"
    :is-show="isShow"
    width="450"
    @after-hidden="handleAfterHidden"
  >
    <bk-button> When the mouse clicks </bk-button>
    <template #content>
      <div>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
        <span>Today's weather is good today's weather is good today's weather is good today's
          weather is good today's weather is good today</span>
      </div>
    </template>
  </bk-popover>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const isShow = ref(false);

      const handleBtnClick = (val) => {
        isShow.value = val;
      };

      const handleAfterHidden = (val) => {
        isShow.value = val.isShow;
      };

      return {
        isShow,
        handleBtnClick,
        handleAfterHidden,
      };
    },
  });
</script>
