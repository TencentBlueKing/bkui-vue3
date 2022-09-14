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
import { computed, defineComponent, ref, watch } from 'vue';

import BkButton from '@bkui-vue/button';
import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { CloseLine, CogShape } from '@bkui-vue/icon/';
import Popover from '@bkui-vue/popover2';
import { PropTypes, resolveClassName } from '@bkui-vue/shared';

import { DEFAULT_SIZE_LIST, LINE_HEIGHT } from '../const';
import { Field, Settings, SizeItem } from '../props';
import { resolvePropVal } from '../utils';

export default defineComponent({
  name: 'Settings',
  props: {
    settings: PropTypes.oneOfType([
      PropTypes.shape<Settings>({
        fields: PropTypes.arrayOf(PropTypes.shape<Field>({
          label: PropTypes.string,
          field: PropTypes.string,
          disabled: PropTypes.bool,
        })),
        checked: PropTypes.arrayOf(PropTypes.string),
        limit: PropTypes.number.def(0),
        size: PropTypes.size(['small', 'medium', 'large']).def('small'),
        sizeList: PropTypes.shape<SizeItem[]>([]),
      }), PropTypes.bool]).def(false),
    columns: PropTypes.array.def([]),
    rowHeight: PropTypes.number.def(LINE_HEIGHT),
  },
  emits: ['change'],
  setup(props, { emit }) {
    const defaultSizeList: SizeItem[] = DEFAULT_SIZE_LIST;

    const checkAll = ref(false);
    const isShow = ref(false);
    const localSettings = typeof props.settings === 'boolean' ? ref({
      fields: props.columns.map((col: any) => ({ ...col, field: col.field || col.type })),
      checked: [],
      limit: 0,
      size: 'small',
      sizeList: defaultSizeList,
    }) : ref(props.settings as Settings);

    const activeSize = ref(localSettings.value.size || 'small');
    const activeHeight = ref(props.rowHeight);

    const checkedFields = ref(localSettings.value.checked);
    const className = resolveClassName('table-settings');
    const theme = `light ${className}`;

    const cachedValue = {
      checkAll: checkAll.value,
      activeSize: activeSize.value,
      activeHeight: activeHeight.value,
    };

    const handleSaveClick = () => {
      emit('change', { checked: checkedFields.value, size: activeSize.value, height: activeHeight.value });
      isShow.value = false;
    };

    const handleCancelClick = () => {
      checkAll.value = cachedValue.checkAll;
      activeSize.value = cachedValue.activeSize;
      activeHeight.value = cachedValue.activeHeight;
      checkedFields.value = localSettings.value.checked || [];
      isShow.value = false;
    };

    const handleSettingClick = () => {
      Object.assign(cachedValue, {
        checkAll: checkAll.value,
        activeSize: activeSize.value,
        activeHeight: activeHeight.value,
      });
      isShow.value = true;
    };

    const handleCheckAllClick = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      checkAll.value = !checkAll.value;
      const fields = (localSettings.value.fields || props.columns || []);
      if (checkAll.value) {
        checkedFields.value = fields
          .map((item: any, index: number) => resolvePropVal(item, 'field', [item, index]));
      } else {
        const readonlyFields = fields.filter((item: any) => item.disabled)
          .map((item: any, index: number) => resolvePropVal(item, 'field', [item, index]));

        checkedFields.value.splice(0, checkedFields.value.length, ...readonlyFields);
      }
    };

    const isLimit = computed(() => (localSettings.value.limit ?? 0) > 0);
    const sizeList = localSettings.value.sizeList || defaultSizeList;
    const isFiledDisabled = computed(() => isLimit.value
      && (localSettings.value.limit ? localSettings.value.limit : 0) <= checkedFields.value.length);

    const isItemReadonly = (item: any, index: number) =>  item.disabled
      || (isFiledDisabled.value
      && !checkedFields.value.includes(resolvePropVal(item, 'field', [item, index])));

    const handleSizeItemClick = (item: SizeItem) => {
      activeSize.value = item.value;
      activeHeight.value = item.height;
    };

    const getItemClass = (item: SizeItem) => ({
      'line-size': true,
      'is-medium': activeSize.value === 'medium',
      active: item.value === activeSize.value,
    });

    const buttonStyle = {
      marginRight: '12px',
    };

    const renderSize = () => sizeList.map(item => <span
      class={ getItemClass(item) }
      onClick={() => handleSizeItemClick(item)}>{ item.label }</span>);

    const renderFields = computed(() => localSettings.value.fields || props.columns || []);

    const indeterminate = computed(() => checkedFields.value.length > 0 && !renderFields.value
      .every((field: any, index: number) => checkedFields.value
        .includes(resolvePropVal(field, 'field', [field, index]))));

    watch(() => [checkedFields.value], () => {
      if (!checkedFields.value.length) {
        checkAll.value = false;
      }

      if (checkedFields.value.length && renderFields.value
        .every((field: any, index: number) => checkedFields.value
          .includes(resolvePropVal(field, 'field', [field, index])))) {
        checkAll.value = true;
      }
    }, { immediate: true, deep: true });

    watch(() => [(props.settings as Settings).checked], () => {
      checkedFields.value.splice(0, checkedFields.value.length, ...localSettings.value.checked);
    }, { immediate: true, deep: true });

    return () => (props.settings ? <Popover trigger="manual" isShow={isShow.value}
      placement="bottom-end"
      arrow={false}
      {...{ theme }}>
      {
        {
          default: () =>  <span class="table-head-settings" onClick={ handleSettingClick }>
            <CogShape style="color: #c4c6cc;" ></CogShape>
          </span>,
          content: () => <div class="setting-content">
            <div class="setting-head">
              <span class="head-title">表格设置</span>
              <CloseLine class='icon-close-action' onClick={handleCancelClick}></CloseLine>
            </div>
            <div class="setting-body">
              <div class="setting-body-title">
                <div>
                  <span class="field-setting-label">字段显示设置</span>
                  { isLimit.value ? <span class="limit">（最多{localSettings.value.limit}项）</span> : '' }</div>
                  { isLimit.value ? '' : <span class="check-all" onClick={handleCheckAllClick}>
                      <BkCheckbox label="全选"
                        indeterminate={ Boolean(indeterminate.value) }
                        modelValue={ checkedFields.value.length > 0 }>全选</BkCheckbox>
                    </span>
                  }
              </div>
              <BkCheckboxGroup class="setting-body-fields" v-model={ checkedFields.value }>
                {
                  (renderFields.value).map((item: any, index: number) => <div class="field-item">
                    <BkCheckbox label={ resolvePropVal(item, 'field', [item, index]) }
                      checked={ checkedFields.value.includes(resolvePropVal(item, 'field', [item, index])) }
                      disabled={isItemReadonly(item, index)}>
                      { resolvePropVal(item, 'label', [item, index]) }
                    </BkCheckbox>
                  </div>)
                }
              </BkCheckboxGroup>
              <div class="setting-body-line-height">
              表格行高：{ renderSize() }
              </div>
            </div>
            <div class="setting-footer">
                <BkButton theme='primary' style={buttonStyle} onClick={handleSaveClick}>确定</BkButton>
                <BkButton style={buttonStyle} onClick={handleCancelClick}>取消</BkButton>
            </div>
          </div>,
        }
      }
    </Popover> : '');
  },
});
