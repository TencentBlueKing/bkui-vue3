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
import { defineComponent } from 'vue';

import i18n  from '../language/i18n';
import { IPropsTableItem } from '../typings';

import CommonBox from './common-box';

import './props-box.less';

const { t } = i18n.global;
type ColumnKey = keyof IPropsTableItem;
type IColumnMap = Record<ColumnKey, any>;
const  columnMap: IColumnMap = {
  name: t('参数'),
  desc: t('说明'),
  type: t('类型'),
  optional: t('可选值'),
  default: t('默认值'),
};
export default defineComponent({
  props: {
    title: {
      type: String,
      default: t('属性'),
    },
    subtitle: {
      type: String,
      default: '',
    },
    propsData: {
      type: Array,
      required: true,
    },
    columnMap: {
      type: Object,
      default: () => columnMap,
    },
  },
  setup(props) {
    const getPropsCell = (key: keyof IPropsTableItem, item: IPropsTableItem) => {
      let val = item[key] || '--';
      switch (key) {
        case 'optional':
        case 'default':
          val = val !== '--' && !Array.isArray(val) ? [val] : val;
          return Array.isArray(val)
            ?  <td key={key}>
                <div class="table-cell">
                  {
                    val.length ? val.map(v => <span class="cell-item" key={v}>{v}</span>) : '--'
                  }
                </div>
              </td>
            : <td key={key}>{val}</td>;
        default:
          return <td key={key}>{val}</td>;
      }
    };
    const getPropsRow = (item: IPropsTableItem | IColumnMap) => <tr>
        {
          Object.keys(props.columnMap).map(key => getPropsCell(key as ColumnKey, item))
        }
      </tr>;
    return {
      getPropsRow,
      getPropsCell,
    };
  },
  render() {
    return <CommonBox title={this.title} subtitle={this.subtitle}>
        <table class="props-table">
            <thead>
              {
                Object.values(this.columnMap).map(v => <th key={v}>{v}</th>)
              }
            </thead>
            <tbody>
              {
                this.propsData.map((item: any) => this.getPropsRow(item))
              }
            </tbody>
        </table>
    </CommonBox>;
  },
});
