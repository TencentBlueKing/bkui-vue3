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

import { TreeApplicationShape } from '@bkui-vue/icon/';
import Menu from '@bkui-vue/menu';
import { defineComponent, ref } from 'vue';
// import { Navigation } from 'bkui-vue';
export default defineComponent({
  setup() {
    const collapse = ref(false);
    const handleCollapse = (v: boolean) => {
      collapse.value = !v;
    };
    return {
      collapse,
      handleCollapse,
    };
  },
  render() {
    return (
      <div>
        <Navigation
          defaultOpen={!this.collapse}
          sideTitle={'监控平台'}
          onToggle={this.handleCollapse}
        >
          {{
            menu: () => (
              <Menu collapse={this.collapse}>
                <Menu.MenuItem>
                  {{
                    default: () => '测试哟',
                    icon: () => <TreeApplicationShape />,
                  }}
                </Menu.MenuItem>
                <Menu.Group name="计算资源">
                  <Menu.Item>asdfds</Menu.Item>
                  <Menu.Item>asdfsdf</Menu.Item>
                </Menu.Group>
                <Menu.Item>asdfds</Menu.Item>
                <Menu.Item>asdfsdf</Menu.Item>
                <Menu.Submenu>
                  <Menu.Item>asasd</Menu.Item>
                  <Menu.Item>sdfsdddddf</Menu.Item>
                  <Menu.Item>sdfsdfsdf</Menu.Item>
                  <Menu.Item>sdfddfsdf</Menu.Item>
                </Menu.Submenu>
                <Menu.Item>asdfds</Menu.Item>
                <Menu.Item>asdfsdf</Menu.Item>
                <Menu.Submenu>
                  <Menu.Item>sdfsddddf</Menu.Item>
                  <Menu.Item>sdfsdddddf</Menu.Item>
                  <Menu.Item>sdfsdfsdf</Menu.Item>
                  <Menu.Item>sdfddfsdf</Menu.Item>
                </Menu.Submenu>
              </Menu>
            ),
            'side-icon': () => <TreeApplicationShape />,
            header: () => (
              <div style="background: #63656e; height: 100%; width: 100%"></div>
            ),
            default: () => (
              <div style="background: #813b3b; height: 100%; width: 100%"></div>
            ),
          }}
        </Navigation>
      </div>
    );
  },
});
