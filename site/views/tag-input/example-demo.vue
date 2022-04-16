<template>
  <div>
    <bk-tag-input
      v-model="tags"
      placeholder="请输入 username 或 nickname"
      display-key="username"
      save-key="username"
      trigger="focus"
      :max-data="3"
      :tpl="tpl"
      :tag-tpl="tagTpl"
      :search-key="searchKey"
      :list="list"
    />
  </div>
</template>

<script setup>
  import { reactive } from 'vue';

  const searchKey = ['username', 'nickname'];
  const tags = reactive([]);
  const list = reactive([
    { username: 'Jack', nickname: '杰克' },
    { username: 'Json', nickname: '杰森' },
    { username: 'Jane', nickname: '简' },
    { username: 'Arman', nickname: '阿尔曼' },
  ]);
  const tpl = (node, highlightKeyword, h) => {
    const innerHTML = `${highlightKeyword(node.username)} (${node.nickname})`;
    return h(
      'div',
      { class: 'bk-selector-node' },
      [
        h('span', {
          class: 'text',
          innerHTML,
        }),
      ],
    );
  };
  const tagTpl = (node, h) => h(
    'div',
    { class: 'tag' },
    [
      h('span', {
        class: 'text',
        innerHTML: `<span style="text-decoration: underline;">${node.username}</span> (${node.nickname})`,
      }),
    ],
  );
</script>
