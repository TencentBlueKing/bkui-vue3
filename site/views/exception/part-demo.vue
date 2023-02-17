<template>
  <div>
    <bk-button
      theme="primary"
      @click="isGray = !isGray"
    >
      {{ t('切换') }}{{ t(!isGray ? '灰色' : '白色') }}{{ t('背景') }}
    </bk-button>
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="403"
      scene="part"
      :title="t('没有权限')"
      :description="t('你没有相应业务的访问权限，请前往申请相关业务权限')"
      :class="{'exception-gray': isGray}"
    >
      <bk-button
        text
        theme="primary"
      >
        {{ t('去申请') }}
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item exception-part"
      type="empty"
      scene="part"
      :description="t('没有数据')"
      :class="{'exception-gray': isGray}"
    />
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="500"
      scene="part"
      :description="t('服务维护中')"
      :class="{'exception-gray': isGray}"
    />
    <bk-exception
      class="exception-wrap-item exception-part"
      type="search-empty"
      scene="part"
      :description="t('搜索为空')"
      :class="{'exception-gray': isGray}"
    />
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkException from '@bkui-vue/exception';
  export default defineComponent({
    components: {
      BkException,
    },
    setup() {
      const { t } = useI18n();

      const isGray = ref(false);
      return {
        isGray,
        t,
      };
    },
  });


</script>
<style>
.exception-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
}

.exception-wrap .exception-wrap-item {
  height: 420px;
  padding-top: 22px;
  margin: 10px;
  border: 1px solid #dcdee5;
}

.exception-wrap-item.exception-part {
  height: 260px;
  padding-top: 48px;
  flex: 1;
}

.exception-wrap-item.exception-gray {
  background-color: #f5f6fa;
}
</style>
