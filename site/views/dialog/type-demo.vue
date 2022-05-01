<template>
  <div>
    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog1.isShow = true"
    >
      展示型
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog1.isShow"
      :title="'标题描述'"
      :theme="'primary'"
      :dialog-type="'show'"
      @closed="() => exampleSetting.dialog1.isShow = false"
      @confirm="() => exampleSetting.dialog1.isShow = false"
    >
      <div>展示型对话框</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog2.isShow = true"
    >
      操作型
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog2.isShow"
      :title="'标题描述'"
      :theme="'primary'"
      :dialog-type="'operation'"
      @closed="() => exampleSetting.dialog2.isShow = false"
      @confirm="() => exampleSetting.dialog2.isShow = false"
    >
      <div>操作型对话框</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog3.isShow = true"
    >
      确认型
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog3.isShow"
      :title="'标题描述'"
      :theme="'primary'"
      :dialog-type="'confirm'"
      @closed="() => exampleSetting.dialog3.isShow = false"
      @confirm="() => exampleSetting.dialog3.isShow = false"
    >
      <div>确认型对话框</div>
    </bk-dialog>

    <bk-button
      class="mr10"
      @click="() => exampleSetting.dialog4.isShow = true"
    >
      流程型
    </bk-button>
    <bk-dialog
      :is-show="exampleSetting.dialog4.isShow"
      :title="'标题描述'"
      :theme="'primary'"
      :size="'medium'"
      :dialog-type="'process'"
      :current="currentId"
      :total-step="objectSteps.length"
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

<script setup>
  import { ref } from 'vue';

  import BkButton from '@bkui-vue/button';
  import BkDialog from '@bkui-vue/dialog';
  import BkSteps from '@bkui-vue/steps';

  const exampleSetting = ref({
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
  });

  const objectSteps = ref([
    { title: '进度一', icon: 1, description: '描述1', text: '进度一的内容' },
    { title: '进度二', description: '描述2', text: '进度二的内容' },
    { title: '进度三', text: '进度三的内容' },
    { title: '进度四', text: '进度四的内容' },
  ]);

  const currentId = ref(1);

  const handleNext = () => {
    if (currentId.value < objectSteps.value.length) {
      currentId.value += 1;
    }
  };
  const handlePrev = () => {
    if (currentId.value > 1) {
      currentId.value -= 1;
    }
  };
</script>
