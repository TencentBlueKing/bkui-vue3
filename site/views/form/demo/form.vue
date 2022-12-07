<template>
  <bk-form
    ref="formRef"
    class="example"
    :model="formModel"
    :rules="rules"
  >
    <bk-form-item
      label="姓名"
      property="name"
    >
      <bk-input
        v-model="formModel.name"
        placeholder="请输入"
        clearable
      />
    </bk-form-item>
    <bk-form-item label="性别">
      <bk-radio-group>
        <bk-radio label="男" />
        <bk-radio label="女" />
      </bk-radio-group>
    </bk-form-item>
    <bk-form-item label="联系方式">
      <bk-checkbox-group v-model="formModel.link">
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
      <bk-button
        theme="primary"
        @click="handleValid"
      >
        提交
      </bk-button>
    </bk-form-item>
  </bk-form>
</template>
<script setup>
  import { reactive, ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
  import BkForm, { BkFormItem } from '@bkui-vue/form';
  import BkInput from '@bkui-vue/input';
  import BkRadio, { BkRadioGroup } from '@bkui-vue/radio';
  import BkSelect, { BkOption } from '@bkui-vue/select';

  const formModel = reactive({
    name: '',
    link: [],
  });

  const rules = {
    name: [
      {
        validator: name => !name,
        message: 'this is errror',
        trigger: 'change',
      },
    ],
  };

  const formRef = ref();

  const handleValid = () => {
    formRef.value.validate();
  };

</script>
<style lang="postcss" scoped>
  .example {
    max-width: 800px;
  }
</style>
