<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog1.isShow = true"
    >
      normal
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog1.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :size="'normal'"
      @closed="() => exampleSetting1.dialog1.isShow = false"
      @confirm="() => exampleSetting1.dialog1.isShow = false"
    >
      <div>normal</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog2.isShow = true"
    >
      small
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog2.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :size="'small'"
      @closed="() => exampleSetting1.dialog2.isShow = false"
      @confirm="() => exampleSetting1.dialog2.isShow = false"
    >
      <div>small</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog3.isShow = true"
    >
      medium
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog3.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :size="'medium'"
      @closed="() => exampleSetting1.dialog3.isShow = false"
      @confirm="() => exampleSetting1.dialog3.isShow = false"
    >
      <div>medium</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog4.isShow = true"
    >
      large
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog4.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :size="'large'"
      @closed="() => exampleSetting1.dialog4.isShow = false"
      @confirm="() => exampleSetting1.dialog4.isShow = false"
    >
      <div>large</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting1.dialog5.isShow = true"
    >
      自定义宽高
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting1.dialog5.isShow"
      :title="'这是标题'"
      :theme="'primary'"
      :width="400"
      :height="200"
      @closed="() => exampleSetting1.dialog5.isShow = false"
      @confirm="() => exampleSetting1.dialog5.isShow = false"
    >
      <div>自定义宽高</div>
    </bk-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';

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
    dialog4: {
      isShow: false,
    },
    dialog5: {
      isShow: false,
    },
  });
</script>

<style lang="postcss">
.mr10 {
  margin-right: 10px;
}
</style>
