<template>
  <section
    class="send-container"
    :style="{
      '--text-height': textHeight + 'px',
      '--origin-height': (focusShowHeight ? height : textHeight) + 'px'
    }"
  >
    <bk-input
      type="textarea"
      row="1"
      class="send-input"
      ref="inputRef"
      :disabled="disabled"
      :clearable="false"
      :resize="false"
      :placeholder="placeholder"
      :model-value="modelValue"
      @input="handleValueChange"
    >
    </bk-input>
    <Close
      v-if="modelValue && !disabled"
      class="send-clear"
      @click="handleValueChange('')"
    />
  </section>
</template>

<script lang="ts" setup>
import {
  Input as BkInput,
} from 'bkui-vue';
import {
  Close,
} from 'bkui-vue/lib/icon';
import {
  nextTick,
  onMounted,
  ref,
} from 'vue';

interface IProps {
  modelValue?: string;
  placeholder?: string;
  height: number;
  maxHeight?: number;
  focusShowHeight?: boolean;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<IProps>(),
  {
    maxHeight: 400,
    focusShowHeight: false,
  },
);

const emits = defineEmits(['update:modelValue', 'input']);

const textHeight = ref(props.height);
const inputRef = ref();

const handleValueChange = (val: string, event?: KeyboardEvent) => {
  emits('update:modelValue', val);
  emits('input', val, event);
  nextTick(handleCalcHeight);
};

const handleCalcHeight = () => {
  const elm = inputRef.value.$el.firstElementChild;
  if (elm.scrollHeight > props.height && props.modelValue) {
    textHeight.value = elm.scrollHeight <= props.maxHeight ? elm.scrollHeight : props.maxHeight;
  } else {
    textHeight.value = props.height;
  }
};

onMounted(() => {
  setTimeout(() => {
    handleCalcHeight();
  }, 200);
});
</script>

<style lang="postcss" scoped>
.send-container {
  position: relative;
  &:has(textarea:focus) {
    z-index: 2;
  }
  &:hover {
    .send-clear {
      display: inline-flex !important;
    }
  }
}
.send-input {
  width: 100%;
  flex-direction: row;
  height: var(--origin-height);
  &:has(textarea:focus) {
    height: var(--text-height);
  }
  :deep(textarea) {
    font-size: 12px;
    line-height: 16px;
    padding: 7px;
    resize: none !important;
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      height: 5px;
      border-radius: 3px;
      background-color: #dcdee5;
    }
    &::placeholder {
      line-height: 16px;
    }
  }
}
.send-clear {
  display: none !important;
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #979ba5;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #313238;
  }
}
</style>
