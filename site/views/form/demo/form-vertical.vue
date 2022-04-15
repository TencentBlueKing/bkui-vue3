<template>
  <BkForm form-type="vertical">
    <BkFormItem label="姓名">
      <BkInput
        placeholder="请输入"
        clearable
      />
    </BkFormItem>
    <BkFormItem label="性别">
      <BkRadioGroup>
        <BkRadio label="男" />
        <BkRadio label="女" />
      </BkRadioGroup>
    </BkFormItem>
    <BkFormItem label="联系方式">
      <BkCheckboxGroup>
        <BkCheckbox label="QQ" />
        <BkCheckbox label="微信" />
        <BkCheckbox label="Email" />
      </BkCheckboxGroup>
    </BkFormItem>
    <BkFormItem label="学历">
      <BkSelect>
        <BkOption
          value="1"
          label="本科以下"
        />
        <BkOption
          value="2"
          label="本科以上"
        />
      </BkSelect>
    </BkFormItem>
    <BkFormItem label="介绍">
      <BkInput
        placeholder="请输入"
        type="textarea"
      />
    </BkFormItem>
    <BkFormItem>
      <BkButton theme="primary">
        提交
      </BkButton>
    </BkFormItem>
  </BkForm>
</template>
<script setup>
import BkButton from '@bkui-vue/button';
import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import BkForm, { BkFormItem } from '@bkui-vue/form';
import BkInput from '@bkui-vue/input';
import BkRadio, { BkRadioGroup } from '@bkui-vue/radio';
import BkSelect, { BkOption } from '@bkui-vue/select';

</script>
<style lang="postcss">
</style>
