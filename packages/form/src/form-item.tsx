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
import { get, isFunction } from 'lodash';
import type { ComputedRef, ExtractPropTypes } from 'vue';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  toRefs,
  Transition,
} from 'vue';

import { useLocale, usePrefix  } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { ExclamationCircleShape } from '@bkui-vue/icon';
import type { Language } from '@bkui-vue/locale';
import {
  classes,
  formItemKey,
  PropTypes,
  useForm,
  useFormItem,
} from '@bkui-vue/shared';

import type {
  IFormItemRule,
} from './type';
import { getRuleMessage } from './utils';
import defaultValidator from './validator';

const formItemProps = {
  label: PropTypes.string,
  labelWidth: PropTypes.oneOfType([Number, String]),
  labelPosition: PropTypes.oneOf(['left', 'center', 'right']),
  property: PropTypes.string.def(''),
  required: PropTypes.bool.def(false),
  email: PropTypes.bool.def(false),
  max: PropTypes.number,
  min: PropTypes.number,
  maxlength: PropTypes.number,
  rules: PropTypes.array,
  autoCheck: PropTypes.bool.def(false),
  description: PropTypes.string,
  errorDisplayType: PropTypes.oneOf(['tooltips', 'normal']).def('normal'),
};

export type FormItemProps = Readonly<ExtractPropTypes<typeof formItemProps>>;

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const getRulesFromProps = (props, t: ComputedRef<Language['form']>) => {
  const rules: IFormItemRule[] = [];

  const label = props.label || '';
  if (props.required) {
    rules.push({
      required: true,
      validator: defaultValidator.required,
      message: `${label}${t.value.notBeEmpty}`,
      trigger: 'change',
    });
  }
  if (props.email) {
    rules.push({
      email: true,
      validator: defaultValidator.email,
      message: `${label}${t.value.incorrectFormat}`,
      trigger: 'change',
    });
  }
  if (Number(props.max) > -1) {
    rules.push({
      validator: value => defaultValidator.max(value, props.max),
      message: `${label}${t.value.max} ${props.max}`,
      trigger: 'change',
    });
  }
  if (Number(props.min) > -1) {
    rules.push({
      validator: value => defaultValidator.min(value, props.min),
      message: `${label}${t.value.min} ${props.min}`,
      trigger: 'change',
    });
  }
  if (Number(props.maxlength) > -1) {
    rules.push({
      validator: value => defaultValidator.maxlength(value, props.maxlength),
      message: `${label}${t.value.maxLen} ${props.maxlength}`,
      trigger: 'change',
    });
  }
  return rules;
};

const mergeRules: (
  configRules: IFormItemRule[],
  propRules: IFormItemRule[],
  t: ComputedRef<Language['form']>
) => IFormItemRule[] = (configRules, propRules, t: ComputedRef<Language['form']>) => {
  let customRequired = false;
  let customEmail = false;

  const formatConfigRules = configRules.reduce((result, rule) => {
    let rulevalidator: any;
    if (rule.required) {
      rulevalidator = isFunction(rule.validator) ? rule.validator : defaultValidator.required;
      customRequired = true;
    } else if (rule.email) {
      rulevalidator = isFunction(rule.validator) ? rule.validator : defaultValidator.email;
      customEmail = true;
    } else if (Number(rule.max) > -1) {
      rulevalidator = value => defaultValidator.max(value, rule.max);
    } else if (Number(rule.min) > -1) {
      rulevalidator = value => defaultValidator.min(value, rule.max);
    } else if (Number(rule.maxlength) > -1) {
      rulevalidator = value => defaultValidator.min(value, rule.max);
    } else if (Object.prototype.toString.call(rule.pattern) === '[object RegExp]') {
      rulevalidator = value => defaultValidator.pattern(value, rule.pattern);
    } else if (isFunction(rule.validator)) {
      rulevalidator =  rule.validator;
    } else {
      // 不支持的配置规则
      return result;
    }
    result.push({
      validator: rulevalidator,
      message: rule.message || t.value.verifyError,
      trigger: rule.trigger || 'blur',
    });
    return result;
  }, []);

  // 自定义配置验证规则覆盖内置验证规则
  const filterPropRules = propRules.reduce((result, ruleItem) => {
    if (ruleItem.required && customRequired) {
      return result;
    }
    if (ruleItem.email && customEmail) {
      return result;
    }
    result.push(ruleItem);
    return result;
  }, []);

  return [...filterPropRules, ...formatConfigRules];
};

const getTriggerRules = (
  trigger: String,
  rules: IFormItemRule[],
) => rules.reduce((result, rule) => {
  if (!rule.trigger || !trigger) {
    result.push(rule);
    return result;
  }
  const ruleTriggerList = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];
  if (ruleTriggerList.includes(trigger as IFormItemRule['trigger'])) {
    result.push(rule);
  }
  return result;
}, []);


const isValid = (value: string | number): boolean => value !== undefined;


export default defineComponent({
  name: 'FormItem',
  directives: {
    bkTooltips,
  },
  props: formItemProps,

  setup(props, context) {
    const t = useLocale('form');
    const form = useForm();
    const isForm = Boolean(form);
    const parentFormItem = useFormItem();
    const isNested = Boolean(parentFormItem);

    const currentInstance = getCurrentInstance();

    const state = reactive({
      isError: false,
      errorMessage: '',
    });

    const isFormTypeVertical = computed(() => {
      if (!isForm) {
        return false;
      }
      return form.props.formType === 'vertical';
    });

    const isShowLabel = computed(() => {
      if (props.label || context.slots.label) {
        return true;
      }
      return false;
    });

    const labelStyles = computed<any>(() => {
      const styles = {
        width: '',
        paddingRight: '',
        textAlign: '',
      };

      const labelPosition = props.labelPosition || (isForm && form.props.labelPosition);
      if (labelPosition) {
        styles['text-align'] = labelPosition;
      }

      if (form.props.formType === 'vertical' || (!props.label && isNested)) {
        return styles;
      }

      const labelWidth = isValid(props.labelWidth) ? props.labelWidth : (isForm && form.props.labelWidth);
      if (isValid(labelWidth)) {
        styles.width = `${labelWidth}px`;
        styles.paddingRight = labelWidth ? '' : '0px';
      }

      return styles;
    });

    const contentStyles = computed(() => ({
      ['margin-left']: labelStyles.value.width,
    }));

    /**
     * @desc 验证字段
     *
     * @param { undefined | string } trigger 验证触发方式
     * @param { boolean } showError 是否展示错误信息
     */
    const validate = (trigger?: string, showError = true): Promise<boolean> => {
      // 没有设置 property 不进行验证
      if (!props.property
      || (isForm && !form.props.model)) {
        return Promise.resolve(true);
      }
      let rules: IFormItemRule[] = [];
      // 继承 form 的验证规则
      if (isForm
        && form.props.rules
        && hasOwn(form.props.rules, props.property)) {
        rules = form.props.rules[props.property];
      }
      // form-item 自己的 rules 规则优先级更高
      if (props.rules) {
        rules = props.rules as IFormItemRule[];
      }

      // 合并规则属性配置
      rules = getTriggerRules(trigger, mergeRules(rules, getRulesFromProps(props, t), t));

      // 重新触发验证重置上次的验证状态
      if (rules.length > 0 && showError) {
        state.isError = false;
        state.errorMessage = '';
      }

      const value = get(form.props.model, props.property);

      const doValidate = (() => {
        let stepIndex = -1;
        return () => {
          stepIndex = stepIndex + 1;
          // form-item 验证通过
          if (stepIndex >= rules.length) {
            form.emit('validate', props.property, true, '');
            return Promise.resolve(true);
          }
          const rule = rules[stepIndex];

          return Promise.resolve()
            .then(() => {
              const result = rule.validator(value);
              const errorMessage = getRuleMessage(rule);
              // 异步验证（validator 返回一个 Promise）
              if (typeof result !== 'boolean'
                && typeof result.then === 'function') {
                return result.then((data) => {
                  // 异步验证结果为 false
                  if (data === false) {
                    return Promise.reject(errorMessage);
                  }
                }).then(() => doValidate(), () => {
                  if (showError) {
                    state.isError = true;
                    state.errorMessage = errorMessage;
                  }
                  form.emit('validate', props.property, false, errorMessage);
                  return Promise.reject(state.errorMessage);
                });
              }
              // 同步验证失败
              if (!result) {
                if (showError) {
                  state.isError = true;
                  // 验证结果返回的是 String 表示验证失败，返回结果作为错误信息
                  state.errorMessage = typeof result === 'string' ? result : errorMessage;
                }
                form.emit('validate', props.property, false, errorMessage);
                return Promise.reject(state.errorMessage);
              }
              // 下一步
              return doValidate();
            });
        };
      })();
      return doValidate();
    };

    /**
     * @desc 清除验证状态
     */
    const clearValidate = (): void => {
      state.isError = false;
      state.errorMessage = '';
    };

    provide(formItemKey, {
      ...props,
      validate,
      clearValidate,
    });

    onMounted(() => {
      if (isForm) {
        form.register(currentInstance.proxy);
      }
    });

    onBeforeUnmount(() => {
      if (isForm) {
        form.unregister(currentInstance.proxy);
      }
    });

    const { resolveClassName } = usePrefix();

    return {
      ...toRefs(state),
      isShowLabel,
      labelStyles,
      contentStyles,
      isFormTypeVertical,
      validate,
      clearValidate,
      resolveClassName,
    };
  },
  render() {
    const itemClassees = classes({
      [`${this.resolveClassName('form-item')}`]: true,
      'is-error': this.isError,
      'is-required': this.required,
    });

    const renderLabel = () => {
      if (this.$slots.label) {
        return this.$slots.label();
      }
      if (this.description) {
        return (
          <span
            class={{
              [`${this.resolveClassName('form-label-description')}`]: Boolean(this.description),
            }}
            v-bk-tooltips={this.description}>
            {this.label}
          </span>
        );
      }
      return this.label;
    };

    const renderError = () => {
      if (!this.isError) {
        return null;
      }
      if (this.errorDisplayType === 'tooltips') {
        return (
          <div
            class={`${this.resolveClassName('form-error-tips')}`}
            v-bk-tooltips={this.errorMessage}>
            <ExclamationCircleShape />
          </div>
        );
      }
      return (
        <div class={`${this.resolveClassName('form-error')}`}>
          {this.$slots.error
            ? this.$slots.error(this.errorMessage)
            : this.errorMessage}
        </div>
      );
    };

    return (
      <div class={itemClassees}>
        {
          this.isShowLabel && (
            <div
              class={`${this.resolveClassName('form-label')}`}
              style={this.labelStyles}>
                {renderLabel()}
                {this.isFormTypeVertical && this.$slots.labelAppend?.()}
            </div>
          )
        }
        <div
          class={`${this.resolveClassName('form-content')}`}
          style={this.contentStyles}>
          {this.$slots.default?.()}
          {renderError()}
        </div>
      </div>
    );
  },
});
