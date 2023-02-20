<template>
  <div class="slot-demo-wrapper">
    <bk-cascader
      v-slot="{node, data}"
      v-model="area"
      :placeholder="'Please select'"
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

  export default defineComponent({
    setup() {
      const list = [
        {
          id: 'hunan',
          name: 'Hunan',
          disabled: true,
          children: [
            {
              id: 'changsha',
              name: 'Changsha',
            },
            {
              id: 'yueyang',
              name: 'Yueyang',
              disabled: true,
            },
          ],
        }, {
          id: 'guangxi',
          name: 'Guangxi',
        }, {
          id: 'yunnan',
          name: 'Yunnan',
          children: [
            {
              id: 'kunming',
              name: 'Kunming',
              children: [
                {
                  id: 'wuhuaqu',
                  name: 'WuhuashanWuhuashanWuhuashan',
                },
                {
                  id: 'guanduqu',
                  name: 'Guanduqu',
                },
                {
                  id: 'xishanqu',
                  name: 'Xishanqu',
                },
              ],
            },
            {
              id: 0,
              name: 'Dali',
            },
            {
              id: 'yuxi',
              name: 'Yuxi',
            },
          ],
        },
      ];
      const area = ref([]);

      return {
        list,
        area,
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
