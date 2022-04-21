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
import { computed, defineComponent, reactive } from 'vue';

import BkCheckbox from '@bkui-vue/checkbox';
import { AngleDownLine } from '@bkui-vue/icon/';
import Popover from '@bkui-vue/popover';
import { classes, PropTypes, resolveClassName } from '@bkui-vue/shared';

import { ColumnFilterListItem } from '../props';

export default defineComponent({
  name: 'HeadFilter',
  props: {
    filter: PropTypes.any.def({}),
    height: PropTypes.number.def(40),
  },
  setup(props) {
    const { list = [] } = props.filter;
    const state = reactive({
      isOpen: false,
      checked: [],
    });

    const headClass = computed(() => (classes({
      [resolveClassName('table-head-action')]: true,
      'column-filter': true,
      '--row-height': `${props.height}px`,
      active: state.checked.length,
      opened: state.isOpen,
    })));

    const headFilterContentClass = classes({
      [resolveClassName('table-head-filter')]: true,
    });

    const handlePopShow = (isOpen: boolean) => {
      state.isOpen = isOpen;
    };

    const modifiers = [{
      name: 'offset',
      options: {
        offset: [0, 0],
      },
    }];

    const theme = `light ${resolveClassName('table-head-filter')}`;
    const handleItemChecked = (value: any, item: any) => {
      console.log('handleItemChecked', value, item);
    };

    return () => <Popover trigger="click" placement="bottom-end" arrow={false}
    {...{ modifiers, theme }}
    boundary={ document.body }
    onAfterShow={ () => handlePopShow(true) }
    onAfterHidden={() => handlePopShow(false)}>
      {
        {
          default: () =>  <AngleDownLine class={headClass.value}/>,
          content: () => <div class={ headFilterContentClass }>
            <div class="content-list">
              {
                list.map((item: ColumnFilterListItem) => <div class="list-item">
                  <BkCheckbox label={item.text}
                  onChange={ (value: any) => handleItemChecked(value, item) }>
                  </BkCheckbox>
                </div>)
              }
            </div>
            <div class="content-footer"></div>
          </div>,
        }
      }
      </Popover>;
  },
});
