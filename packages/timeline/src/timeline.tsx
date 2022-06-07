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

import { defineComponent, ExtractPropTypes, onMounted, ref, watch } from 'vue';

import { classes, PropTypes } from '@bkui-vue/shared';

const timelineProps = {
  list: PropTypes.array.def([]),
  titleAble: PropTypes.bool.def(false),
  extCls: PropTypes.string,

};

export type TimelinePropTypes = ExtractPropTypes<typeof timelineProps>;

export default defineComponent({
  name: 'Timeline',
  props: timelineProps,
  emits: ['select'],

  setup(props: TimelinePropTypes, { emit }) {
    const defaultTimelines = ref([]);

    const updateTimelines = (timelines) => {
      const defaults = [];
      timelines.forEach((timeline) => {
        defaults.push({
          tag: timeline.tag,
          content: timeline.content,
          type: timeline.type,
          size: timeline.size,
          color: timeline.color,
          icon: timeline.icon,
          filled: timeline.filled,
          border: timeline.border ?? true,
        });
      });
      defaultTimelines.value.splice(0, defaultTimelines.value.length, ...defaults);
    };

    const init = () => {
      defaultTimelines.value.splice(0, defaultTimelines.value.length, ...[
        {
          tag: '步骤1',
          content: '内容1',
        },
        {
          tag: '步骤2',
          content: '内容2',
        },
        {
          tag: '步骤3',
          content: '内容3',
        },
      ]);
      if (props.list?.length) {
        updateTimelines(props.list);
      }
    };

    const titleSelect = (item) => {
      try {
        emit('select', item);
      } catch (e) {
        console.warn(e);
      }
    };

    onMounted(init);

    watch(() => props.list, () => {
      updateTimelines(props.list);
    }, { deep: true });

    return {
      defaultTimelines,
      titleSelect,
    };
  },

  render() {
    const isIcon = (timeline) => {
      const { icon } = timeline;

      if (icon) {
        return Object.prototype.toString.call(icon) === '[object Object]';
      }
      return false;
    };

    const makeClass = (item) => {
      const timelineClsPrefix = 'bk-timeline';
      const dotColors = ['blue', 'red', 'green', 'yellow', 'gray'];
      const timelineThemeCls: string = item.type ? `${timelineClsPrefix}-${item.type}` : `${timelineClsPrefix}-default`;
      const timelineSizeCls: string = item.size ? `${timelineClsPrefix}-${item.size}` : '';
      const timelineFilledCls: string = item.filled ? `${timelineClsPrefix}-filled` : '';
      const timelinesColorsCls: string = (item.color && dotColors.includes(item.color)) ? `${timelineClsPrefix}-${item.color}` : '';
      const timelinesCls: string = classes({}, `${timelineClsPrefix} ${timelineThemeCls} ${timelineSizeCls} ${timelinesColorsCls} ${timelineFilledCls}`);
      return timelinesCls;
    };

    return (
      <ul class={['bk-timeline', this.extCls]}>
        {
        this.defaultTimelines.map(item => <li class={['bk-timeline-dot', makeClass(item)]}>
          {isIcon(item)
            ? <div class="bk-timeline-icon" style={{ borderWidth: item.border ? '2px' : '0px' }}>
                <span class="bk-timeline-icon-inner">{item.icon}</span>
              </div> : ''}
              <div class="bk-timeline-section">
                {<div class="bk-timeline-title" onClick={() => {
                  this.titleSelect(item);
                }}>{this.$slots.default?.() ?? <span v-html={item.tag}></span>}</div>}
                {item.content ? <div class="bk-timeline-content" v-html={item.content}></div> : ''}
              </div>
        </li>)
          }
      </ul>
    );
  },

});
