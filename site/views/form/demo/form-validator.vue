<template>
  <bk-form
    ref="formRef"
    class="example"
    :model="formData"
    :rules="rules"
  >
    <bk-form-item
      label="姓名"
      property="name"
      required
    >
      <bk-input
        v-model="formData.name"
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
    <bk-form-item
      label="学历"
      property="school"
      required
    >
      <bk-select v-model="formData.school">
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
        native-type="button"
        @click="submit"
      >
        提交
      </bk-button>
      <bk-button
        style="margin-left: 8px;"
        @click="handleReset"
      >
        重置
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
  const formData = ref({
    name: '',
    school: '',
  });
  const rules = {
    name: [
      {
        validator: value => value.length > 2,
        message: '姓名长度不能小于2',
        trigger: 'change',
      },
    ],
  };

  const submit = () => {
    formRef.value.validate();
  };

  const handleReset = () => {
    formRef.value.clearValidate();
  };

</script>
<style lang="postcss" scoped>
  .example {
    max-width: 800px;
  }
</style>
