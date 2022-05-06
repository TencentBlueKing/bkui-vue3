<template>
  <div>
    <bk-tag-input
      v-model="tags"
      placeholder="通过 username 或 sex 搜索列表"
      display-key="nickname"
      save-key="username"
      search-key="username"
      trigger="focus"
      allow-create
      :max-data="1"
      :tpl="tpl"
      :tag-tpl="tagTpl"
      :filter-callback="filterFn"
      :create-tag-validator="tagValidator"
      :list="list"
    />
    <p>该例子自定义 filter-callback 通过 username 或 sex 搜索列表，定义 create-tag-validator 只允许创建以 A 开头的标签</p>
  </div>
</template>

<script setup>
  import { reactive } from 'vue';

  const tags = reactive([]);
  const list = reactive([
    { username: 'Jack', nickname: '杰克', sex: '男' },
    { username: 'Json', nickname: '杰森', sex: '男' },
    { username: 'Jane', nickname: '简', sex: '女' },
    { username: 'Arman', nickname: '阿尔曼', sex: '女' },
  ]);

  const filterFn = (searchValue, searchKey, list) => list.filter((data) => {
    if (!searchValue) return list;
    return data.sex === searchValue || (data[searchKey].indexOf(searchValue) > -1);
  });

  const tagValidator = value => /^A+/.test(value);

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
