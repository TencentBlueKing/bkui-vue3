<template>
  <bk-form
    ref="formRef"
    class="example"
    :model="formModel"
    :rules="rules"
  >
    <bk-form-item
      :label="'Name'"
      property="name"
    >
      <bk-input
        v-model="formModel.name"
        :placeholder="'Please enter'"
        clearable
      />
    </bk-form-item>
    <bk-form-item :label="'Sex'">
      <bk-radio-group>
        <bk-radio :label="'Male'" />
        <bk-radio :label="'Woman'" />
      </bk-radio-group>
    </bk-form-item>
    <bk-form-item :label="'Contact Us'">
      <bk-checkbox-group v-model="formModel.link">
        <bk-checkbox label="QQ" />
        <bk-checkbox :label="'WeChat'" />
        <bk-checkbox label="Email" />
      </bk-checkbox-group>
    </bk-form-item>
    <bk-form-item :label="'Education'">
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
    </bk-form-item>
    <bk-form-item :label="'Introduce'">
      <bk-input
        :placeholder="'Please enter'"
        type="textarea"
      />
    </bk-form-item>
    <bk-form-item>
      <bk-button
        theme="primary"
        @click="handleValid"
      >
        Submit
      </bk-button>
    </bk-form-item>
  </bk-form>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
  import BkForm, { BkFormItem } from '@bkui-vue/form';
  import BkInput from '@bkui-vue/input';
  import BkRadio, { BkRadioGroup } from '@bkui-vue/radio';
  import BkSelect, { BkOption } from '@bkui-vue/select';

  export default defineComponent({
    components: {
      BkButton,
      BkCheckbox,
      BkCheckboxGroup,
      BkForm,
      BkFormItem,
      BkInput,
      BkRadio,
      BkRadioGroup,
      BkSelect,
      BkOption,
    },
    setup() {
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

      return {
        formRef,
        formModel,
        rules,
        handleValid,
      };
    },
  });

</script>

<style lang="postcss" scoped>
  .example {
    max-width: 800px;
  }
</style>
