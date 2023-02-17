<template>
  <div class="button-group-list">
    <div class="mb10">
      <bk-button-group size="small">
        <bk-button
          :selected="selected === t('北京')"
          @click="handleSelected(t('北京'))"
        >
          {{ t('北京') }}
        </bk-button>
        <bk-button
          :selected="selected === t('上海')"
          disabled
          @click="handleSelected(t('上海'))"
        >
          {{ t('上海') }}
        </bk-button>
        <bk-button
          :selected="selected === t('广州')"
          @click="handleSelected(t('广州'))"
        >
          {{ t('广州') }}
        </bk-button>
        <bk-button
          :selected="selected === t('深圳')"
          disabled
          @click="handleSelected(t('深圳'))"
        >
          {{ t('深圳') }}
        </bk-button>
        <bk-button
          :selected="selected === t('其他')"
          @click="handleSelected(t('其他'))"
        >
          {{ t('其他') }}
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>

    <div class="mb10">
      <bk-button-group>
        <bk-button
          :selected="selected === t('北京')"
          @click="handleSelected(t('北京'))"
        >
          {{ t('北京') }}
        </bk-button>
        <bk-button
          :selected="selected === t('上海')"
          disabled
          @click="handleSelected(t('上海'))"
        >
          {{ t('上海') }}
        </bk-button>
        <bk-button
          :selected="selected === t('广州')"
          @click="handleSelected(t('广州'))"
        >
          {{ t('广州') }}
        </bk-button>
        <bk-button
          :selected="selected === t('深圳')"
          disabled
          @click="handleSelected(t('深圳'))"
        >
          {{ t('深圳') }}
        </bk-button>
        <bk-button
          :selected="selected === t('其他')"
          @click="handleSelected(t('其他'))"
        >
          {{ t('其他') }}
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>

    <div>
      <bk-button-group size="large">
        <bk-button
          :selected="selected === t('北京')"
          @click="handleSelected(t('北京'))"
        >
          {{ t('北京') }}
        </bk-button>
        <bk-button
          :selected="selected === t('上海')"
          disabled
          @click="handleSelected(t('上海'))"
        >
          {{ t('上海') }}
        </bk-button>
        <bk-button
          :selected="selected === t('广州')"
          @click="handleSelected(t('广州'))"
        >
          {{ t('广州') }}
        </bk-button>
        <bk-button
          :selected="selected === t('深圳')"
          disabled
          @click="handleSelected(t('深圳'))"
        >
          {{ t('深圳') }}
        </bk-button>
        <bk-button
          :selected="selected === t('其他')"
          @click="handleSelected(t('其他'))"
        >
          {{ t('其他') }}
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>
  </div>
</template>
<script>
  import { AngleDown } from 'bkui-vue/lib/icon';
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const selected = ref('深圳');
      const  handleSelected = (v)  => {
        selected.value = v;
      };
      const { t } = useI18n();
      return {
        t,
        selected,
        AngleDown,
        handleSelected,
      };
    },
  });
</script>

<style lang="postcss">
  .mb10 {
    margin-bottom: 10px;
  }

  .f20 {
    font-size: 20px;
  }

  .f22 {
    font-size: 22px;
  }

  .f24 {
    font-size: 24px;
  }
</style>
