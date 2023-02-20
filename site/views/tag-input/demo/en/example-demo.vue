<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Please enter username or nickname'"
      display-key="username"
      save-key="username"
      trigger="focus"
      :max-data="3"
      :tpl="tpl"
      :tag-tpl="tagTpl"
      :search-key="searchKey"
      :list="state.list"
    />
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const searchKey = ['username', 'nickname'];
      const state = reactive({
        tags: [],
        list: [
          { username: 'Jack', nickname: 'jack' },
          { username: 'Json', nickname: 'Json' },
          { username: 'Jane', nickname: 'Jane' },
          { username: 'Arman', nickname: 'Arman' },
        ],
      });

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

      return {
        searchKey,
        state,
        tpl,
        tagTpl,
      };
    },
  });
</script>
