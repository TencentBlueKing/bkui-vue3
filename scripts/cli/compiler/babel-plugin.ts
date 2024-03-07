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
import { NodePath, PluginPass } from '@babel/core';
import {
  identifier,
  ImportDeclaration,
  importDeclaration,
  importDefaultSpecifier,
  ImportSpecifier,
  isImportDefaultSpecifier,
  isImportSpecifier,
  Node,
  stringLiteral,
} from '@babel/types';
export const hasStyleComponentList = [
  'Alert',
  'Affix',
  'Backtop',
  'Badge',
  'Breadcrumb',
  'Button',
  'Card',
  'Checkbox',
  'Collapse',
  'Dialog',
  'Exception',
  'FixedNavbar',
  'Input',
  'Link',
  'Loading',
  'Modal',
  'Popover',
  'Progress',
  'Radio',
  'Rate',
  'Swiper',
  'Select',
  'Sideslider',
  'Steps',
  'Switcher',
  'Table',
  'Tag',
  'TagInput',
  'Divider',
  'Tab',
  'Message',
  'InfoBox',
  'Notify',
  'Menu',
  'Navigation',
  'DatePicker',
  'Transfer',
  'Tree',
  'VirtualRender',
  'Form',
  'Pagination',
  'Container',
  'Dropdown',
  'Cascader',
  'Slider',
  'ResizeLayout',
  'TimeLine',
  'Process',
  'Upload',
  'CodeDiff',
  'ColorPicker',
  'TimePicker',
  'SearchSelect',
  'OverflowTitle',
  'PopConfirm',
];
export const capitalize = (name: string) =>
  name.replace(/^([a-z])|-(.)/g, (_, a: string, b: string) => (a || b).toUpperCase());

export const getLibPath = (value: string) => value.replace(/^@bkui-vue\//, 'bkui-vue/lib/');

const visitor = {
  ImportDeclaration(path: NodePath<ImportDeclaration>, state: PluginPass) {
    if (!path.node) return;

    const {
      specifiers,
      source: { value },
    } = path.node;
    if (!value.startsWith('@bkui-vue/') || state.filename?.includes('/bkui-vue/')) return;
    // console.log(`Absolute path: ${state.filename}`);
    const libPath = getLibPath(value);
    const hasDefaultImportToInclude = specifiers.some(
      item => isImportDefaultSpecifier(item) && hasStyleComponentList.includes(capitalize(item.local.name)),
    );

    if (!hasDefaultImportToInclude) {
      path.replaceWith(importDeclaration(specifiers, stringLiteral(libPath)));
      return;
    }

    const specifiersList: ImportSpecifier[] = [];
    const declarationList: Node[] = [];

    for (const specifier of specifiers) {
      if (isImportDefaultSpecifier(specifier)) {
        const componentName = value.replace(/^@bkui-vue\//, '');
        const cssPath = `@bkui-vue/${componentName}/${componentName}.less`;

        declarationList.push(
          importDeclaration([importDefaultSpecifier(identifier(capitalize(componentName)))], stringLiteral(libPath)),
        );

        if (hasStyleComponentList.includes(capitalize(componentName))) {
          declarationList.push(importDeclaration([], stringLiteral(cssPath)));
        }
      } else if (isImportSpecifier(specifier)) {
        specifiersList.push(specifier);
      }
    }

    if (specifiersList.length) {
      declarationList.push(importDeclaration(specifiersList, stringLiteral(libPath)));
    }

    if (declarationList.length) {
      path.replaceWithMultiple(declarationList);
    }
  },
};
export default function () {
  return { visitor };
}
