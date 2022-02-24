
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

import { defineComponent, reactive, ref } from 'vue';
import { BkDropdown, BkDropdownMenu, BkDropdownItem } from '@bkui-vue/dropdown';
import BkButton from '@bkui-vue/button';

export default defineComponent({
  name: 'DropdownTest',
  setup() {
    const handleClickItem = (item, index) => {
      console.log('click:', `${item}-${index}`);
      isShow.value = false;
    };
    const menuList = reactive(['菜单', '菜单', '菜单', '菜单', '菜单', '菜单', '菜单']);

    const dropdownList = reactive([
      { trigger: 'hover', placement: 'bottom' },
      { trigger: 'hover', placement: 'bottom-start' },
      { trigger: 'hover', placement: 'bottom-end' },
      { trigger: 'hover', placement: 'top' },
      { trigger: 'hover', placement: 'top-start' },
      { trigger: 'hover', placement: 'top-end' },
      { trigger: 'hover', placement: 'left' },
      { trigger: 'hover', placement: 'right' },
      { trigger: 'click', placement: 'bottom' },
    ]);

    const disabled = ref(false);

    const isShow = ref(true);

    const extCls = ref('extCls');

    const handleChangeDisabled = () => {
      disabled.value = !disabled.value;
      extCls.value = 'is-disabled';
    };

    const handleTestIsShow = () => {
      isShow.value = !isShow.value;
    };

    return {
      dropdownList,
      menuList,
      disabled,
      isShow,
      extCls,
      handleChangeDisabled,
      handleTestIsShow,
      handleClickItem,
    };
  },
  render() {
    return (
      <div>
        <div style="margin: 100px auto; display: flex; justify-content: space-between; padding: 200px 50px; flex-wrap: wrap;">
          {
            this.dropdownList.map(item => (
              <BkDropdown
                trigger={item.trigger} placement={item.placement} disabled={this.disabled} extCls={this.extCls}>
                {{
                  default: () => <BkButton>{Object.keys(item).map(key =>  `${key}: ${item[key]}`)
                    .join(' - ')}</BkButton>,
                  content: () => (
                    <BkDropdownMenu>
                      {
                        this.menuList.map((item, index) => (
                          <BkDropdownItem
                            key={item + index}
                            onClick={() => this.handleClickItem(item, index)}>{item + index}</BkDropdownItem>
                        ))
                      }
                    </BkDropdownMenu>
                  ),
                }}
              </BkDropdown>
            ))
          }
          <BkButton onClick={this.handleChangeDisabled}>{`disabled: ${this.disabled}`}</BkButton>
          <BkDropdown trigger='manual' isShow={this.isShow} disabled={this.disabled} onShowChange={val => this.isShow = val}>
            {{
              default: () => <BkButton onClick={this.handleTestIsShow}>test isShow</BkButton>,
              content: () => (
                <BkDropdownMenu>
                  {
                    this.menuList.map((item, index) => (
                      <BkDropdownItem
                        key={item + index}
                        onClick={() => this.handleClickItem(item, index)}>{item + index}</BkDropdownItem>
                    ))
                  }
                </BkDropdownMenu>
              ),
            }}
          </BkDropdown>
          <BkDropdown trigger='click' disabled={this.disabled}>
            {{
              default: () => <div style="padding: 20px;"><span>click me</span></div>,
              content: () => (
                <BkDropdownMenu>
                  {
                    this.menuList.map((item, index) => (
                      <BkDropdownItem
                        key={item + index}
                        onClick={() => this.handleClickItem(item, index)}>{item + index}</BkDropdownItem>
                    ))
                  }
                </BkDropdownMenu>
              ),
            }}
          </BkDropdown>
        </div>
      </div>
    );
  },
});
