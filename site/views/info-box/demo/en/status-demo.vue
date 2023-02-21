<template>
  <div>
    <bk-button
      theme="success"
      @click="handleDefault1"
    >
      success
    </bk-button>

    <bk-button
      theme="danger"
      class="ml10"
      style="margin-left: 15px"
      @click="handleDefault2"
    >
      error
    </bk-button>

    <bk-button
      theme="warning"
      class="ml10"
      style="margin-left: 15px"
      @click="handleDefault3"
    >
      warning
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

  export default defineComponent({
    setup() {
      const handleDefault1 = () => {
        InfoBox({
          infoType: 'success',
          title: 'Add user succeeded',
          subTitle: h(
            'a',
            {
              style: {
                color: '#3a84ff',
                textDecoration: 'none',
                cursor: 'pointer',
              },
            },
            'Continue adding',
          ),
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          onConfirm() {},
        });
      };

      const handleDefault2 = () => {
        InfoBox({
          infoType: 'danger',
          title: 'Failed to add user',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          onConfirm() {},
        });
      };

      const handleDefault3 = () => {
        InfoBox({
          infoType: 'warning',
          title: 'There is a security risk in this operation',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          isLoading: false,
          onConfirm() {},
        });
      };

      const handleDefault4 = () => {
        InfoBox({
          infoType: 'loading',
          title: 'loading',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          subTitle: 'One moment please',
          onConfirm() {},
        });
      };

      return {
        handleDefault1,
        handleDefault2,
        handleDefault3,
        handleDefault4,
      };
    },
  });
</script>
