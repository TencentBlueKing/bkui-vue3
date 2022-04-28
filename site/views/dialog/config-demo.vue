<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog1.isShow = true"
    >
      自定义内容1
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog1.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      @closed="() => exampleSetting1.dialog1.isShow = false"
      @confirm="() => exampleSetting1.dialog1.isShow = false"
    >
      <bk-input
        placeholder="文字个数不超过8个汉字"
      />
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog2.isShow = true"
    >
      不显示关闭 icon
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog2.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :close-icon="false"
      @closed="() => exampleSetting1.dialog2.isShow = false"
      @confirm="() => exampleSetting1.dialog2.isShow = false"
    >
      <div>不显示关闭 icon</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog3.isShow = true"
    >
      配置按钮文案
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog3.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :confirm-text="'按钮1'"
      :cancel-text="'按钮2'"
      @closed="() => exampleSetting1.dialog3.isShow = false"
      @confirm="() => exampleSetting1.dialog3.isShow = false"
    >
      <div>配置按钮文案</div>
    </bk-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  import BkInput from '@bkui-vue/input';

  const exampleSetting1 = ref({
    dialog1: {
      isShow: false,
    },
    dialog2: {
      isShow: false,
    },
    dialog3: {
      isShow: false,
    },
  });
</script>

<style>

</style>
