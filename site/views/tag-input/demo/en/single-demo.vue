<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Search the list through username or sex'"
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
      :list="state.list"
    />
    <p>
      This example defines the user-defined filter-callback to search the list through
      username or sex, and defines the create-tag-validator to only allow the creation of
      tags beginning with A
    </p>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        tags: [],
        list: [
          { username: 'Jack', nickname: 'Jack', sex: 'male' },
          { username: 'Json', nickname: 'Json', sex: 'male' },
          { username: 'Jane', nickname: 'Jane', sex: 'woman' },
          { username: 'Aerman', nickname: 'Aerman', sex: 'woman' },
        ],
      });

      const filterFn = (searchValue, searchKey, list) => list.filter((data) => {
        if (!searchValue) return list;
        return data.sex === searchValue || data[searchKey].indexOf(searchValue) > -1;
      });

      const tagValidator = value => /^A+/.test(value);

      const tpl = (node, highlightKeyword, h) => {
        const innerHTML = `${highlightKeyword(node.username)} (${node.nickname})`;
        return h('div', { class: 'bk-selector-node' }, [
          h('span', {
            class: 'text',
            innerHTML,
          }),
        ]);
      };

      const tagTpl = (node, h) => h('div', { class: 'tag' }, [
        h('span', {
          class: 'text',
          innerHTML: `<span style="text-decoration: underline;">${node.username}</span> (${node.nickname})`,
        }),
      ]);

      return {
        state,
        filterFn,
        tagValidator,
        tpl,
        tagTpl,
      };
    },
  });
</script>
