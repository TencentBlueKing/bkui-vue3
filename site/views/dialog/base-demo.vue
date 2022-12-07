<template>
  <div>
    <bk-button
      :theme="'primary'"
      @click="() => exampleSetting.dialog.isShow = true"
    >
      primary
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog.isShow"
      :title="'描述'"
      :theme="'primary'"
      quick-close
      @closed="() => exampleSetting.dialog.isShow = false"
      @confirm="() => exampleSetting.dialog.isShow = false"
    >
      <div>primary 主题，点击遮罩不会关闭弹框，esc 按键会关闭弹框</div>
      <bk-button @click="() => exampleSetting.dialog.isShow2 = true">
        Show
      </bk-button>
      <bk-dialog
        :is-show="exampleSetting.dialog.isShow"
        :title="'描述'"
        :theme="'primary'"
        quick-close
      >
        <bk-button @click="() => exampleSetting.dialog.isShow3 = true">
          Show
        </bk-button>
        <bk-dialog
          :is-show="exampleSetting.dialog.isShow3"
          :title="'描述'"
          :theme="'primary'"
          quick-close
        />
      </bk-dialog>
    </bk-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  const exampleSetting = ref({
    dialog: {
      isShow: false,
      isShow2: false,
      isShow3: false,
    },
  });
</script>
