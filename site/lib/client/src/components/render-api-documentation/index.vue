<template>
  <section class="documentation-component g-scrollbar">
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
          />
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
              />
            </section>
          </template>
        </section>
      </article>

      <!-- 底部留白 -->
      <div style="height: 0.5px;" />
    </main>

    <!-- 侧边导航栏 -->
    <aside class="sidebar">
      <nav>
        <ul class="nav-list">
          <li
            v-for="item in navItems"
            :key="item.id"
            @click="
              () => {
                removeStorage(ANCHOR_KEY);
              }
            "
          >
            <a
              :href="`#${item.id}`"
              class="nav-link"
              :class="{ active: activeAnchor === `${item.id}` }"
            >
              {{ item.title }}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { capitalizeWord } from '@/common/util';
import useStorage from '@/hooks/use-storage';
import { IComponentWiki } from '@/types/component';
import { ANCHOR_KEY } from '@/types/contants';

import RenderTable from './render-table/index.vue';

interface IProps {
  componentWiki: IComponentWiki;
  activeComponent: IComponentWiki | null;
}
const props = defineProps<IProps>();

// 路由相关
const route = useRoute();
// 存储方法
const { removeStorage } = useStorage();

// 分类关键字
const categoryKeyword = {
  props: '属性',
  emits: '事件',
  slots: '插槽',
};

// 组件基础类型映射
const componentBaseTypes = [
  { key: 'props', categoryKey: categoryKeyword.props },
  { key: 'emits', categoryKey: categoryKeyword.emits },
  { key: 'slots', categoryKey: categoryKeyword.slots },
];

// 侧边栏默认激活第一项
const activeAnchor = ref(`${props.activeComponent.name}${capitalizeWord(componentBaseTypes[0].key)}`);

// 子组件配置
const childrenConfigs = computed(() => props.componentWiki.children ?? []);

// 计算导航项数据
const navItems = computed(() => {
  const items: { id: string; title: string }[] = [];
  // 处理主组件的props/emits/slots
  Object.keys(categoryKeyword).forEach((key) => {
    if (props.componentWiki[key]?.length) {
      items.push({
        id: `${props.activeComponent.name}${capitalizeWord(key)}`,
        title: `${props.componentWiki.title} ${categoryKeyword[key]}`,
      });
    }
  });
  // 处理types类型定义
  if (props.componentWiki.types?.length) {
    props.componentWiki.types.forEach((item) => {
      items.push({ id: item.name, title: item.name });
    });
  }
  // 处理子组件的配置
  if (childrenConfigs.value.length) {
    childrenConfigs.value.forEach((child) => {
      Object.keys(categoryKeyword).forEach((key) => {
        if (child[key]?.length) {
          items.push({
            id: `${child.name}${capitalizeWord(key)}`,
            title: `${child.name} ${categoryKeyword[key]}`,
          });
        }
      });
    });
  }
  return items;
});

watch(
  route,
  (newRoute) => {
    activeAnchor.value = newRoute.hash?.replace('#', '') || `${props.activeComponent.name}${capitalizeWord(componentBaseTypes[0].key)}`;
  },
  { deep: true },
);
</script>

<style lang="postcss" scoped>
  .documentation-component {
    display: flex;
    width: 100%;
    height: calc(100% - 149px);
    gap: 24px;
    overflow: auto;
    scroll-behavior: smooth;
    padding: 24px 8px 32px 40px;
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

  /* 侧边栏样式 */
  .sidebar {
    width: 146px;
    position: sticky;
    top: 20px;
    max-height: 100%;
    overflow-y: auto;
  }

  .nav-list {
    list-style: none;
    padding: 8px 0 4px 0;
    margin: 0;
    border-left: 1px solid #dcdee5;
  }

  .nav-link {
    display: block;
    color: #313238;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    padding-left: 16px;
    margin-bottom: 8px;
  }

  .nav-link:hover {
    color: #1976d2;
    background-color: #f5f7fa;
  }

  .nav-link.active {
    color: #1976d2;
    font-weight: 500;
    /* background-color: #f0f7ff; */
  }

  .nav-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 16px;
    width: 2px;
    background-color: #3a84ff;
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
