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
import { Close, CogShape } from '@bkui-vue/icon/';
import Popover from '@bkui-vue/popover';
import { PropTypes, resolveClassName } from '@bkui-vue/shared';

import { Field, Settings } from '../props';

import './settings.less';

export default defineComponent({
  name: 'Settings',
  props: {
    settings: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<Settings>({
      fields: PropTypes.shape<Field[]>([]).def([]),
      checked: PropTypes.shape<string[]>([]).def([]),
      limit: PropTypes.number.def(null),
      size: PropTypes.string.def(null),
    })]).def(false),
  },
  emits: ['change'],
  setup(props, { emit }) {
    const modifiers = [{
      name: 'offset',
      options: {
        offset: [10, 10],
      },
    }];

    const isShow = ref(false);
    const settings = (props.settings as Settings);
    const activeSize = ref(settings.size ?? '');
    const checkedFields = ref(settings.checked ?? []);
    const className = resolveClassName('table-settings');
    const theme = `light ${className}`;

    const handleSaveClick = () => {
      emit('change', { checked: checkedFields.value, size: activeSize.value });
      isShow.value = false;
    };


    const handleCancelClick = () => {
      activeSize.value = 'default';
      checkedFields.value = settings.checked ?? [];
      isShow.value = false;
    };

    const handleSettingClick = () => {
      isShow.value = true;
    };

    const handleCheckAllClick = () => {
      checkedFields.value = (settings.fields ?? []).map((field: Field) => field.value);
    };

    const isLimit = computed(() => (settings.limit ?? 0) > 0);
    const sizeList = [{ size: 'small', name: '小' }, { size: 'default', name: '中' }, { size: 'large', name: '大' }];
    const isFiledDisabled = computed(() => isLimit.value && (settings.limit ?? 0) <= checkedFields.value.length);

    const isItemReadonly = (item: any) => isFiledDisabled.value && !checkedFields.value.includes(item.value);
    const handleSizeItemClick = (item: any) => {
      activeSize.value = item.size;
    };

    const getItemClass = (item: any) => ({
      'line-size': true,
      'is-default': activeSize.value === 'default',
      active: item.size === activeSize.value,
    });

    const buttonStyle = {
      width: '85px',
      marginRight: '5px',
    };

    const renderSize = () => sizeList.map(item => <span
      class={ getItemClass(item) }
      onClick={() => handleSizeItemClick(item)}>{ item.name }</span>);

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
            <Close class='icon-close-action' onClick={handleCancelClick}></Close>
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
                (settings.fields ?? []).map((item: any) => <div class="field-item">
                  <BkCheckbox label={item.value} disabled={isItemReadonly(item)}>
                    {item.name}
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
