<template>
  <section class="documentation-component">
    <!-- 主内容区域 -->
    <main class="content">
      <!-- 主组件配置 -->
      <article
        v-for="config in componentBaseTypes"
        :key="config.key"
      >
        <section
          v-if="componentWiki[config.key]?.length"
          :id="`${activeComponent.name}${capitalizeWord(config.key)}`"
          class="table-container"
        >
          <render-table
            :table-data="componentWiki[config.key]"
            :component-key="componentWiki.title"
            :category-key="config.categoryKey"
            :active-component="activeComponent"
            :id="`${activeComponent.name}${capitalizeWord(config.key)}`"
          />
        </section>
      </article>

      <!-- 子组件配置 -->
      <article
        v-for="child in childrenConfigs"
        :key="child.name"
      >
        <section class="child-component-section">
          <template
            v-for="config in componentBaseTypes"
            :key="`${child.name}-${config.key}`"
          >
            <section
              v-if="child[config.key]?.length"
              :id="`${child.name}${capitalizeWord(config.key)}`"
              class="table-container"
            >
              <render-table
                :table-data="child[config.key]"
                :component-key="child.name"
                :category-key="config.categoryKey"
                :active-component="activeComponent"
                :id="`${child.name}${capitalizeWord(config.key)}`"
              />
            </section>
          </template>
        </section>
      </article>

      <!-- Types类型定义 -->
      <article v-if="componentWiki.types?.length">
        <section
          v-for="type in componentWiki.types"
          :key="type.name"
          :id="`${type.name}`"
          class="type-section"
        >
          <render-table
            :table-data="type.fields"
            :category-key="type.name"
            :category-key-desc="type.description"
            :active-component="activeComponent"
            :id="`${type.name}`"
          />
        </section>
      </article>

      <!-- 底部留白 -->
      <div style="height: 0.5px;" />
    </main>

    <!-- 侧边导航栏 -->
    <render-side-navigation
      :nav-items="navItems"
      :handle-item-click="() => {
        removeStorage(ANCHOR_KEY);
      }"
      container-class-name=".documentation-container"
    />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { capitalizeWord } from '@/common/util';
import useStorage from '@/hooks/use-storage';
import {  IComponentWiki } from '@/types/component';
import { ANCHOR_KEY } from '@/types/contants';

import RenderSideNavigation from '../render-side-navgation/index.vue';

import RenderTable from './render-table/index.vue';


interface IProps {
  componentWiki: IComponentWiki;
  activeComponent: IComponentWiki | null;
}
const props = defineProps<IProps>();

// 存储方法
const { removeStorage } = useStorage();

// 分类关键字
const categoryKeyword = {
  props: '属性',
  emits: '事件',
  slots: '插槽',
  exposes: 'Exposes',
};

// 组件基础类型映射
const componentBaseTypes: { key: keyof typeof categoryKeyword, categoryKey: string }[] = [
  { key: 'props', categoryKey: categoryKeyword.props },
  { key: 'emits', categoryKey: categoryKeyword.emits },
  { key: 'slots', categoryKey: categoryKeyword.slots },
  { key: 'exposes', categoryKey: categoryKeyword.exposes },
];

// 子组件配置
const childrenConfigs = computed(() => props.componentWiki.children ?? []);

// 计算导航项数据
const navItems = computed(() => {
  const items: { id: string; title: string }[] = [];
  // 处理主组件的props/emits/slots
  Object.keys(categoryKeyword).forEach((key) => {
    if (props.componentWiki[key as keyof IComponentWiki]?.length) {
      items.push({
        id: `${props.activeComponent.name}${capitalizeWord(key)}`,
        title: `${props.componentWiki.title} ${categoryKeyword[key as keyof typeof categoryKeyword]}`,
      });
    }
  });
  // 处理子组件的配置
  if (childrenConfigs.value.length) {
    childrenConfigs.value.forEach((child) => {
      Object.keys(categoryKeyword).forEach((key) => {
        if (child[key as keyof typeof child]?.length) {
          items.push({
            id: `${child.name}${capitalizeWord(key)}`,
            title: `${child.name} ${categoryKeyword[key as keyof typeof categoryKeyword]}`,
          });
        }
      });
    });
  }
  // 处理types类型定义
  if (props.componentWiki.types?.length) {
    props.componentWiki.types.forEach((item) => {
      items.push({ id: item.name, title: item.name });
    });
  }
  return items;
});
</script>

<style lang="postcss" scoped>
  .documentation-component {
    display: flex;
    width: 100%;
    gap: 24px;
  }


  /* 子组件样式 */
  .child-component-section {
    margin-top: 40px;
    padding-top: 20px;
  }

  .child-component-title {
    font-size: 18px;
    font-weight: 600;
    color: #313238;
    margin-bottom: 20px;
  }

  /* 主内容区域样式 */
  .content {
    flex: 1;
    height: 100%;
  }

  .content-section {
    margin-bottom: 48px;
  }

  .section-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eaecef;
    color: #2c3e50;
  }

  .section-content {
    color: #455a64;
    line-height: 1.7;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .documentation-container {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      position: relative;
      margin-bottom: 20px;
      max-height: none;
    }
  }
</style>
