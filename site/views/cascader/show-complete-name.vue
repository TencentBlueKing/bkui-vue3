<template>
  <div class="cascader-wrapper">
    <bk-cascader
      v-model="area"
      :placeholder="t('请选择')"
      :list="list"
      trigger="click"
      :show-complete-name="false"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const list = [
        {
          id: 'hunan',
          name: t('湖南'),
          disabled: true,
          children: [
            {
              id: 'changsha',
              name: t('长沙'),
            },
            {
              id: 'yueyang',
              name: t('岳阳'),
              disabled: true,
            },
          ],
        }, {
          id: 'guangxi',
          name: t('广西'),
        }, {
          id: 'yunnan',
          name: t('云南'),
          children: [
            {
              id: 'kunming',
              name: t('昆明'),
              children: [
                {
                  id: 'wuhuaqu',
                  name: t('长文字测试五华山五华山五华山'),
                },
                {
                  id: 'guanduqu',
                  name: t('官渡区'),
                },
                {
                  id: 'xishanqu',
                  name: t('西山区'),
                },
              ],
            },
            {
              id: 0,
              name: t('大理'),
            },
            {
              id: 'yuxi',
              name: t('玉溪'),
            },
          ],
        },
      ];
      const area = ref([]);

      return {
        list,
        area,
        t,
      };
    },
  });
</script>

