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
import { computed, defineComponent, ref } from 'vue';

import BkButton from '@bkui-vue/button';
import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { CloseLine, CogShape } from '@bkui-vue/icon/';
import Popover from '@bkui-vue/popover';
import { PropTypes, resolveClassName } from '@bkui-vue/shared';

import { Field, Settings, SizeItem } from '../props';
import { resolvePropVal } from '../utils';

export default defineComponent({
  name: 'Settings',
  props: {
    settings: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<Settings>({
      fields: PropTypes.shape<Field[]>([]).def(undefined),
      checked: PropTypes.shape<string[]>([]).def(undefined),
      limit: PropTypes.number.def(undefined),
      size: PropTypes.string.def(undefined),
    })]).def(false),
    columns: PropTypes.array.def([]),
    rowHeight: PropTypes.number.def(40),
  },
  emits: ['change'],
  setup(props, { emit }) {
    const defaultSizeList: SizeItem[] = [
      { value: 'small', label: '小', height: 32 },
      { value: 'default', label: '中', height: props.rowHeight },
      { value: 'large', label: '大', height: 56 },
    ];

    const modifiers = [{
      name: 'offset',
      options: {
        offset: [10, 10],
      },
    }];

    const isShow = ref(false);
    const settings = (props.settings as Settings);
    const activeSize = ref(settings.size ?? 'default');
    const activeHeight = ref(props.rowHeight);

    const checkedFields = ref(settings.checked ?? []);
    const className = resolveClassName('table-settings');
    const theme = `light ${className}`;

    const handleSaveClick = () => {
      emit('change', { checked: checkedFields.value, size: activeSize.value, height: activeHeight.value });
      isShow.value = false;
    };


    const handleCancelClick = () => {
      activeSize.value = 'default';
      activeHeight.value = props.rowHeight;
      checkedFields.value = settings.checked ?? [];
      isShow.value = false;
    };

    const handleSettingClick = () => {
      isShow.value = true;
    };

    const handleCheckAllClick = () => {
      checkedFields.value = (settings.fields ?? props.columns ?? [])
        .map((item: any, index: number) => resolvePropVal(item, 'field', [item, index]));
    };

    const isLimit = computed(() => (settings.limit ?? 0) > 0);
    const sizeList = settings.sizeList ?? defaultSizeList;
    const isFiledDisabled = computed(() => isLimit.value && (settings.limit ?? 0) <= checkedFields.value.length);

    const isItemReadonly = (item: any, index: number) => isFiledDisabled.value
      && !checkedFields.value.includes(resolvePropVal(item, 'field', [item, index]));

    const handleSizeItemClick = (item: SizeItem) => {
      activeSize.value = item.value;
      activeHeight.value = item.height;
    };

    const getItemClass = (item: SizeItem) => ({
      'line-size': true,
      'is-default': activeSize.value === 'default',
      active: item.value === activeSize.value,
    });

    const buttonStyle = {
      width: '85px',
      marginRight: '5px',
    };

    const renderSize = () => sizeList.map(item => <span
      class={ getItemClass(item) }
      onClick={() => handleSizeItemClick(item)}>{ item.label }</span>);

    return () => <Popover trigger="manual" isShow={isShow.value}
    placement="bottom-end"
    arrow={false}
    {...{ modifiers, theme }}
    boundary={ document.body }>
    {
      {
        default: () =>  <CogShape style="color: rgba(99,101,110, 0.6);" onClick={ handleSettingClick }></CogShape>,
        content: () => <div class="setting-content">
          <div class="setting-head">
            <h2>表格设置</h2>
            <CloseLine class='icon-close-action' onClick={handleCancelClick}></CloseLine>
          </div>
          <div class="setting-body">
            <div class="setting-body-title">
              <div>
                <span>字段显示设置</span>
                { isLimit.value ? <span class="limit">（最多{settings.limit}项）</span> : '' }</div>
                { isLimit.value ? '' : <span class="check-all" onClick={handleCheckAllClick}>全选</span>}
            </div>
            <BkCheckboxGroup class="setting-body-fields" v-model={ checkedFields.value }>
              {
                (settings.fields ?? props.columns ?? []).map((item: any, index: number) => <div class="field-item">
                  <BkCheckbox label={ resolvePropVal(item, 'field', [item, index]) }
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
    </Popover>;
  },
});
