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
import { isBoolean, isString } from 'lodash';
import type { ExtractPropTypes } from 'vue';
import { defineComponent, provide } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, formKey, PropTypes } from '@bkui-vue/shared';

import type { IFormItemContext } from './type';

export const formProps = {
  formType: PropTypes.oneOf(['default', 'vertical']).def('default'),
  labelWidth: PropTypes.oneOfType([Number, String]).def(150),
  labelPosition: PropTypes.oneOf(['left', 'center', 'right']),
  model: PropTypes.object,
  rules: PropTypes.object,
};

const formEvents = {
  submit: null,
  validate: (property: string, result: boolean, message: string) =>
    isString(property) && isBoolean(result) && isString(message),
};

export type FormProps = Readonly<ExtractPropTypes<typeof formProps>>;
export type FormEvents = typeof formEvents;

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Form',
  props: formProps,
  emits: formEvents,
  setup(props, context) {
    // form-item 列表
    let formItemInstanceList: Array<IFormItemContext> = [];
    /**
     * @desc 注册 form-item
     * @param { IFormItemContext } formItemInstance
     */
    const register = formItemInstance => {
      formItemInstanceList.push(formItemInstance);
    };
    /**
     * @desc 卸载 form-item
     * @param { IFormItemContext } formItemInstance
     */
    const unregister = formItemInstance => {
      formItemInstanceList = formItemInstanceList.reduce((result, item) => {
        if (item !== formItemInstance) {
          result.push(item);
        }
        return result;
      }, []);
    };
    provide(formKey, {
      props,
      emit: context.emit,
      register,
      unregister,
    });

    const handleSubmit = (event: Event): void => {
      event.preventDefault();
      context.emit('submit');
    };
    /**
     * @desc 验证表单
     * @param { string | Array<string> } fields 指定表单字段
     * @returns { Promise<[]> }
     */
    const validate = (fields?: string | Array<string>) => {
      let fieldMap = {};
      if (fields) {
        const fieldList = typeof fields === 'string' ? [fields] : fields;
        fieldMap = fieldList.reduce(
          (result, item) => ({
            ...result,
            [item]: true,
          }),
          {},
        );
      } else {
        fieldMap = formItemInstanceList.reduce((result, item) => {
          if (item.property) {
            return {
              ...result,
              [item.property]: true,
            };
          }
          return result;
        }, {});
      }
      return Promise.all(
        formItemInstanceList.reduce(
          (result, formItem) => {
            if (fieldMap[formItem.property]) {
              result.push(formItem.validate());
            }
            return result;
          },
          [] as Array<Promise<any>>,
        ),
      ).then(() => Promise.resolve(props.model));
    };

    /**
     * @desc 获取表单的验证的结果（所有表单项验证成功返回 true）
     * @returns { Promise<Boolean> }
     */
    const getValidateResult = () =>
      Promise.all(formItemInstanceList.map(formItem => formItem.validate(undefined, false)))
        .then(() => true)
        .catch(() => false);

    /**
     * @desc 清除表单验证错误信息
     * @param { string | Array<string> } fields 指定表单字段
     */
    const clearValidate = (fields?: string | Array<string>) => {
      let fieldMap = {};
      if (fields) {
        const fieldList = typeof fields === 'string' ? [fields] : fields;
        fieldMap = fieldList.reduce(
          (result, item) => ({
            ...result,
            [item]: true,
          }),
          {},
        );
      } else {
        fieldMap = formItemInstanceList.reduce(
          (result, item) => ({
            ...result,
            [item.property]: true,
          }),
          {},
        );
      }
      formItemInstanceList.forEach(formItem => fieldMap[formItem.property] && formItem.clearValidate());
    };

    const { resolveClassName } = usePrefix();

    return {
      handleSubmit,
      validate,
      getValidateResult,
      clearValidate,
      resolveClassName,
    };
  },
  render() {
    const formClasses = classes({
      [`${this.resolveClassName('form')}`]: true,
      [`${this.resolveClassName(`form--${this.formType}`)}`]: true,
    });
    return (
      <form
        class={formClasses}
        onSubmit={this.handleSubmit}
      >
        {this.$slots.default?.()}
      </form>
    );
  },
});
