<template>
  <bk-button @click="handleBtnClick(true)">
    手动设置IsShow = true
  </bk-button>
  <bk-button @click="handleBtnClick(false)">
    手动设置IsShow = false
  </bk-button>
  <bk-popover
    trigger="click"
    :is-show="isShow"
    width="450"
    @after-hidden="handleAfterHidden"
  >
    <bk-button>
      当鼠标点击
    </bk-button>
    <template #content>
      <div>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>
        <span>今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错 今天天气不错</span>
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
        isShow.value  = val.isShow;
      };

      return {
        isShow,
        handleBtnClick,
        handleAfterHidden,
      };
    },
  });
</script>
