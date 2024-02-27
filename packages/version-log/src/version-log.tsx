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

import { defineComponent, ExtractPropTypes, ref, computed, watch } from 'vue';
import { PropTypes } from '@bkui-vue/shared';
import BkDialog from '@bkui-vue/dialog';
import BkLoading from '@bkui-vue/loading';
import ResizeLayout from '@bkui-vue/resize-layout';
import { usePrefix } from '@bkui-vue/config-provider';
import MarkdownIt from 'markdown-it';

const versionLogProps = {
  show: PropTypes.bool, // 是否显示版本日志弹窗
  list: PropTypes.arrayOf(PropTypes.object).def([]), // 版本列表
  titleKey: PropTypes.string.def('title'),
  subTitleKey: PropTypes.string.def('date'),
  detailKey: PropTypes.string.def('detail'),
  active: PropTypes.string, // 当前查看选中版本，默认值为list属性传入值的第一个版本
  current: PropTypes.string, // 当前最新的版本，默认值为list属性传入值的第一个版本
  loading: PropTypes.bool.def(false), // 版本详情区域loading
  detail: PropTypes.string.def(''), // 日志详情内容, 即markdown字符串
  minLeftWidth: PropTypes.number.def(180), // 左侧版本列表区域拖动最小宽度
  maxLeftWidth: PropTypes.number.def(500), // 左侧版本列表区域拖动最大宽度
};

export type versionLogPropTypes = ExtractPropTypes<typeof versionLogProps>;

export default defineComponent({
  name: 'VersionLog',
  props: versionLogProps,
  emits: ['update:show', 'selected'],
  setup(props, { slots, emit }) {

    const dialogWidth = ref(850);
    const dialogHeight = ref(520);
    const activeVersion = ref('');
    const versionDetail = ref(''); // 日志详情
    const detailRef = ref();

    const { resolveClassName } = usePrefix();
    const versionLogClsPrefix = resolveClassName('version-log');

    const crtVersion = computed(() => props.current || (props.list.length ? props.list[0][props.titleKey] : ''));

    watch(() => props.show, (val) => {
      if (val) {
        let content = '';
        dialogWidth.value = window.innerWidth >= 1920 ? 1110 : 850;
        dialogHeight.value = window.innerWidth >= 1920 ? 640 : 520
        if (props.active) {
          const version = props.list.find(item => item[props.titleKey] === props.active);
          content = version?.[props.detailKey] || '';
          activeVersion.value = props.active;
        } else {
          if (props.list.length > 0) {
            content = props.list[0][props.detailKey] || '';
            activeVersion.value = props.list[0][props.titleKey] || '';
            emit('selected', props.list[0]);
          }
        }
        versionDetail.value = parseMarkdownStr(content);
      }
    });

    watch(() => props.active, (val) => {
      if (val) {
        activeVersion.value = val;
      }
    });

    watch(() => props.detail, (val) => {
      versionDetail.value = parseMarkdownStr(val);
    });

    const parseMarkdownStr = (content: string = '') => {
      if (content) {
        const md = new MarkdownIt();
        return md.render(content);
      }
      return '';
    }

    const handleSelect = (version: { [key: string]: string }) => {
      activeVersion.value = version[props.titleKey];
      versionDetail.value = parseMarkdownStr(version[props.detailKey] || '');
      detailRef.value?.scrollTo({ top: 0 });
      emit('selected', version);
    };

    return () => (
      <BkDialog
        dialog-type='show'
        scrollable={false}
        ext-cls={`${versionLogClsPrefix}-dialog`}
        width={dialogWidth.value}
        height={dialogHeight.value}
        is-show={props.show}
        onClosed={() => emit('update:show', false)}>
        {{
          header: () => <div class={`${versionLogClsPrefix}-header`}></div>,
          default: () => (
            <div class={versionLogClsPrefix}>
              <ResizeLayout
                initial-divide={180}
                min={props.minLeftWidth}
                max={props.maxLeftWidth}>
                {{
                  aside: () => (
                    <div class={`${versionLogClsPrefix}-list-side`}>
                      {
                        slots.list
                        ? slots.list()
                        : props.list.map(version => {
                            return (
                              <div
                                class={`${versionLogClsPrefix}-version-item${activeVersion.value === version[props.titleKey] ? ' is-active' : ''}`}
                                onClick={() => handleSelect(version)}>
                                { crtVersion.value === version[props.titleKey] && <div class={`${versionLogClsPrefix}-crt-tag`}>当前版本</div> }
                                <div class={`${versionLogClsPrefix}-version-item-title`}>{version[props.titleKey]}</div>
                                <div class={`${versionLogClsPrefix}-version-item-subtitle`}>{version[props.subTitleKey]}</div>
                              </div>
                            )
                          })
                      }
                    </div>
                  ),
                  main: () => {
                    if (props.loading) {
                      return (
                        <div class={`${versionLogClsPrefix}-loading`}>
                          <BkLoading loading={props.loading} theme='default' />
                        </div>
                      )
                    }

                    return <div class={`${versionLogClsPrefix}-detail`}>
                      {
                        slots.detail
                        ? slots.detail()
                        : <div
                            ref={detailRef}
                            class={`${versionLogClsPrefix}-detail-content`}
                            v-html={versionDetail.value} />
                      }
                    </div>
                  }
                }}
              </ResizeLayout>
            </div>
          )
        }}
      </BkDialog>
    )
  },
});
