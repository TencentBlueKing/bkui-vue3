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
      const tips = ref('Click trigger');
      const dropdownList = ref([
        'Production environment',
        'Pre-release environment',
        'Test environment',
        'Formal environment',
        'Development environment',
        'Debug environment',
      ]);

      return {
        tips,
        dropdownList,
      };
    },
  });
</script>
