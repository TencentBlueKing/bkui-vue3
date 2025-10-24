<template>
  <div class="header">
    <div class="header-left">
      <i class="bkui-vue-wiki-icon icon-peizhi"></i>
      <span>配置</span>
    </div>
    <div class="header-right">
      <left-turn-line v-bk-tooltips="{ content: '重置' }" @click="resetToPresetVal"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { LeftTurnLine } from 'bkui-vue/lib/icon';
  import { bkTooltips as vBkTooltips } from 'bkui-vue';

  const emits = defineEmits<{
    (e: 'refresh'): void;
  }>();

  const resetToPresetVal = () => {
    emits('refresh');
  }
</script>

<style lang="postcss" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left, &-right {
      display: flex;
      align-items: center;
      color: #4D4F56;
    }
    &-left {
      font-size: 14px;
      .icon-peizhi {
        margin-right: 8px;
        color: #4D4F56;
      }
      span {
        font-weight: 700;
        line-height: 22px;
      }
    }
    &-right {
      span {
        padding: 6px;
        font-size: 16px;
        cursor: pointer;
      }
      span:last-child:hover {
        background-color: #F0F1F5;
        border-radius: 2px;
      }
    }
  }
</style>
