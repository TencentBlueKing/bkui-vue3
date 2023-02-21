<template>
  <div>
    <bk-dropdown
      @show="handleShow"
      @hide="handleHide"
    >
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
  import BkMessage from '@bkui-vue/message';

  export default defineComponent({
    components: {
      BkDropdown,
    },
    setup() {
      const tips = ref('Hover trigger');
      const dropdownList = ref([
        'Production environment',
        'Pre-release environment',
        'Test environment',
        'Formal environment',
        'Development environment',
        'Debug environment',
      ]);
      const popoverOptions = { boundary: 'body' };

      const handleShow = () => {
        BkMessage('show');
      };

      const handleHide = () => {
        BkMessage('hide');
      };

      return {
        tips,
        dropdownList,
        popoverOptions,
        handleShow,
        handleHide,
      };
    },
  });
</script>
