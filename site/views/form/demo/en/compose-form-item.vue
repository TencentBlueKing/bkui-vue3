<template>
  <bk-compose-form-item>
    <bk-input
      :placeholder="'Please enter'"
      clearable
    />
    <bk-select>
      <bk-option
        value="1"
        :label="'Below undergraduate'"
      />
      <bk-option
        value="2"
        :label="'Bachelor degree or above'"
      />
    </bk-select>
    <bk-input
      :placeholder="'Please enter'"
      type="number"
    />
    <bk-tag-input
      :list="list"
      style="width: 100px;"
      :placeholder="'Please enter and press Enter to end'"
    />
    <bk-date-picker />
  </bk-compose-form-item>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  import { BkComposeFormItem } from '@bkui-vue/form';
  import BkInput from '@bkui-vue/input';
  import BkSelect, { BkOption } from '@bkui-vue/select';
  import BkTagInput from '@bkui-vue/tag-input';
  export default defineComponent({
    components: {
      BkComposeFormItem,
      BkInput,
      BkSelect,
      BkOption,
      BkTagInput,
    },
    setup() {
      const list = ref([
        { id: 'shenzhen', name: 'Shenzhen' },
        { id: 'guangzhou', name: 'Guangzhou' },
        { id: 'beijing', name: 'Beijing' },
        { id: 'shanghai', name: 'Shanghai' },
        { id: 'hangzhou', name: 'Hangzhou' },
        { id: 'nanjing', name: 'Nanjing' },
        { id: 'chongqing', name: 'Chongqing' },
        { id: 'taibei', name: 'Taibei' },
        { id: 'haikou', name: 'Haikou' },
      ]);

      return {
        list,
      };
    },
  });

</script>
