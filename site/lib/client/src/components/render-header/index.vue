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
        v-for="tag in getTags()"
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
import { useRoute } from 'vue-router';

interface IProps {
  title: string;
  titleCN?: string;
  description: string;
}

const props = defineProps<IProps>();

const route = useRoute();

const getTags = () => {
  const getGithubUrl = () => {
    const directives = [
      'clickoutside',
      'ellipsis',
      'tooltips',
    ];
    const componentName = route.params.name as string;
    return `https://github.com/TencentBlueKing/bkui-vue3/tree/staging/packages/${directives.includes(componentName) ? 'directives/src' : componentName}`;
  };

  return [
    {
      icon: 'bkui-vue-wiki-icon icon-github',
      name: 'Github',
      url: getGithubUrl(),
    },
    ...(process.env.BK_MCP ? [
      {
        icon: 'bkui-vue-wiki-icon icon-mcp',
        name: 'MCP',
        url: process.env.BK_MCP,
      },
    ] : []),
  ];
};
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
