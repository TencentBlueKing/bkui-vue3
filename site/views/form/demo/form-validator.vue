<template>
  <bk-form
    ref="formRef"
    :model="formMode"
  >
    <bk-form-item
      label="姓名"
      required
    >
      <bk-input
        placeholder="请输入"
        clearable
      />
    </bk-form-item>
    <bk-form-item
      label="性别"
      required
    >
      <bk-radio-group>
        <bk-radio label="男" />
        <bk-radio label="女" />
      </bk-radio-group>
    </bk-form-item>
    <bk-form-item label="联系方式">
      <bk-checkbox-group>
        <bk-checkbox label="QQ" />
        <bk-checkbox label="微信" />
        <bk-checkbox label="Email" />
      </bk-checkbox-group>
    </bk-form-item>
    <bk-form-item label="学历">
      <bk-select>
        <bk-option
          value="1"
          label="本科以下"
        />
        <bk-option
          value="2"
          label="本科以上"
        />
      </bk-select>
    </bk-form-item>
    <bk-form-item label="介绍">
      <bk-input
        placeholder="请输入"
        type="textarea"
      />
    </bk-form-item>
    <bk-form-item>
      <bk-button theme="primary">
        提交
      </bk-button>
    </bk-form-item>
  </bk-form>
</template>
<script setup>
  import { ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
  import BkForm, { BkFormItem } from '@bkui-vue/form';
  import BkInput from '@bkui-vue/input';
  import BkRadio, { BkRadioGroup } from '@bkui-vue/radio';
  import BkSelect, { BkOption } from '@bkui-vue/select';


  const formRef = ref('');
  const formMode = ref({});

</script>
<style lang="postcss">
</style>
