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
import { computed, defineComponent, reactive, ref, watch } from 'vue';

import Button from '@bkui-vue/button';
import Checkbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { Funnel } from '@bkui-vue/icon';
import Input from '@bkui-vue/input';
import Popover from '@bkui-vue/popover';
import { classes, PropTypes, RenderType } from '@bkui-vue/shared';

import useCheckboxToolTip from '../hooks/use-checkbox-tooltip';
import { Column, IColumnType, IFilterShape, IHeadFilter } from '../props';

type IHeadFilterPropType = {
  column: Column;
  height: number;
};

const ROW_HEIGHT = 32;

export default defineComponent({
  name: 'HeadFilter',
  directives: {
    bkTooltips,
  },
  props: {
    column: IColumnType,
    height: PropTypes.number.def(ROW_HEIGHT),
  },
  emits: ['change', 'filterSave', 'reset'],

  setup(props: IHeadFilterPropType, { emit }) {
    const { resolveClassName } = usePrefix();
    const { resolveOverflowTips } = useCheckboxToolTip();
    const t = useLocale('table');

    const filter = computed(() => props.column?.filter);
    const checked = computed(() => (filter.value as IFilterShape)?.checked ?? []);

    const searchValue = ref('');
    const filterPopoverRef = ref();
    const allTextRef = ref([]);

    const state = reactive({
      isOpen: false,
      checked: [],
    });

    state.checked.push(...checked.value);

    watch(
      () => checked,
      payload => {
        state.checked.length = 0;
        state.checked = [];
        state.checked.push(...payload.value);
      },
      { deep: true },
    );

    const headClass = computed(() =>
      classes({
        [resolveClassName('table-head-action')]: true,
        'column-filter': true,
        '--row-height': `${props.height}px`,
        active: state.checked.length,
        opened: state.isOpen,
      }),
    );

    const headFilterContentClass = classes({
      [resolveClassName('table-head-filter')]: true,
    });

    const refVirtualRender = ref(null);

    const handlePopShow = (isOpen: boolean) => {
      state.isOpen = isOpen;
      isOpen &&
        setTimeout(() => {
          refVirtualRender.value?.reset();
        });

      if (!isOpen) {
        searchValue.value = '';
      }
    };

    const theme = `light ${resolveClassName('table-head-filter')}`;
    const localData = computed(() => {
      const { list = [] } = filter.value as IFilterShape;
      const filterList = list.filter(l => {
        const reg = getRegExp(searchValue.value);
        return reg.test(l.label) || reg.test(l.text) || reg.test(l.value);
      });
      return filterList;
    });

    const maxLength = 5;
    const maxHeight = computed(() => (filter.value as IFilterShape)?.maxHeight ?? ROW_HEIGHT * maxLength);
    const height = computed(() => {
      const { height, list = [] } = filter.value as IFilterShape;
      return height || list.length * ROW_HEIGHT;
    });
    const minHeight = computed(() => {
      const defaultMin = ROW_HEIGHT * 2;
      if (localData.value.length > maxLength) {
        return maxHeight.value;
      }

      return defaultMin;
    });

    const contentStyle = computed(() => ({
      maxHeight: `${maxHeight.value}px`,
      minHeight: `${minHeight.value}px`,
      height: /%$/.test(`${height.value}`) ? height.value : `${height.value}px`,
    }));

    const getRegExp = (val: boolean | number | string, flags = 'ig') =>
      new RegExp(`${val}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), flags);

    const handleBtnSaveClick = () => {
      handleFilterChange(true);
      emit('filterSave', state.checked);
      state.isOpen = false;
    };

    const handleFilterChange = (btnSaveClick = false) => {
      const { disabled } = resolveBtnOption(btnSave, t.value.confirm);

      if (disabled || btnSaveClick) {
        if (filter.value === 'custom') {
          emit('change', state.checked, null);
          state.isOpen = false;
          return;
        }
        emit('change', state.checked);
      }
    };

    const handleBtnResetClick = () => {
      if (state.checked.length) {
        state.checked.length = 0;
        state.isOpen = false;
        emit('change', state.checked);
        emit('reset', state.checked);
      }
    };

    const resolveBtnOption = (opt: boolean | string, defText: string) => {
      const disabled = opt === 'disabled' || opt === false;
      const text = typeof opt === 'string' ? opt : defText;
      return { disabled, text };
    };

    const { btnSave, btnReset } = filter.value as IFilterShape;

    const renderSaveBtn = () => {
      const { disabled, text } = resolveBtnOption(btnSave, t.value.confirm);
      if (disabled) {
        return <span class='btn-filter-save disabled'>{text}</span>;
      }

      return (
        <Button
          style='width: 56px; margin-right: 8px;'
          size='small'
          theme='primary'
          onClick={handleBtnSaveClick}
        >
          {text}
        </Button>
      );
    };

    const renderResetBtn = () => {
      const { disabled, text } = resolveBtnOption(btnReset, t.value.reset);
      if (disabled) {
        return '';
      }

      return (
        <Button
          style='width: 56px;'
          disabled={state.checked.length === 0}
          size='small'
          onClick={handleBtnResetClick}
        >
          {text}
        </Button>
      );
    };

    const handleValueChange = (val: boolean, item: Record<string, boolean | string>) => {
      const setValue = new Set(state.checked);
      if (val) {
        setValue.add(item.value);
      } else {
        setValue.delete(item.value);
      }

      state.checked.length = 0;
      state.checked.push(...Array.from(setValue));
      (filter.value as { checked?: string[] }).checked = [...state.checked];
      handleFilterChange();
    };

    const renderDisplayTooltip = async () => {
      // 异步延迟解决dom实例加载响应
      await new Promise(resolve => setTimeout(resolve, 0));
      localData.value.forEach((item: IHeadFilter) => {
        if (!Object.prototype.hasOwnProperty.call(item, 'showOverflowTooltip')) {
          item.showOverflowTooltip = resolveOverflowTips(`list-item-${item.value}-ref`, filterPopoverRef, allTextRef);
        }
      });
    };

    const renderFilterList = (scope: IHeadFilter[]) => {
      if (scope.length) {
        renderDisplayTooltip();
        return scope.map((item: IHeadFilter) => (
          <div
            key={item.value}
            ref={filterPopoverRef}
            class='list-item'
            v-bk-tooltips={{
              content: item.tipKey || item.text,
              placement: 'right',
              disabled: !item.showOverflowTooltip,
            }}
          >
            <Checkbox
              checked={state.checked.includes(item.value)}
              immediateEmitChange={false}
              label={item.value}
              modelValue={state.checked.includes(item.value)}
              onChange={val => handleValueChange(val, item)}
            >
              <span ref={el => (allTextRef.value[`list-item-${item.value}-ref`] = el)}>{`${item.text}`}</span>
            </Checkbox>
          </div>
        ));
      }

      return <div class='list-item is-empty'>{t.value.emptyText}</div>;
    };

    return () => (
      <Popover
        arrow={false}
        isShow={state.isOpen}
        offset={0}
        placement='bottom-start'
        renderType={RenderType.SHOWN}
        trigger='click'
        {...{ theme }}
        onAfterHidden={() => handlePopShow(false)}
        onAfterShow={() => handlePopShow(true)}
      >
        {{
          default: () => <Funnel class={headClass.value} />,
          content: () => (
            <div class={headFilterContentClass}>
              <div style='padding: 4px 10px;'>
                <Input v-model={searchValue.value}></Input>
              </div>
              <BkCheckboxGroup class='content-list'>
                <div
                  style={contentStyle.value}
                  class='content-items'
                >
                  {renderFilterList(localData.value)}
                </div>
              </BkCheckboxGroup>
              <div class='content-footer'>
                {renderSaveBtn()}
                {renderResetBtn()}
              </div>
            </div>
          ),
        }}
      </Popover>
    );
  },
});
