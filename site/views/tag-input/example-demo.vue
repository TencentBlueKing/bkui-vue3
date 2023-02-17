<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="t('请输入 username 或 nickname')"
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
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const searchKey = ['username', 'nickname'];
      const state = reactive({
        tags: [],
        list: [
          { username: 'Jack', nickname: t('杰克') },
          { username: 'Json', nickname: '杰森' },
          { username: 'Jane', nickname: '简' },
          { username: 'Arman', nickname: '阿尔曼' },
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
        t,
      };
    },
  });
</script>
