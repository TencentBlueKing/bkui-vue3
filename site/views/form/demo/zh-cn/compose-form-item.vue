<template>
  <bk-compose-form-item>
    <bk-input
      :placeholder="'请输入'"
      clearable
    />
    <bk-select>
      <bk-option
        value="1"
        :label="'本科以下'"
      />
      <bk-option
        value="2"
        :label="'本科以上'"
      />
    </bk-select>
    <bk-input
      :placeholder="'请输入'"
      type="number"
    />
    <bk-tag-input
      :list="list"
      style="width: 100px;"
      :placeholder="'请输入并按 Enter 结束'"
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
        { id: 'shenzhen', name: '深圳' },
        { id: 'guangzhou', name: '广州' },
        { id: 'beijing', name: '北京' },
        { id: 'shanghai', name: '上海' },
        { id: 'hangzhou', name: '杭州' },
        { id: 'nanjing', name: '南京' },
        { id: 'chongqing', name: '重庆' },
        { id: 'taibei', name: '台北' },
        { id: 'haikou', name: '海口' },
      ]);

      return {
        list,
      };
    },
  });

</script>
