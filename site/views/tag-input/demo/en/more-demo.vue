<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Please enter username or nickname'"
      display-key="username"
      save-key="username"
      :tpl="tpl"
      :search-key="searchKey"
      :list="state.list"
    />
    <p>Please enter J or Jerry to experience the search effect</p>
  </div>
</template>

<script>

  import { defineComponent, reactive } from 'vue';

  import BkTagInput from '@bkui-vue/tag-input';
  export default defineComponent({
    components: {
      BkTagInput,
    },
    setup() {
      const searchKey = ['username', 'nickname'];
      const state = reactive({
        tags: [],
        list: [
          { username: 'Jack', nickname: 'Jack', sex: 'male' },
          { username: 'Json', nickname: 'Json', sex: 'male' },
          { username: 'Jane', nickname: 'Jane', sex: 'woman' },
          { username: 'Aerman', nickname: 'Aerman', sex: 'woman' },
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

      return {
        searchKey,
        state,
        tpl,
      };
    },
  });
</script>
