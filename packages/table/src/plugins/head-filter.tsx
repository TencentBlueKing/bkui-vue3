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
import { computed, defineComponent, nextTick, reactive } from 'vue';

import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { AngleDownLine } from '@bkui-vue/icon';
import Popover from '@bkui-vue/popover2';
import { classes, PropTypes, resolveClassName } from '@bkui-vue/shared';

import { LINE_HEIGHT } from '../const';
import { getRowText, resolvePropVal } from '../utils';

export default defineComponent({
  name: 'HeadFilter',
  props: {
    column: PropTypes.any.def({}),
    height: PropTypes.number.def(LINE_HEIGHT),
  },
  emits: ['change'],

  setup(props, { emit }) {
    const { column } = props;
    // const isShow = ref(false);
    const state = reactive({
      isOpen: false,
      checked: [],
    });

    const headClass = computed(() => (classes({
      [resolveClassName('table-head-action')]: true,
      'column-filter': true,
      '--row-height': `${props.height}px`,
      active: state.checked.length,
      opened: state.isOpen,
    })));

    const headFilterContentClass = classes({
      [resolveClassName('table-head-filter')]: true,
    });

    const handlePopShow = (isOpen: boolean) => {
      state.isOpen = isOpen;
    };

    const theme = `light ${resolveClassName('table-head-filter')}`;
    const localData = computed(() => {
      const { list = [] } = column.filter;
      return list.map((item: any) => ({ ...item, checked: state.checked.includes(item.value) }));
    });

    const filterFn = typeof column.filter.filterFn === 'function'
      ? (checked: string[], row: any, index: number, data: any[]) => column.filter
        .filterFn(checked, row, props.column, index, data)
      : (checked: string[], row: any) => (checked.length
        ? checked.includes(getRowText(row, resolvePropVal(column, 'field', [column, row]), column))
        : true);

    const handleBtnSaveClick = () => {
      if (props.column.filter === 'custom') {
        emit('change', [...state.checked], null);
        state.isOpen = false;
        return;
      }

      emit('change', [...state.checked], filterFn);
      state.isOpen = false;
    };

    const handleBtnResetClick = () => {
      if (state.checked.length) {
        state.checked.splice(0, state.checked.length);
        state.isOpen = false;
        nextTick(() => emit('change', state.checked, filterFn));
      }
    };

    return () => <Popover trigger="click"
      isShow={ state.isOpen }
      placement="bottom-end"
      arrow={false}
      offset={0}
      {...{ theme }}
      onAfterShow={ () => handlePopShow(true) }
      onAfterHidden={() => handlePopShow(false)}>
      {
        {
          default: () =>  <AngleDownLine class={headClass.value} />,
          content: () => <div class={ headFilterContentClass }>
            <BkCheckboxGroup class="content-list" v-model={ state.checked }>
              {
                localData.value.map((item: any) => <div class="list-item">
                  <BkCheckbox label={item.value}>
                    {item.text}
                  </BkCheckbox>
                </div>)
              }
            </BkCheckboxGroup>
            <div class="content-footer">
              <span class="btn-filter-save" onClick={handleBtnSaveClick}>确定</span>
              <span class="btn-filter-split"></span>
              <span class={['btn-filter-reset', state.checked.length ?  '' : 'disable']}
                onClick={handleBtnResetClick}>重置</span>
            </div>
          </div>,
        }
      }
      </Popover>;
  },
});
