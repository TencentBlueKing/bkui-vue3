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
import { computed, reactive, ref, SetupContext, unref, watch } from 'vue';

import Button from '@bkui-vue/button';
import Checkbox, { BkCheckboxGroup } from '@bkui-vue/checkbox';
import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { CloseLine, CogShape } from '@bkui-vue/icon/';
import Popover from '@bkui-vue/popover';

import { createDefaultSizeList, SETTING_SIZE } from '../const';
import { EMIT_EVENTS } from '../events';
import { Column, Settings, SizeItem, TablePropTypes } from '../props';
import { resolvePropVal } from '../utils';
import { UseColumns } from './use-columns';

const useSettings = (props: TablePropTypes, ctx: SetupContext, columns: UseColumns, afterSetting) => {
  const t = useLocale('table');
  const { resolveClassName } = usePrefix();
  const defaultSizeList: SizeItem[] = createDefaultSizeList(t);
  const checkAll = ref(false);
  const resolvedColVal = (item, index) => resolvePropVal(item, ['id', 'field', 'type'], [item, index]);
  const getDefaultSettings = () => {
    return {
      enabled: true,
      fields: props.columns.map((col: Column) => Object.assign({}, col, { field: col.field || col.type })),
      checked: [],
      limit: 0,
      size: 'small',
      sizeList: defaultSizeList,
      showLineHeight: true,
      extCls: '',
      trigger: 'manual',
      height: SETTING_SIZE.small,
    };
  };

  const getSettings = settings => {
    if (typeof settings === 'boolean' && settings !== false) {
      return getDefaultSettings();
    }

    if (!settings) {
      return {
        enabled: false,
      };
    }

    return Object.assign({}, getDefaultSettings(), settings);
  };

  const refSetting = ref(null);
  const options = reactive(getDefaultSettings());

  const update = (settings: Settings | boolean) => {
    Object.assign(options, getSettings(settings));
  };

  watch(
    () => [props.settings],
    () => {
      update(props.settings);
    },
    { immediate: true, deep: true },
  );

  const activeSize = ref(options.size || 'small');
  const activeHeight = ref(SETTING_SIZE.small);

  const checkedFields = ref(options.checked || []);
  const className = resolveClassName('table-settings');
  const theme = `light ${className}`;
  const renderFields = computed(() => options.fields || props.columns || []);

  const cachedValue = {
    checkAll: checkAll.value,
    activeSize: activeSize.value,
    activeHeight: activeHeight.value,
    checkedFields: options.checked || [],
  };

  const handleSaveClick = () => {
    Object.assign(cachedValue, {
      checkAll: checkAll.value,
      activeSize: activeSize.value,
      activeHeight: activeHeight.value,
      checkedFields: checkedFields.value,
    });

    const result = {
      checked: checkedFields.value,
      size: activeSize.value,
      height: activeHeight.value,
      fields: unref(renderFields),
    };

    Object.assign(options, result);
    columns.setColumnAttributeBySettings(options as Settings, result.checked);
    columns.setVisibleColumns();
    afterSetting?.(result);
    refSetting.value?.hide();
    ctx.emit(EMIT_EVENTS.SETTING_CHANGE, result);
  };

  const handleCancelClick = () => {
    checkAll.value = cachedValue.checkAll;
    activeSize.value = cachedValue.activeSize;
    activeHeight.value = cachedValue.activeHeight;
    checkedFields.value = cachedValue.checkedFields;
    refSetting.value?.hide();
  };

  const handleSettingClick = () => {
    if (options.trigger === 'manual') {
      refSetting.value?.show();
    }
  };

  const handleCheckAllClick = (e: MouseEvent) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();

    checkAll.value = !checkAll.value;
    const fields = options.fields || props.columns || [];
    const readonlyFields = fields
      .filter((f, index) => f.disabled && checkedFields.value.includes(resolvedColVal(f, index)))
      .map((item, index: number) => resolvedColVal(item, index));
    if (checkAll.value) {
      const allFields = fields.filter(f => !f.disabled).map((item, index: number) => resolvedColVal(item, index));
      checkedFields.value.splice(0, checkedFields.value.length, ...allFields, ...readonlyFields);
    } else {
      checkedFields.value.splice(0, checkedFields.value.length, ...readonlyFields);
    }
  };

  const isLimit = computed(() => (options.limit ?? 0) > 0);
  const sizeList = options.sizeList || defaultSizeList;
  const isFiledDisabled = computed(
    () => isLimit.value && (options.limit ? options.limit : 0) <= checkedFields.value.length,
  );

  const isItemReadonly = (item: Column, index: number) =>
    item.disabled || (isFiledDisabled.value && !checkedFields.value.includes(resolvedColVal(item, index)));

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

  const renderSize = () =>
    sizeList.map(item => (
      <span
        class={getItemClass(item)}
        onClick={() => handleSizeItemClick(item)}
      >
        {item.label}
      </span>
    ));

  const indeterminate = computed(
    () => checkedFields.value.length > 0 && checkedFields.value.length < renderFields.value.length,
  );

  const showLineHeight = computed(() => (typeof options.showLineHeight === 'boolean' ? options.showLineHeight : true));

  watch(
    () => [checkedFields.value],
    () => {
      if (!checkedFields.value.length) {
        checkAll.value = false;
      }

      if (
        checkedFields.value.length &&
        renderFields.value.every((field, index: number) => checkedFields.value.includes(resolvedColVal(field, index)))
      ) {
        checkAll.value = true;
      }
    },
    { immediate: true, deep: true },
  );

  watch(
    () => [(props.settings as Settings).checked],
    () => {
      checkedFields.value.splice(0, checkedFields.value.length, ...options.checked);
    },
    { immediate: true, deep: true },
  );

  const getRenderContent = () => {
    return (
      ctx.slots.settings?.() ?? (
        <>
          <div class='setting-head'>
            <span class='head-title'>{t.value.setting.title}</span>
            <CloseLine
              class='icon-close-action'
              onClick={handleCancelClick}
            ></CloseLine>
          </div>
          <div class='setting-body'>
            <div class='setting-body-title'>
              <div>
                <span class='field-setting-label'>{t.value.setting.fields.title}</span>
                {isLimit.value ? <span class='limit'>{t.value.setting.fields.subtitle(options.limit)}</span> : ''}
              </div>
              {isLimit.value ? (
                ''
              ) : (
                <span
                  class='check-all'
                  onClick={handleCheckAllClick}
                >
                  <Checkbox
                    indeterminate={Boolean(indeterminate.value)}
                    label={t.value.setting.fields.selectAll}
                    modelValue={checkedFields.value.length > 0}
                  >
                    {t.value.setting.fields.selectAll}
                  </Checkbox>
                </span>
              )}
            </div>
            <BkCheckboxGroup
              class='setting-body-fields'
              v-model={checkedFields.value}
            >
              {renderFields.value.map((item, index: number) => (
                <div class='field-item'>
                  <Checkbox
                    checked={checkedFields.value.includes(resolvedColVal(item, index))}
                    disabled={isItemReadonly(item, index)}
                    label={resolvedColVal(item, index)}
                  >
                    {resolvePropVal(item, ['name', 'label'], [item, index])}
                  </Checkbox>
                </div>
              ))}
            </BkCheckboxGroup>
            {ctx.slots.setting?.()}
            {showLineHeight.value ? (
              <div class='setting-body-line-height'>
                {t.value.setting.lineHeight.title}：{renderSize()}
              </div>
            ) : (
              ''
            )}
          </div>
          <div class='setting-footer'>
            <Button
              style={buttonStyle}
              theme='primary'
              onClick={handleSaveClick}
            >
              {t.value.setting.options.ok}
            </Button>
            <Button
              style={buttonStyle}
              onClick={handleCancelClick}
            >
              {t.value.setting.options.cancel}
            </Button>
          </div>
        </>
      )
    );
  };

  const renderSettings = () => {
    if (!props.settings) {
      return null;
    }

    return (
      <Popover
        ref={refSetting}
        extCls={options.extCls}
        arrow={true}
        placement='bottom-end'
        trigger={(options.trigger ?? 'manual') as 'click' | 'hover' | 'manual'}
        {...{ theme }}
      >
        {{
          default: () => (
            <span
              class='table-head-settings'
              onClick={handleSettingClick}
            >
              <CogShape style='color: #c4c6cc;'></CogShape>
            </span>
          ),
          content: () => <div class='setting-content'>{getRenderContent()}</div>,
        }}
      </Popover>
    );
  };

  return {
    options,
    renderSettings,
  };
};
export type UseSettings = ReturnType<typeof useSettings>;
export default useSettings;
