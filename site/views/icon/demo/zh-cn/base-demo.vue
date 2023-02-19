<template>
  <ul class="icon-list">
    <li
      v-for="(icon, name) in Icons"
      :key="name"
      class="icon-list-item"
      @mousedown="handleCopyIcon(name)"
    >
      <component
        :is="icon"
        class="item-icon"
      />
      <span class="item-name">{{ name }}</span>
    </li>
  </ul>
</template>
<script setup>
  import * as IconModule from 'bkui-vue/icon';
  import BkMessage from 'bkui-vue/message';
  import ClipboardJS from 'clipboard';
  import { onBeforeUnmount, onMounted, ref } from 'vue';
  const Icons = Object.keys(IconModule).reduce((pre, name) => {
    pre[name.replace(/([A-Z]+)/gm, (_, match, offset) => `${offset < 1 ? '' : '-'}${match.toLowerCase()}`)] = IconModule[name];
    return pre;
  }, {});
  console.error(Icons);
  const activeCode = ref('');
  let copyInstance;
  onMounted(() => {
    copyInstance = new ClipboardJS('.icon-list-item', {
      text: () => activeCode.value,
    });
    ['success', 'error'].forEach((theme) => {
      copyInstance.on(theme, () => BkMessage({
        theme,
        message: theme === 'success' ? `复制成功 ${activeCode.value}` : '复制失败',
      }));
    });
  });
  onBeforeUnmount(() => {
    copyInstance?.destroy();
  });
  const handleCopyIcon = (name) => {
    activeCode.value = `<${name}/>`;
  };
</script>
<style lang="less">
.icon-list {
  display: flex;
  flex-wrap: wrap;
  margin: auto;

  &-item {
    display: flex;
    width: calc(12.5% - 4px);
    height: 70px;
    margin: 10px 2px;
    transition: all .3s ease-in-out;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .item-icon {
      font-size: 26px;
      transition: all .3s ease-in-out;
    }

    &:hover {
      color: white;
      cursor: pointer;
      background-color: #3a84ff;
      border-radius: 2px;

      .item-icon {
        transform: scale(1.4);
      }
    }

    .item-name {
      max-width: 100%;
      margin-top: 6px;
      overflow: hidden;
      font-size: 12px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
