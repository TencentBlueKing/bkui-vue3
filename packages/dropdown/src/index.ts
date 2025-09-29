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

import { withInstallProps } from '@bkui-vue/shared';

import Dropdown from './dropdown';
import DropdownItem from './dropdown-item';
import { dropdownItemEmits } from './dropdown-item-emits';
import { dropdownItemProps } from './dropdown-item-props';
import DropdownMenu from './dropdown-menu';
import { dropdownMenuEmits } from './dropdown-menu-emits';
import { dropdownMenuProps } from './dropdown-menu-props';
import { emits } from './emits';
import { props } from './props';

const BkDropdown = withInstallProps(Dropdown, { DropdownMenu, DropdownItem });
export default BkDropdown;
export { BkDropdown, DropdownMenu as BkDropdownMenu, DropdownItem as BkDropdownItem };

// 导出主组件的 props 和 emits
export { props, emits };
export type { DropdownItemEmits } from './dropdown-item-emits';
export type { DropdownItemProps } from './dropdown-item-props';

// 导出子组件的 props 和 emits
export { dropdownMenuProps, dropdownMenuEmits };
export type { DropdownMenuEmits } from './dropdown-menu-emits';
export type { DropdownMenuProps } from './dropdown-menu-props';

export { dropdownItemProps, dropdownItemEmits };
export type { DropdownEmits } from './emits';
export type { DropdownProps } from './props';
