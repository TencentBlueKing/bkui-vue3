<template>
  <h3
    class="wiki-title"
  >
    <span class="wiki-title-text">
      {{ props.title }}
      {{ props.titleCN }}
    </span>
    <span class="wiki-title-tags">
      <a
        v-for="tag in tags"
        :key="tag.name"
        :href="tag.url"
        target="_blank"
        class="wiki-title-tag"
      >
        <i :class="tag.icon"></i>
        <span>{{ tag.name }}</span>
      </a>
    </span>
  </h3>
  <h5
    class="wiki-description"
    v-bind="$attrs"
  >
    {{ props.description }}
  </h5>
</template>

<script lang="ts" setup>
import {
  computed,
} from 'vue';
import { useRoute } from 'vue-router';

import {
  useComponent,
} from '@/store/component';

interface IProps {
  title: string;
  titleCN?: string;
  description: string;
}

const props = defineProps<IProps>();

const route = useRoute();

const componentStore = useComponent();

const noTagComponents = computed(() => {
  return componentStore.navGroups?.startList.map(item => item.name);
});

const customComponents = computed(() => {
  return componentStore.navGroups?.customComponentList.map(item => item.name);
});

const directiveComponents = computed(() => {
  return componentStore.navGroups?.directiveList.map(item => item.name);
});

// MCP tag
const createMcpTag = () => {
  return process.env.BK_MCP ? [
    {
      icon: 'bkui-vue-wiki-icon icon-mcp',
      name: 'MCP',
      url: process.env.BK_MCP,
    },
  ] : [];
};

const tags = computed(() => {
  const componentName = route.params.name as string;

  if (!componentStore.navGroups) return [];

  // 1. 如果是noTag组件，不显示tags
  if (noTagComponents.value.includes(componentName)) {
    return createMcpTag();
  }

  // 2. 如果是custom组件，显示npm地址
  if (customComponents.value.includes(componentName)) {
    return [
      {
        icon: 'bkui-vue-wiki-icon icon-npm',
        name: 'NPM',
        url: `https://www.npmjs.com/package/${componentName}`,
      },
      ...createMcpTag(),
    ];
  }

  // 3. 其他情况，Github链接
  const getGithubUrl = () => {
    return `https://github.com/TencentBlueKing/bkui-vue3/tree/staging/packages/${directiveComponents.value.includes(componentName) ? 'directives/src' : componentName}`;
  };

  return [
    {
      icon: 'bkui-vue-wiki-icon icon-github',
      name: 'Github',
      url: getGithubUrl(),
    },
    ...createMcpTag(),
  ];
});
</script>

<style lang="postcss" scoped>
.wiki-title {
  padding: 16px 16px 11px 40px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .wiki-title-text {
    line-height: 45px;
    font-size: 32px;
    font-weight: 600;
    color: #000000;
  }
  .wiki-title-tag {
    line-height: 12px;
    font-size: 14px;
    color: #313238;
    padding: 6px 12px 6px 8px;
    margin-right: 4px;
    background: #F5F7FA;
    border-radius: 2px;
    i {
      margin-right: 2px;
      font-size: 16px;
    }
    &:hover {
      background: #F0F1F5;
    }
  }
}
.wiki-description {
  padding: 0 16px 17px 40px;
  font-size: 14px;
  color: #313238;
  line-height: 22px;
  background: #fff;
}
</style>
