<template>
  <div style="display: flex">
    <BkButton style="margin-right: 10px;" @click="handleChangeTrigger">
      {{ `${trigger === 'default' ? '默认方式' : '手动方式'}` }}（点击修改）
    </BkButton>
    <template v-if="trigger === 'manual'">
      <BkButton style="margin-right: 10px;" @click="showPopover">
        显示Content
      </BkButton>
      <BkButton style="margin-right: 10px;" @click="hidePopover">
        隐藏Content
      </BkButton>
    </template>
    <bk-select class="bk-select" v-model="selectedValue" auto-focus filterable :trigger="trigger" ref="selectRef">
      <bk-option v-for="(item, index) in datasource" :disabled="item.disabled" :id="item.value" :key="index"
        :name="item.label" />
    </bk-select>
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue';
import BkButton from '@bkui-vue/button';

const datasource = ref([
  {
    value: 'climbing',
    label: '爬山',
  },
  {
    value: { a: 123 },
    label: '跑步',
  },
  {
    value: { b: 456 },
    label: '未知',
  },
  {
    value: 'fitness',
    label: '健身',
  },
  {
    value: 'bike',
    label: '骑车',
  },
  {
    value: 'dancing',
    label: '跳舞',
  },
  {
    value: 'sleep',
    label: '睡觉',
    disabled: true,
  },
]);

const selectedValue = ref({ b: 456 });

const trigger = ref('manual')
const handleChangeTrigger = () => {
  trigger.value = trigger.value === 'default' ? 'manual' : 'default'
}
const selectRef = ref()
const showPopover = () => {
  selectRef.value?.showPopover()
}
const hidePopover = () => {
  selectRef.value?.hidePopover()
}
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
