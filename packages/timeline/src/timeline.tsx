/**
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

import { defineComponent, ExtractPropTypes, shallowRef, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes } from '@bkui-vue/shared';

const timelineProps = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      type: PropTypes.string,
      size: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.func,
      filled: PropTypes.bool,
      border: PropTypes.bool,
      nodeType: PropTypes.timelineNodeType(),
    }).isRequired,
  ),
  titleAble: PropTypes.bool.def(false),
};

export type TimelinePropTypes = Readonly<ExtractPropTypes<typeof timelineProps>>;

export default defineComponent({
  name: 'Timeline',
  props: timelineProps,
  emits: ['select'],

  setup(props, { emit }) {
    const defaultTimelines = shallowRef<TimelinePropTypes['list']>([]);

    const { resolveClassName } = usePrefix();

    const handleTitleSelect = item => {
      emit('select', item);
    };

    watch(
      () => props.list,
      () => {
        defaultTimelines.value = props.list.map(item => ({
          tag: item.tag,
          content: item.content,
          type: item.type,
          size: item.size,
          color: item.color,
          icon: item.icon,
          filled: item.filled,
          border: item.border ?? true,
          nodeType: item.nodeType || 'template',
        }));
      },
      {
        immediate: true,
        deep: true,
      },
    );

    return {
      defaultTimelines,
      handleTitleSelect,
      resolveClassName,
    };
  },

  render() {
    const isIcon = timeline => {
      const { icon } = timeline;
      return typeof icon === 'object' || typeof icon === 'function';
    };

    const makeClass = (item: TimelinePropTypes['list'][number]) => {
      const timelineClsPrefix = this.resolveClassName('timeline');
      const dotColors = ['blue', 'red', 'green', 'yellow', 'gray'];
      const timelineThemeCls: string = item.type ? `${timelineClsPrefix}-${item.type}` : `${timelineClsPrefix}-default`;
      const timelineSizeCls: string = item.size ? `${timelineClsPrefix}-${item.size}` : '';
      const timelineFilledCls: string = item.filled ? `${timelineClsPrefix}-filled` : '';
      const timelinesColorsCls: string =
        item.color && dotColors.includes(item.color) ? `${timelineClsPrefix}-${item.color}` : '';
      const timelineCustomIcon: string = isIcon(item) ? `${timelineClsPrefix}-custom` : '';
      const timelinesCls: string = classes(
        {},
        `${timelineClsPrefix} ${timelineThemeCls} ${timelineSizeCls} ${timelinesColorsCls} ${timelineFilledCls} ${timelineCustomIcon}`,
      );
      return timelinesCls;
    };

    const renderContent = (item: TimelinePropTypes['list'][number]) => {
      if (this.$slots.content) {
        return <div class={`${this.resolveClassName('timeline-content')}`}>{this.$slots.content(item)}</div>;
      }
      if (item.nodeType === 'vnode') {
        return <div class={`${this.resolveClassName('timeline-content')}`}>{item.content}</div>;
      }
      return (
        <div
          class={`${this.resolveClassName('timeline-content')}`}
          v-html={item.content}
        />
      );
    };

    return (
      <ul class={this.resolveClassName('timeline')}>
        {this.defaultTimelines.map(item => (
          <li class={[`${this.resolveClassName('timeline-dot')}`, makeClass(item)]}>
            {isIcon(item) && (
              <div
                class={`${this.resolveClassName('timeline-icon')}`}
                style={{
                  border: item.border ? `2px solid ${item.color}` : '0px',
                  borderRadius: item.border ? '50%' : '0',
                }}
              >
                <span class={`${this.resolveClassName('timeline-icon-inner')}`}>
                  {typeof item.icon === 'function' ? <item.icon /> : item.icon}
                </span>
              </div>
            )}
            <div class={`${this.resolveClassName('timeline-section')}`}>
              {
                <div
                  class={`${this.resolveClassName('timeline-title')}`}
                  onClick={() => this.handleTitleSelect(item)}
                >
                  {item.nodeType === 'vnode' ? item.tag : <span v-html={item.tag}></span>}
                </div>
              }
              {renderContent(item)}
            </div>
          </li>
        ))}
      </ul>
    );
  },
});
