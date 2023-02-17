<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="t('通过 username 或 sex 搜索列表')"
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
    <p>{{ t('该例子自定义 filter-callback 通过 username 或 sex 搜索列表，定义 create-tag-validator 只允许创建以 A 开头的标签') }}</p>
  </div>
</template>

<script>

  import { defineComponent, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const state = reactive({
        tags: [],
        list: [
          { username: 'Jack', nickname: t('杰克'), sex: t('男') },
          { username: 'Jason', nickname: t('杰森'), sex: t('男') },
          { username: 'Jane', nickname: t('简'), sex: t('女') },
          { username: 'Aerman', nickname: t('阿尔曼'), sex: t('女') },
        ],
      });

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

      return {
        state,
        filterFn,
        tagValidator,
        tpl,
        tagTpl,
        t,
      };
    },
  });
</script>
