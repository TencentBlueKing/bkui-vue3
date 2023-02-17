<template>
  <div class="slot-demo-wrapper">
    <bk-cascader
      v-slot="{node, data}"
      v-model="area"
      :placeholder="t('请选择')"
      :list="list"
      trigger="click"
    >
      <div class="cascader-slots-demo-node">
        <i
          v-if="node.children.length"
          class="cascader-slots-demo-round"
        />
        <span>{{ `${node.name} / ${data.id}` }}</span>
        <span
          v-if="node.children.length"
          class="cascader-slots-demo-prepend"
        >{{ node.children.length }}</span>
      </div>
    </bk-cascader>
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

<style lang="less">
.bk-cascader-node {
  .cascader-slots-demo-node {
    position: relative;
    display: flex;
    align-items: center;

    .cascader-slots-demo-round {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 5px;
      background: #e5f6ea;
      border: 1px solid #3fc06d;
      border-radius: 50%;
    }

    .cascader-slots-demo-prepend {
      position: absolute;
      top: 8px;
      right: 0px;
      width: 16px;
      height: 16px;
      font-size: 12px;
      line-height: 16px;
      color: #979ba5;
      text-align: center;
      background-color: #f0f1f5;
      border-radius: 2px;
      justify-self: flex-end;
    }
  }
}
</style>
