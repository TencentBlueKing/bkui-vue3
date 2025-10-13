<template>
  <section class="edit-component" ref="componentRef">
    <render-header
      v-model:main-panel="mainPanel"
      :component-wiki="componentWiki"
      :is-full-screen="isFullScreen"
      @full-screen="handleFullScreen"
    />
    <bk-resize-layout
      collapsible
      initial-divide="160px"
      class="edit-component-body"
      :min="160"
      :max="400"
    >
      <template #aside>
        <render-presets
          :presets="componentWiki.presets"
          :index="renderPresetIndex"
          @choose="handleChoosePreset"
        />
      </template>
      <template #main>
        <bk-resize-layout
          :border="false"
          :min="288"
          :max="500"
          initial-divide="288px"
          placement="right"
          class="edit-component-main"
        >
          <template #aside>
            <render-config
              v-model:render-props="renderProps"
              :preset-props="componentWiki.presets[renderPresetIndex].props"
              :props="componentWiki.props"
            />
          </template>
          <template #main>
            <section
              class="edit-component-view"
              :key="componentWiki.name"
            >
              <render-component
                v-if="mainPanel === MainPanel.Component"
                class="edit-component-component"
                :component="component"
                :render-props="renderProps"
                :render-slots="renderSlots"
              />
              <render-code
                v-if="mainPanel === MainPanel.Code"
                class="edit-component-code"
                :component-wiki="componentWiki"
                :render-props="renderProps"
                :render-slots="renderSlots"
              />
            </section>
          </template>
        </bk-resize-layout>
      </template>
    </bk-resize-layout>
  </section>
</template>

<script lang="ts" setup>
import {
  ResizeLayout as bkResizeLayout,
} from 'bkui-vue';
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';

import RenderComponent from '@/components/render-component';
import type {
  IComponentWiki,
} from '@/types/component';
import {
  MainPanel,
} from '@/types/enum';

import RenderCode from './code.vue';
import RenderConfig from './config.vue';
import RenderHeader from './header.vue';
import RenderPresets from './presets.vue';

interface IProps {
  component: object;
  componentWiki: IComponentWiki;
}

const props = defineProps<IProps>();

// 用于渲染配置
const renderProps = ref<IComponentWiki['presets'][number]['props']>();
const renderSlots = ref<IComponentWiki['presets'][number]['slots']>();
// 选中的预设索引
const renderPresetIndex = ref(0);
// 展示的主面板
const mainPanel = ref<MainPanel>(MainPanel.Component);
const componentRef = ref<HTMLElement>();
const isFullScreen = ref(false);

// 选择预设
const handleChoosePreset = (preset: IComponentWiki['presets'][number]) => {
  renderProps.value = JSON.parse(JSON.stringify(preset.props));
  renderSlots.value = JSON.parse(JSON.stringify(preset.slots || {}));
  renderPresetIndex.value = props.componentWiki.presets.indexOf(preset);
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
};
// 全屏
const handleFullScreen = () => {
  if (!isFullScreen.value) {
    componentRef.value.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

watch(
  () => props.componentWiki,
  () => {
    handleChoosePreset(props.componentWiki.presets[0]);
    mainPanel.value = MainPanel.Component;
  },
  {
    immediate: true,
  },
);

// 初始化时注册事件监听
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style lang="postcss" scoped>
.edit-component {
  height: calc(100% - 120px);
  background: #FAFBFD;
  box-shadow: 0 2px 4px 0 #1919290d;
}

.edit-component-body {
  height: calc(100% - 48px);
}

.edit-component-main {
  height: 100%;
}

.edit-component-view {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: auto;
  padding: 24px;

  .edit-component-component {
    align-self: center;
    margin: 0 auto;
  }

  .edit-component-code {
    width: 100%;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: #dcdee5;

    &:hover {
      background-color: #979ba5;
    }
  }
}
</style>
