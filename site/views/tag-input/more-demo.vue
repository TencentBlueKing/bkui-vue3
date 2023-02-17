<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="t('请输入 username 或 nickname')"
      display-key="username"
      save-key="username"
      :tpl="tpl"
      :search-key="searchKey"
      :list="state.list"
    />
    <p>{{ t('请输入 J 或 杰 来体验下搜索效果') }}</p>
  </div>
</template>

<script>

  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkTagInput from '@bkui-vue/tag-input';
  export default defineComponent({
    components: {
      BkTagInput,
    },
    setup() {
      const { t } = useI18n();

      const searchKey = ['username', 'nickname'];
      const state = reactive({
        tags: [],
        list: [
          { username: 'Jack', nickname: t('杰克'), sex: t('男') },
          { username: 'Json', nickname: t('杰森'), sex: t('男') },
          { username: 'Jane', nickname: t('简'), sex: t('女') },
          { username: 'Aerman', nickname: t('阿尔曼'), sex: t('女') },
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
        t,
      };
    },
  });
</script>
