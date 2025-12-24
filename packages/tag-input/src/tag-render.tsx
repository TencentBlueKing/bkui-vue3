/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { computed, defineComponent, h, onMounted, PropType, ref, watch } from 'vue';

import { bkTooltips } from '@bkui-vue/directives';
import { type IOptions } from '@bkui-vue/directives';
import { checkOverflow, PropTypes } from '@bkui-vue/shared';
import has from 'lodash/has';

export default defineComponent({
  name: 'TagRender',
  directives: {
    bkTooltips,
  },
  props: {
    node: PropTypes.object,
    displayKey: PropTypes.string,
    tooltipKey: PropTypes.string,
    tpl: {
      type: Function,
    },
    hasTips: {
      type: Boolean,
      default: false,
    },
    tagOverflowTips: {
      type: Object as PropType<Partial<IOptions>>,
      default: () => ({}),
    },
    allowCreate: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['dblclick', 'change'],
  setup(props, { emit }) {
    const tagRef = ref();
    const isOverflow = ref(false);
    const overflowTips = computed(() => ({
      boundary: 'window',
      theme: 'light',
      distance: 12,
      content: props.node[props.tooltipKey],
      disabled: !has(props.node, props.tooltipKey) || !isOverflow.value,
      ...props.tagOverflowTips,
    }));

    const editRef = ref<HTMLElement>();
    const showEdit = ref(false);
    const clickTimer = ref<null | number>(null);

    const handleClick = () => {
      if (clickTimer.value) {
        clearTimeout(clickTimer.value);
      }

      clickTimer.value = window.setTimeout(() => {
        // timer 为 null 说明是双击
        if (clickTimer.value === null) {
          return;
        }
        clickTimer.value = null;
      }, 200);
    };

    const handleDblclick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 阻止单击事件执行
      if (clickTimer.value) {
        clearTimeout(clickTimer.value);
        clickTimer.value = null;
      }

      showEdit.value = true;
      emit('dblclick', true);
      setTimeout(() => {
        editRef.value?.focus();
      }, 0);
    };

    const handleEditBlur = () => {
      showEdit.value = false;
      emit('dblclick', false);
    };

    const handleEditFocus = () => {
      showEdit.value = true;
    };

    const handleEditChange = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      emit('change', val);
    };

    const handleEditKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) && !e.isComposing) {
        const val = (e.target as HTMLInputElement).value;
        emit('change', val);
        setTimeout(() => {
          handleEditBlur();
        }, 100);
      }
    };

    const handleEditInput = (e: Event) => {
      // console.error('handleEditInputhandleEditInputhandleEditInput', (e.target as HTMLInputElement).value, props.node);
      // emit('input', e.target.value);
      const val = (e.target as HTMLInputElement).value;
      editValue.value = val;
    };

    const editValue = ref(props.node[props.displayKey]);

    watch(() => props.node[props.displayKey], val => {
      editValue.value = val;
    });

    onMounted(() => {
      isOverflow.value = checkOverflow(tagRef.value);
    });

    return {
      overflowTips,
      tagRef,
      editRef,
      handleClick,
      handleDblclick,
      showEdit,
      handleEditBlur,
      handleEditFocus,
      handleEditChange,
      handleEditKeyDown,
      handleEditInput,
      editValue,
    };
  },
  render() {
    if (this.tpl) {
      return this.tpl(this.node, h, this);
    }

    return (
      <div
        ref='tagRef'
        class='tag'
        v-bk-tooltips={this.overflowTips}
      >
        {this.showEdit ? (
          <input
            ref='editRef'
            class='dblclick-edit-input'
            type='text'
            // value={this.node[this.displayKey]}
            value={this.editValue}
            onBlur={this.handleEditBlur}
            onChange={this.handleEditChange}
            onFocus={this.handleEditFocus}
            onInput={this.handleEditInput}
            onKeydown={this.handleEditKeyDown}
          />
        ) : null}
        <span
          class='text'
          onClick={this.allowCreate ? this.handleClick : undefined}
          onDblclick={this.allowCreate ? this.handleDblclick : undefined}
        >
          {/* {this.node[this.displayKey]} */}
          {this.editValue}
        </span>
      </div>
    );
  },
});
