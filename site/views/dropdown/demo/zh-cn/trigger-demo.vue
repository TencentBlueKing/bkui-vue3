<template>
  <div>
    <bk-dropdown trigger="click">
      <bk-button>{{ tips }}</bk-button>
      <template #content>
        <bk-dropdown-menu>
          <bk-dropdown-item
            v-for="item in dropdownList"
            :key="item"
          >
            {{ item }}
          </bk-dropdown-item>
        </bk-dropdown-menu>
      </template>
    </bk-dropdown>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import BkDropdown from '@bkui-vue/dropdown';

  export default defineComponent({
    components: {
      BkDropdown,
    },
    setup() {
      const tips = ref('点击触发');
      const dropdownList = ref([
        '生产环境',
        '预发布环境',
        '测试环境',
        '正式环境',
        '开发环境',
        '调试环境',
      ]);

      return {
        tips,
        dropdownList,
      };
    },
  });
</script>
