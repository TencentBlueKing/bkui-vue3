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
import { computed, defineComponent, ref, unref, watch } from 'vue';

import BkButton from '@bkui-vue/button';
import BkCheckbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { useLocale } from '@bkui-vue/config-provider';
import { CloseLine, CogShape } from '@bkui-vue/icon/';
import Popover from '@bkui-vue/popover';
import { PropTypes, resolveClassName } from '@bkui-vue/shared';

import { createDefaultSizeList, LINE_HEIGHT } from '../const';
import { Field, Settings, SettingSizeEnum, settingSizeType, SizeItem } from '../props';
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
        size: settingSizeType.def(SettingSizeEnum.SMALL),
        sizeList: PropTypes.shape<SizeItem[]>([]),
        showLineHeight: PropTypes.bool.def(true),
      }), PropTypes.bool]).def(false),
    columns: PropTypes.array.def([]),
    rowHeight: PropTypes.number.def(LINE_HEIGHT),
  },
  emits: ['change'],
  setup(props, { emit }) {
    const t = useLocale('table');
    const defaultSizeList: SizeItem[] = createDefaultSizeList(t);
    const resolvedColVal = (item, index) => resolvePropVal(item, ['field', 'type'], [item, index]);
    const checkAll = ref(false);
    const isShow = ref(false);

    const localSettings = computed(() => {
      if (typeof props.settings === 'boolean') {
        return {
          fields: props.columns.map((col: any) => ({ ...col, field: col.field || col.type })),
          checked: [],
          limit: 0,
          size: 'small',
          sizeList: defaultSizeList,
          showLineHeight: true,
        };
      }

      return props.settings;
    });
    const activeSize = ref(localSettings.value.size || 'small');
    const activeHeight = ref(props.rowHeight);

    const checkedFields = ref(localSettings.value.checked || []);
    const className = resolveClassName('table-settings');
    const theme = `light ${className}`;
    const renderFields = computed(() => localSettings.value.fields || props.columns || []);

    const cachedValue = {
      checkAll: checkAll.value,
      activeSize: activeSize.value,
      activeHeight: activeHeight.value,
      checkedFields: localSettings.value.checked || [],
    };

    const handleSaveClick = () => {
      Object.assign(cachedValue, {
        checkAll: checkAll.value,
        activeSize: activeSize.value,
        activeHeight: activeHeight.value,
        checkedFields: checkedFields.value,
      });
      emit('change', { checked: checkedFields.value, size: activeSize.value, height: activeHeight.value, fields: unref(renderFields) });
      isShow.value = false;
    };

    const handleCancelClick = () => {
      checkAll.value = cachedValue.checkAll;
      activeSize.value = cachedValue.activeSize;
      activeHeight.value = cachedValue.activeHeight;
      checkedFields.value = cachedValue.checkedFields;
      isShow.value = false;
    };

    const handleSettingClick = () => {
      isShow.value = true;
    };

    const handleCheckAllClick = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      checkAll.value = !checkAll.value;
      const fields = (localSettings.value.fields || props.columns || []);
      const readonlyFields = fields
        .filter((f, index) => f.disabled && checkedFields.value.includes(resolvedColVal(f, index)))
        .map((item: any, index: number) => resolvedColVal(item, index));
      if (checkAll.value) {
        const allFields = fields
          .filter(f => !f.disabled)
          .map((item: any, index: number) => resolvedColVal(item, index));
        checkedFields.value.splice(0, checkedFields.value.length, ...allFields, ...readonlyFields);
      } else {
        checkedFields.value.splice(0, checkedFields.value.length, ...readonlyFields);
      }
    };

    const isLimit = computed(() => (localSettings.value.limit ?? 0) > 0);
    const sizeList = localSettings.value.sizeList || defaultSizeList;
    const isFiledDisabled = computed(() => isLimit.value
      && (localSettings.value.limit ? localSettings.value.limit : 0) <= checkedFields.value.length);

    const isItemReadonly = (item: any, index: number) => item.disabled
      || (isFiledDisabled.value
        && !checkedFields.value.includes(resolvedColVal(item, index)));

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
      class={getItemClass(item)}
      onClick={() => handleSizeItemClick(item)}>{item.label}</span>);

    const indeterminate = computed(() => checkedFields.value.length > 0 && !renderFields.value
      .every((field: any, index: number) => checkedFields.value
        .includes(resolvePropVal(field, 'field', [field, index]))));
    const showLineHeight = computed(() => (typeof localSettings.value.showLineHeight === 'boolean' ? localSettings.value.showLineHeight : true));

    watch(() => [checkedFields.value], () => {
      if (!checkedFields.value.length) {
        checkAll.value = false;
      }

      if (checkedFields.value.length && renderFields.value
        .every((field: any, index: number) => checkedFields.value
          .includes(resolvedColVal(field, index)))) {
        checkAll.value = true;
      }
    }, { immediate: true, deep: true });

    watch(() => [(props.settings as Settings).checked], () => {
      checkedFields.value.splice(0, checkedFields.value.length, ...localSettings.value.checked);
    }, { immediate: true, deep: true });

    return () => (props.settings ? <Popover trigger="manual" isShow={isShow.value}
      placement="bottom-end"
      arrow={true}
      {...{ theme }}>
      {
        {
          default: () => <span class="table-head-settings" onClick={handleSettingClick}>
            <CogShape style="color: #c4c6cc;" ></CogShape>
          </span>,
          content: () => <div class="setting-content">
            <div class="setting-head">
              <span class="head-title">{t.value.setting.title}</span>
              <CloseLine class='icon-close-action' onClick={handleCancelClick}></CloseLine>
            </div>
            <div class="setting-body">
              <div class="setting-body-title">
                <div>
                  <span class="field-setting-label">{t.value.setting.fields.title}</span>
                  {isLimit.value ? <span class="limit">{t.value.setting.fields.subtitle(localSettings.value.limit)}</span> : ''}</div>
                {isLimit.value ? '' : <span class="check-all" onClick={handleCheckAllClick}>
                  <BkCheckbox label={t.value.setting.fields.selectAll}
                    indeterminate={Boolean(indeterminate.value)}
                    modelValue={checkedFields.value.length > 0}>{t.value.setting.fields.selectAll}</BkCheckbox>
                </span>
                }
              </div>
              <BkCheckboxGroup class="setting-body-fields" v-model={checkedFields.value}>
                {
                  (renderFields.value).map((item: any, index: number) => <div class="field-item">
                    <BkCheckbox checked={checkedFields.value.includes(resolvedColVal(item, index))}
                      label={resolvedColVal(item, index)}
                      disabled={isItemReadonly(item, index)}>
                      {resolvePropVal(item, 'label', [item, index])}
                    </BkCheckbox>
                  </div>)
                }
              </BkCheckboxGroup>
              {
                showLineHeight.value
                  ? <div class="setting-body-line-height">
                    {t.value.setting.lineHeight.title}：{renderSize()}
                  </div> : ''
              }

            </div>
            <div class="setting-footer">
              <BkButton theme='primary' style={buttonStyle} onClick={handleSaveClick}>{t.value.setting.options.ok}</BkButton>
              <BkButton style={buttonStyle} onClick={handleCancelClick}>{t.value.setting.options.cancel}</BkButton>
            </div>
          </div>,
        }
      }
    </Popover> : '');
  },
});
