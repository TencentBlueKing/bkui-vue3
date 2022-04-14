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

import { CSSProperties, VNodeChild } from 'vue';
import { createTypes, toType, VueTypeDef } from 'vue-types';

const propTypesNS = createTypes({});

export type VueNode = VNodeChild | JSX.Element;

// 将一个数组转化为一个有限集合 e.g. const arr = [1,2,3] as const; type UnionType = ElementType<typeof arr>;
export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType>
  ? ElementType : never;

// 用于创建字符串列表映射至 `K: V` 的函数
export function stringEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

export enum Size {
  Small = 'small',
  Large = 'large'
}

export enum Placements {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom'
}
export class PropTypes extends propTypesNS {
  static size(sizes: string[] = ['small', 'default', 'large']): VueTypeDef<string> {
    return toType('Size', {
      type: String,
      validator: (val: string) => {
        if (!val || sizes.includes(val)) {
          return true;
        }
        console.error(`invalid size, ${val}, the size must be one of 【${sizes.join(' | ')}】`);
        return false;
      },
      default: 'default',
    });
  }

  static theme(themes: string[] = ['primary', 'warning', 'success', 'danger']): VueTypeDef<string>  {
    return toType('Theme', {
      type: String,
      validator: (val: string) => {
        if (!val || themes.includes(val)) {
          return true;
        }
        console.error(`invalid theme, ${val}, the theme must be one of 【${themes.join(' | ')}】`);
        return false;
      },
    });
  }

  static placement(placements: string[] = ['top', 'left', 'right', 'bottom']): VueTypeDef<string>  {
    return toType('Placements', {
      type: String,
      validator: (val: string) => {
        if (!val || placements.includes(val)) {
          return true;
        }
        console.error(`invalid placements, ${val}, the placement must be one of 【${placements.join(' | ')}】`);
        return false;
      },
      default: 'top',
    });
  }

  static commonType(types: string[] = [], name = 'commonType'): VueTypeDef<string>  {
    return toType(name.replace(/^\S/, s => s.toUpperCase()), {
      type: String,
      validator: (val: string) => {
        const valid = types.includes(val);
        if (!valid) {
          console.error(`invalid ${name}, ${val}, the ${name} must be one of 【${types.join(' | ')}】`);
        }
        return valid;
      },
      default: types[0],
    });
  }

  static style(): VueTypeDef<CSSProperties> {
    return toType('Style', {
      type: [String, Object],
    });
  }

  static position(positions: string[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']): VueTypeDef<string>  {
    return toType('positions', {
      type: String,
      validator: (val: string) => {
        if (!val || positions.includes(val)) {
          return true;
        }
        console.error(`invalid positions, ${val}, the position must be one of 【${positions.join(' | ')}】`);
        return false;
      },
      default: 'top-center',
    });
  }
}
