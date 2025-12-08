<template>
  <section class="edit-component-header">
    <div></div>
    <div class="tab">
      <div
        class="tab-item"
        :class="mainPanel === MainPanel.Component ? 'active-tab-item' : ''"
        @click="toggleShow(MainPanel.Component)"
      >
        <i
          v-bk-tooltips="'UI'"
          class="bkui-vue-wiki-icon icon-component"
        >
        </i>
      </div>
      <div
        class="tab-item"
        :class="mainPanel === MainPanel.Code ? 'active-tab-item' : ''"
        @click="toggleShow(MainPanel.Code)"
      >
        <i 
          v-bk-tooltips="'Code'"
          class="bkui-vue-wiki-icon icon-code"
        >
        </i>
      </div>
    </div>
    <div class="tools-bar">
      <Popover
        theme="dark"
        placement="top"
      >
        <i
          :class="isFullScreen ? 'full-screen' : ''"
          class="bkui-vue-wiki-icon icon-full-screen"
          @click="emit('fullScreen')"
        ></i>
        <template #content>
          <span>全屏</span>
        </template>
      </Popover>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  bkTooltips,
} from 'bkui-vue';

import {
  MainPanel,
} from '@/types/enum';

interface IProps {
  mainPanel: MainPanel;
  isFullScreen?: boolean;
}

defineProps<IProps>();
const emit = defineEmits(['update:mainPanel', 'fullScreen']);

const vBkTooltips = bkTooltips;

const toggleShow = (type: MainPanel) => {
  emit('update:mainPanel', type);
};
</script>

<style lang="postcss" scoped>
.edit-component-header {
  height: 48px;
  background: #FFFFFF;
  box-shadow: 0 1px 6px 0 #DCDEE5;
  /* 为了z-index 生效 */
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;

  .tab {
    display: flex;
    align-items: center;
    justify-self: center;
    height: 32px;
    width: fit-content;
    background-color: #F0F1F5;
    border-radius: 2px;
    padding-left: 4px;
    padding-right: 4px;
    flex-wrap: nowrap;

    .tab-item {
      height: 24px;
      font-size: 16px;
      line-height: 16px;
      text-align: center;
      padding: 4px;
      cursor: pointer;
      white-space: nowrap;
    }

    .active-tab-item {
      color: #3A84FF;
      background-color: #FFF;
    }
  }

  .tools-bar {
    padding: 16px 24px;
    justify-self: end;

    i {
      cursor: pointer;
      padding: 4px;
      font-size: 16px;
      border-radius: 2px;

      &:hover {
        background-color: #F0F1F5;
      }
    }

    .full-screen {
      color: #3A84FF;
    }
  }
}
</style>
