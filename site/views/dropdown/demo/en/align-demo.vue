<template>
  <div class="dropdown-placement-demo">
    <bk-dropdown
      v-for="item in dropdownPlacement"
      :key="item"
      class="dropdown-item"
      :placement="item"
    >
      <bk-button>{{ item }}</bk-button>
      <template #content>
        <bk-dropdown-menu>
          <bk-dropdown-item
            v-for="dropItem in dropdownList"
            :key="dropItem"
          >
            {{ dropItem }}
          </bk-dropdown-item>
        </bk-dropdown-menu>
      </template>
    </bk-dropdown>
  </div>
</template>

<script>
  import { defineComponent, ref, shallowRef } from 'vue';

  import BkDropdown from '@bkui-vue/dropdown';

  export default defineComponent({
    components: {
      BkDropdown,
    },
    setup() {
      const dropdownList = ref([
        'Production environment',
        'Pre-release environment',
        'Test environment',
        'Formal environment',
        'Development environment',
        'Debug environment',
      ]);
      const dropdownPlacement = shallowRef([
        'auto',
        'auto-start',
        'auto-end',
        'top',
        'right',
        'bottom',
        'left',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'right-start',
        'right-end',
        'left-start',
        'left-end',
      ]);

      return {
        dropdownList,
        dropdownPlacement,
      };
    },
  });
</script>

<style lang="postcss">
.dropdown-placement-demo .dropdown-item {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
