<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog1.isShow = true"
    >
      <div>{{ t('操作型对话框') }}</div>
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog1.isShow"
      :title="t('标题描述')"
      :theme="'primary'"
      :dialog-type="'show'"
      @closed="() => exampleSetting.dialog1.isShow = false"
      @confirm="() => exampleSetting.dialog1.isShow = false"
    >
      <div>{{ t('展示型对话框') }}</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog2.isShow = true"
    >
      {{ t('操作型') }}
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog2.isShow"
      :title="t('标题描述')"
      :theme="'primary'"
      :dialog-type="'operation'"
      @closed="() => exampleSetting.dialog2.isShow = false"
      @confirm="() => exampleSetting.dialog2.isShow = false"
    >
      <div>{{ t('操作型对话框') }}</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog3.isShow = true"
    >
      {{ t('确认型') }}
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog3.isShow"
      :title="t('标题描述')"
      :theme="'primary'"
      :dialog-type="'confirm'"
      @closed="() => exampleSetting.dialog3.isShow = false"
      @confirm="() => exampleSetting.dialog3.isShow = false"
    >
      <div>{{ t("确认型对话框") }}</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog4.isShow = true"
    >
      {{ t('流程型') }}
    </bk-button>
    <bk-dialog
      :title="t('标题描述')"
      :theme="'primary'"
      :size="'medium'"
      :dialog-type="'process'"
      :current="currentId"
      :total-step="objectSteps.length"
      :is-show="exampleSetting.dialog4.isShow"
      :confirm-text="exampleSetting.dialog4.confirmText"
      :cancel-text="exampleSetting.dialog4.cancelText"
      @closed="() => exampleSetting.dialog4.isShow = false"
      @confirm="() => exampleSetting.dialog4.isShow = false"
      @next="handleNext"
      @prev="handlePrev"
    >
      <div>
        <bk-steps
          :cur-step="currentId"
          :steps="objectSteps"
        />
        <div
          v-if="currentId"
          style="margin-top: 30px"
        >
          {{ objectSteps[currentId - 1].text }}
        </div>
      </div>
    </bk-dialog>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  import BkSteps from '@bkui-vue/steps';
  export default defineComponent({
    components: {
      BkButton,
      BkDialog,
      BkSteps,
    },
    setup() {
      const { t } = useI18n();
      const currentId = ref(1);
      const exampleSetting = ref({
        dialog1: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
        dialog2: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
        dialog3: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
        dialog4: {
          isShow: false,
          confirmText: t('确定'),
          cancelText: t('取消'),
        },
      });

      const objectSteps = ref([
        { title: t('进度一'), icon: 1, description: t('描述1'), text: t('进度一的内容') },
        { title: t('进度二'), description: t('描述2'), text: t('进度二的内容') },
        { title: t('进度三'), text: t('进度三的内容') },
        { title: t('进度四'), text: t('进度四的内容') },
      ]);

      const handlePrev = () => {
        if (currentId.value > 1) {
          currentId.value -= 1;
        }
      };

      const handleNext = () => {
        if (currentId.value < objectSteps.value.length) {
          currentId.value += 1;
        }
      };

      return {
        currentId,
        exampleSetting,
        objectSteps,
        handlePrev,
        handleNext,
        t,
      };
    },
  });
</script>
