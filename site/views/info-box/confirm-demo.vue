<template>
  <div>
    <bk-button
      type="primary"
      @click="handleDefault"
    >
      直接使用
    </bk-button>
    <bk-button
      style="margin-left: 15px;"
      type="primary"
      @click="handleDefault2"
    >
      更新infoBox
    </bk-button>
  </div>
</template>

<script setup>
  import { InfoBox } from 'bkui-vue';

  const handleDefault = () => {
    InfoBox({
      title: '确认要删除1？',
      subTitle: '确认要删除？',
      dialogType: 'confirm',
      headerAlign: 'center',
      footerAlign: 'center',
      onConfirm() {
        return confirm('确定删除？');
      },
    });
  };
  const confirmInstance = InfoBox({
    isShow: false,
  });
  const Confirm = (opts) => {
    confirmInstance.update(opts);
    confirmInstance.show(opts);
  };
  const handleDefault2 = () => {
    Confirm({
      title: '确认要删除1？',
      subTitle: '确认要删除22222',
      dialogType: 'confirm',
      headerAlign: 'center',
      footerAlign: 'center',
      onConfirm() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 100);
        });
      },
    });
  };
</script>
