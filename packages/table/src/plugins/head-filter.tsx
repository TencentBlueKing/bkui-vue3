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
import { computed, defineComponent, nextTick, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { Funnel } from '@bkui-vue/icon';
import Popover from '@bkui-vue/popover';
import { classes, PropTypes, RenderType, resolveClassName } from '@bkui-vue/shared';
import VirtualRender from '@bkui-vue/virtual-render';

import { LINE_HEIGHT } from '../const';
import { getRowText, resolvePropVal } from '../utils';

export default defineComponent({
  name: 'HeadFilter',
  props: {
    column: PropTypes.any.def({}),
    height: PropTypes.number.def(LINE_HEIGHT),
  },
  emits: ['change', 'filterSave'],

  setup(props, { emit }) {
    const { t } = useI18n();
    const { column } = props;
    const state = reactive({
      isOpen: false,
      checked: [],
    });

    const headClass = computed(() => classes({
      [resolveClassName('table-head-action')]: true,
      'column-filter': true,
      '--row-height': `${props.height}px`,
      active: state.checked.length,
      opened: state.isOpen,
    }));

    const headFilterContentClass = classes({
      [resolveClassName('table-head-filter')]: true,
    });

    const refVirtualRender = ref(null);

    const handlePopShow = (isOpen: boolean) => {
      state.isOpen = isOpen;
      isOpen
        && setTimeout(() => {
          refVirtualRender.value.reset();
        });
    };

    const theme = `light ${resolveClassName('table-head-filter')}`;
    const localData = computed(() => {
      const { list = [] } = column.filter;
      return list;
    });

    const getRegExp = (searchValue: string | number | boolean, flags = 'ig') => new RegExp(`${searchValue}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), flags);

    const defaultFilterFn = (checked: string[], row: any) => {
      const { match } = column.filter;
      const matchText = getRowText(row, resolvePropVal(column, 'field', [column, row]), column);
      if (match === 'full') {
        checked.includes(matchText);
      }

      return checked.some((str: string) => getRegExp(str, 'img').test(matchText));
    };

    const filterFn =      typeof column.filter.filterFn === 'function'
      // eslint-disable-next-line max-len
      ? (checked: string[], row: any, index: number, data: any[]) => column.filter.filterFn(checked, row, props.column, index, data)
      : (checked: string[], row: any) => (checked.length ? defaultFilterFn(checked, row) : true);

    const handleBtnSaveClick = () => {
      handleFilterChange(true);
      emit('filterSave', [...state.checked]);
      state.isOpen = false;
    };

    const handleFilterChange = (btnSaveClick = false) => {
      const { disabled } = resolveBtnOption(btnSave, '确定');

      if (disabled || btnSaveClick) {
        if (props.column.filter === 'custom') {
          emit('change', [...state.checked], null);
          state.isOpen = false;
          return;
        }

        emit('change', [...state.checked], filterFn);
      }
    };

    const handleBtnResetClick = () => {
      if (state.checked.length) {
        state.checked.length = 0;
        state.isOpen = false;
        nextTick(() => emit('change', state.checked, filterFn));
      }
    };

    const resolveBtnOption = (opt: string | boolean, defText: string) => {
      const disabled = opt === 'disabled' || opt === false;
      const text = typeof opt === 'string' ? opt : defText;
      return { disabled, text };
    };

    const { btnSave, btnReset } = column.filter;

    const renderSaveBtn = () => {
      const { disabled, text } = resolveBtnOption(btnSave, t('确定'));
      if (disabled) {
        return <span class='btn-filter-save disabled'>{text}</span>;
      }

      return (
        <span class='btn-filter-save' onClick={handleBtnSaveClick}>
          {text}
        </span>
      );
    };

    const renderResetBtn = () => {
      const { disabled, text } = resolveBtnOption(btnReset, t('重置'));
      if (disabled) {
        return '';
      }

      return (
        <span class={['btn-filter-reset', state.checked.length ? '' : 'disable']} onClick={handleBtnResetClick}>
          {text}
        </span>
      );
    };

    const handleValueChange = (val, item) => {
      const setValue = new Set(state.checked);
      if (val) {
        setValue.add(item.value);
      } else {
        setValue.delete(item.value);
      }

      state.checked.length = 0;
      state.checked.push(...Array.from(setValue));
      handleFilterChange();
    };

    const renderFilterList = (scope) => {
      if (scope.data.length) {
        return scope.data.map((item: any) => <div class="list-item">
          <BkCheckbox label={item.value}
            key={ item.$index }
            immediateEmitChange = {false}
            checked={ state.checked.includes(item.value) }
            modelValue={ state.checked.includes(item.value) }
            onChange={ val => handleValueChange(val, item) }>
              { `${item.text}` }
          </BkCheckbox>
        </div>);
      }

      return <div class="list-item is-empty">{ t('暂无数据') }</div>;
    };

    return () => (
      <Popover
        trigger='click'
        isShow={state.isOpen}
        placement='bottom-start'
        renderType={RenderType.SHOWN}
        arrow={false}
        offset={0}
        {...{ theme }}
        onAfterShow={() => handlePopShow(true)}
        onAfterHidden={() => handlePopShow(false)}
      >
        {{
          default: () => <Funnel class={headClass.value} />,
          content: () => (
            <div class={headFilterContentClass}>
              <BkCheckboxGroup class='content-list'>
                <VirtualRender
                  lineHeight={32}
                  list={localData.value}
                  throttleDelay={0}
                  scrollEvent={true}
                  ref={refVirtualRender}
                  className="content-items"
                >
                  {{
                    default: renderFilterList,
                  }}
                </VirtualRender>
              </BkCheckboxGroup>
              <div class='content-footer'>
                {renderSaveBtn()}
                <span class='btn-filter-split'></span>
                {renderResetBtn()}
              </div>
            </div>
          ),
        }}
      </Popover>
    );
  },
});
