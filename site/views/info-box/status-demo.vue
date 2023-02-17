<template>
  <div>
    <bk-button
      theme="success"
      @click="handleDefault1"
    >
      {{ t('成功') }}
    </bk-button>

    <bk-button
      theme="danger"
      class="ml10"
      style="margin-left: 15px"
      @click="handleDefault2"
    >
      {{ t('错误') }}
    </bk-button>

    <bk-button
      theme="warning"
      class="ml10"
      style="margin-left: 15px"
      @click="handleDefault3"
    >
      {{ t('警告') }}
    </bk-button>

    <bk-button
      class="ml10"
      style="margin-left: 15px"
      @click="handleDefault4"
    >
      loading
    </bk-button>
  </div>
</template>

<script>
  import { InfoBox } from 'bkui-vue';
  import { defineComponent, h } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const handleDefault1 = () => {
        InfoBox({
          infoType: 'success',
          title: t('添加用户成功'),
          subTitle: h(
            'a',
            {
              style: {
                color: '#3a84ff',
                textDecoration: 'none',
                cursor: 'pointer',
              },
            },
            t('继续添加'),
          ),
          confirmText: t('确定'),
          cancelText: t('取消'),
          onConfirm() {},
        });
      };

      const handleDefault2 = () => {
        InfoBox({
          infoType: 'danger',
          title: t('添加用户失败'),
          confirmText: t('确定'),
          cancelText: t('取消'),
          onConfirm() {},
        });
      };

      const handleDefault3 = () => {
        InfoBox({
          infoType: 'warning',
          title: t('此操作存在安全风险'),
          confirmText: t('确定'),
          cancelText: t('取消'),
          isLoading: false,
          onConfirm() {},
        });
      };

      const handleDefault4 = () => {
        InfoBox({
          infoType: 'loading',
          title: 'loading',
          confirmText: t('确定'),
          cancelText: t('取消'),
          subTitle: t('请稍等'),
          onConfirm() {},
        });
      };

      return {
        handleDefault1,
        handleDefault2,
        handleDefault3,
        handleDefault4,
        t,
      };
    },
  });
</script>
