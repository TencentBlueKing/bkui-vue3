<template>
  <bk-form
    ref="formRef"
    class="example"
    :model="formData"
    :rules="rules"
  >
    <bk-form-item
      :label="'Name'"
      property="name"
      required
    >
      <bk-input
        v-model="formData.name"
        :placeholder="'Please enter'"
        clearable
      />
    </bk-form-item>
    <bk-form-item
      :label="'Sex'"
      required
    >
      <bk-radio-group>
        <bk-radio :label="'Male'" />
        <bk-radio :label="'Woman'" />
      </bk-radio-group>
    </bk-form-item>
    <bk-form-item :label="'Contact Us'">
      <bk-checkbox-group>
        <bk-checkbox label="QQ" />
        <bk-checkbox :label="'WeChat'" />
        <bk-checkbox label="Email" />
      </bk-checkbox-group>
    </bk-form-item>
    <bk-form-item
      :label="'Education'"
      property="school"
      required
    >
      <bk-select v-model="formData.school">
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
        native-type="button"
        @click="submit"
      >
        Submit
      </bk-button>
    </bk-form-item>
  </bk-form>
</template>

<script>
  import { defineComponent, ref } from 'vue';

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
      const formRef = ref('');
      const formData = ref({
        name: '',
        school: '',
      });
      const rules = {
        name: [
          {
            validator: value => value.length > 2,
            message: 'Name length cannot be less than 2',
            trigger: 'change',
          },
        ],
      };

      const submit = () => {
        formRef.value.validate();
      };

      return {
        formRef,
        formData,
        rules,
        submit,
      };
    },
  });
</script>

<style lang="postcss" scoped>
  .example {
    max-width: 800px;
  }
</style>
