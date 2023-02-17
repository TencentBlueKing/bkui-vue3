<template>
  <div>
    <bk-tag>
      <template #icon>
        <bk />
      </template>
      {{ t('蓝鲸') }}
    </bk-tag>
    <bk-tag>
      <template #icon>
        <weixin />
      </template>
      {{ t('微信') }}
    </bk-tag>
    <bk-tag>
      <template #icon>
        <qq />
      </template>
      QQ
    </bk-tag>
  </div>
</template>

<script>
  import { Bk, Qq, Weixin } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    components: {
      Bk,
      Qq,
      Weixin,
    },
    setup() {
      const { t } = useI18n();
      return {
        t,
      };
    },
  });
</script>
