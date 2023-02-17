<template>
  <div>
    <bk-switcher
      v-model="demo1"
      true-value="a"
      false-value="b"
      @change="handleChange"
    />
    <bk-switcher
      v-model="demo1"
      show-text
      true-value="a"
      false-value="b"
      :on-text="t('真值')"
      :off-text="t('假值')"
    />
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkSwitcher from '@bkui-vue/switcher';

  export default defineComponent({
    name: 'SiteBkSwitcher',
    components: {
      BkSwitcher,
    },
    setup() {
      const { t } = useI18n();
      const demo1 = ref('a');
      const handleChange = (value) => {
        console.log(value);
      };
      return {
        demo1,
        handleChange,
        t,
      };
    },
  });

</script>


<style scoped>
  .bk-switcher {
    margin-right: 10px;
  }
</style>
