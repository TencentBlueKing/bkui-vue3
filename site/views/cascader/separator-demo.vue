<template>
  <div
    class="flex-wrapper"
  >
    <bk-cascader
      v-model="area"
      :list="list"
      separator="|"
    />
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';

  import BkCascader from '@bkui-vue/cascader';

  export default defineComponent({
    name: 'SiteBreadcrumb',
    components: {
      BkCascader,
    },
    setup() {
      const list = [
        {
          id: 'hunan',
          name: '湖南',
          disabled: true,
          children: [
            {
              id: 'changsha',
              name: '长沙',
            },
            {
              id: 'yueyang',
              name: '岳阳',
              disabled: true,
            },
          ],
        }, {
          id: 'guangxi',
          name: '广西',
        }, {
          id: 'yunnan',
          name: '云南',
          children: [
            {
              id: 'kunming',
              name: '昆明',
              children: [
                {
                  id: 'wuhuaqu',
                  name: '五华区阿萨德发送到发送到发到沙发大厦',
                },
                {
                  id: 'guanduqu',
                  name: '官渡区',
                },
                {
                  id: 'xishanqu',
                  name: '西山区',
                },
              ],
            },
            {
              id: 0,
              name: '大理',
            },
            {
              id: 'yuxi',
              name: '玉溪',
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

