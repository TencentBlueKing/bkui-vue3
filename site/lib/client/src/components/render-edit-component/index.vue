<template>
  <bk-loading
    :loading="loading"
    :z-index="100"
    class="edit-component"
  >
    <template v-if="!loading">
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
                v-model:render-slots="renderSlots"
                :preset-props="componentWiki.presets[renderPresetIndex].props"
                :props="componentWiki.props"
                :types="componentWiki.types"
                :preset-slots="componentWiki.presets[renderPresetIndex].slots"
                :slots="componentWiki.slots"
              />
            </template>
            <template #main>
              <section
                class="edit-component-view"
                :key="JSON.stringify(renderProps)"
              >
                <render-component
                  v-if="mainPanel === MainPanel.Component"
                  class="edit-component-component"
                  :name="componentWiki.name"
                  :group="componentWiki.group"
                  :template="componentWiki.presets[renderPresetIndex].template"
                  :component="component"
                  :render-props="renderProps"
                  :render-slots="renderSlots"
                  :dependent-components="dependentComponents"
                />
                <render-code
                  v-if="mainPanel === MainPanel.Code"
                  class="edit-component-code"
                  :index="renderPresetIndex"
                  :component-wiki="componentWiki"
                  :render-props="renderProps"
                  :render-slots="renderSlots"
                />
              </section>
            </template>
          </bk-resize-layout>
        </template>
      </bk-resize-layout>
    </template>
  </bk-loading>
</template>

<script lang="ts" setup>
import {
  Loading as BkLoading,
  ResizeLayout as bkResizeLayout,
} from 'bkui-vue';
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
  shallowRef,
} from 'vue';

import RenderComponent from '@/components/render-component';
import {
  getComponent,
} from '@/http/api';
import {
  useComponent,
} from '@/store/component';
import type {
  IComponentWiki,
} from '@/types/component';
import {
  MainPanel,
} from '@/types/enum';

import RenderCode from './code/index.vue';
import RenderConfig from './config/index.vue';
import RenderHeader from './header.vue';
import RenderPresets from './presets.vue';

interface IProps {
  component: object;
  componentWiki: IComponentWiki;
  loading: boolean;
}

const props = defineProps<IProps>();

const componentStore = useComponent();

// 用于渲染配置
const renderProps = ref<IComponentWiki['presets'][number]['props']>();
const renderSlots = ref<IComponentWiki['presets'][number]['slots']>();
const dependentComponents = shallowRef<Record<string, unknown>>({});
// 依赖组件缓存，避免重复加载
const dependentComponentsCache = ref<Record<string, unknown>>({});
// 选中的预设索引
const renderPresetIndex = ref(0);
// 展示的主面板
const mainPanel = ref<MainPanel>(MainPanel.Component);
const isFullScreen = ref(false);

const trimSlots = (slots: IComponentWiki['presets'][number]['slots']) => {
  const newPresetSlots = {} as IComponentWiki['presets'][number]['slots']
  for (const key of Object.keys(slots)) {
    newPresetSlots[key] = slots[key].trim()
  }
  return newPresetSlots
}

// 选择预设
const handleChoosePreset = async (preset: IComponentWiki['presets'][number]) => {
  renderProps.value = JSON.parse(JSON.stringify(preset.props ?? {}));
  renderSlots.value = trimSlots(preset.slots  || {});
  renderPresetIndex.value = props.componentWiki.presets.indexOf(preset);

  // 处理依赖组件
  if (preset.dependent?.components && preset.dependent.components.length > 0) {
    const components: Record<string, unknown> = {};
    const componentsToLoad: string[] = [];

    // 检查哪些组件需要加载（未缓存的）
    preset.dependent.components.forEach((componentName: string) => {
      if (dependentComponentsCache.value[componentName]) {
        // 从缓存中获取
        components[componentName] = dependentComponentsCache.value[componentName];
      } else {
        // 需要加载
        componentsToLoad.push(componentName);
      }
    });

    // 只加载未缓存的组件
    if (componentsToLoad.length > 0) {
      await Promise.all(componentsToLoad.map(async (componentName: string) => {
        try {
          await getComponent(componentName, componentStore.version, 'component');
          const comp = window.getComponent();
          if (comp) {
            // 存入缓存（保存整个组件对象，包括子组件）
            dependentComponentsCache.value[componentName] = comp;
            // 添加到当前组件列表
            components[componentName] = comp;
          }
        } catch (error) {
          console.error(`Failed to load dependent component: ${componentName}`, error);
        }
      }));
    }

    dependentComponents.value = components;
  } else {
    dependentComponents.value = {};
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullScreen.value = !!document.fullscreenElement;
};

// 全屏
const handleFullScreen = () => {
  if (!isFullScreen.value) {
    document.querySelector('.edit-component')?.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

watch(
  () => props.componentWiki,
  () => {
    // 切换组件时清空依赖组件缓存
    dependentComponentsCache.value = {};
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
  height: calc(100% - 180px);
  min-height: 640px;
  background: #FAFBFD;
  box-shadow: 0 2px 4px 0 #1919290d;
}

.edit-component-body {
  height: calc(100% - 48px);
  border: none;
}

.edit-component-main {
  height: 100%;
}

.edit-component-view {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: auto;
  background: #f3f3fa;

  .bk-cascader-wrapper, .bk-slider {
    width: 200px;
  }

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
