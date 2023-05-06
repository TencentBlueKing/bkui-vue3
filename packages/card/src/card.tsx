/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
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

import { defineComponent, ref, watch } from 'vue';

import BKCollapseTransition from '@bkui-vue/collapse-transition';
import { AngleDown, AngleRight, EditLine } from '@bkui-vue/icon';
import BkInput from '@bkui-vue/input';
import { classes, PropTypes } from '@bkui-vue/shared';

export default defineComponent({
  name: 'Card',
  props: {
    title: PropTypes.string,
    showHeader: PropTypes.bool.def(true),
    showFooter: PropTypes.bool.def(false),
    collapseStatus: PropTypes.bool.def(true),
    border: PropTypes.bool.def(true),
    disableHeaderStyle: PropTypes.bool.def(false),
    position: PropTypes.string.def('left'),
    isEdit: PropTypes.bool.def(false),
    isCollapse: PropTypes.bool.def(false),
  },
  emits: ['update:collapseStatus', 'edit'],
  setup(props, { emit }) {
    /** 展开&收起的状态 */
    const collapseActive = ref(true);
    /** 是否显示编辑框 */
    const showInput = ref(false);
    const renderTitle = ref('');
    const handleCollapse = () => {
      if (!props.isCollapse) {
        return;
      }
      collapseActive.value = !collapseActive.value;
      emit('update:collapseStatus', collapseActive.value);
    };
    /** 点击编辑按钮 */
    const clickEdit = () => {
      showInput.value = !showInput.value;
    };
    /** 保存编辑的title */
    const saveEdit = () => {
      showInput.value = !showInput.value;
      emit('edit', renderTitle);
    };
    watch(() => props.collapseStatus, (val) => {
      props.isCollapse && (collapseActive.value = val);
    }, { immediate: true });

    watch(() => props.title, (val) => {
      renderTitle.value = val;
    }, { immediate: true });
    return {
      collapseActive,
      showInput,
      renderTitle,
      handleCollapse,
      saveEdit,
      clickEdit,
    };
  },
  render() {
    const wrapperName = 'bk-card';
    const cardClass = classes({
      [`${wrapperName}`]: true,
      [`${wrapperName}-border-none`]: !this.$props.border,
    }, '');
    const headClass = classes({
      [`${wrapperName}-head`]: true,
      [`${wrapperName}-head-${this.$props.position}`]: this.$props.isCollapse && this.$props.position,
      ['no-line-height']: this.$props.disableHeaderStyle,
      ['collapse']: !this.collapseActive,
    }, '');

    const defaultHeader = <div class="title" title={this.renderTitle}>
      { this.showInput ? <BkInput class={`${wrapperName}-input`} v-model={this.renderTitle}
        onBlur={this.saveEdit} /> : this.renderTitle}
    </div>;

    const defaultIcon = <span class={`${wrapperName}-icon`} onClick={this.handleCollapse}>
      { this.collapseActive ? <AngleDown /> : <AngleRight /> }
    </span>;

    return <div class={cardClass}>
      { this.$props.showHeader ? <div class={headClass}>
          { this.$props.isCollapse && (this.$slots.icon?.() ?? defaultIcon)}
          {this.$slots.header?.() ?? defaultHeader}
          { (this.$props.isEdit && !this.showInput)
          && <EditLine class={`${wrapperName}-edit`} onClick={this.clickEdit} /> }
      </div> : ''}
      <BKCollapseTransition>
        <div v-show={this.collapseActive}>
          <div class={`${wrapperName}-body`}>{this.$slots.default?.() ?? 'Content'}</div>
          {
            this.$props.showFooter ? <div class={`${wrapperName}-footer`}>{this.$slots.footer?.() ?? 'Footer'}</div> : ''
          }
        </div>
      </BKCollapseTransition>
    </div>;
  },
});
