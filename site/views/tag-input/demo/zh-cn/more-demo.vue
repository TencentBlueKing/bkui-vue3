<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'请输入 username 或 nickname'"
      display-key="username"
      save-key="username"
      :tpl="tpl"
      :search-key="searchKey"
      :list="state.list"
    />
    <p>请输入 J 或 杰 来体验下搜索效果</p>
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
          { username: 'Jack', nickname: '杰克', sex: '男' },
          { username: 'Json', nickname: '杰森', sex: '男' },
          { username: 'Jane', nickname: '简', sex: '女' },
          { username: 'Aerman', nickname: '阿尔曼', sex: '女' },
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
