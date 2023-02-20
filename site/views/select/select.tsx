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
import { defineAsyncComponent, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { BkSelect } from '@bkui-vue/select';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('lang');

const SelectBaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-base-demo.vue`));
const SelectGroupDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-group-demo.vue`));
const SelectMultiDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-multi-demo.vue`));
const SelectScrollLoadingDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-scrollloading-demo.vue`));
const SelectSearchDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-search-demo.vue`));
const SelectSlotDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-slot-demo.vue`));
const SelectStyleDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-style-demo.vue`));
const SelectAllowCreate = defineAsyncComponent(() => import(`./demo/${lang}/select-allow-create.vue`));
const SelectTreeDemo = defineAsyncComponent(() => import(`./demo/${lang}/select-tree-demo.vue`));
const SelectVirtualRender = defineAsyncComponent(() => import(`./demo/${lang}/select-tree-demo.vue`));

const propsJson: IPropsTableItem[] = Object.keys(BkSelect.props).map(prop => ({
  name: prop,
  type: BkSelect.props[prop]._vueTypes_name,
  default: BkSelect.props[prop].default,
  desc: '',
  optional: [],
}));

export default defineComponent({
  render() {
    const { t } = useI18n();
    return (
      <div>
        <DemoTitle name={t('Select 下拉选框')} desc={t('将动作或菜单折叠到下拉菜单中，支持单选和多选')} />
        <DemoBox
          title={t('基础用法')}
          desc={t('基础单选')}
          componentName="select"
          demoName={`demo/${lang}/select-base-demo`}
        >
          <SelectBaseDemo />
        </DemoBox>
        <DemoBox
          title={t('尺寸 & 风格')}
          desc={t('large、default、 small 三种尺寸，normal、simplicity两种风格')}
          componentName="select"
          demoName={`demo/${lang}/select-style-demo`}
        >
          <SelectStyleDemo />
        </DemoBox>
        <DemoBox
          title={t('多选')}
          desc={t('支持tag形式的多选')}
          componentName="select"
          demoName={`demo/${lang}/select-multi-demo`}
        >
          <SelectMultiDemo />
        </DemoBox>
        <DemoBox title={t('分组')} desc="" componentName="select" demoName={`demo/${lang}/select-group-demo`}>
          <SelectGroupDemo />
        </DemoBox>
        <DemoBox
          title={t('搜索')}
          desc={t('远程搜索和本地搜索，注意：动态Options时建议使用value作为key，防止出现option没有销毁问题')}
          componentName="select"
          demoName={`demo/${lang}/select-search-demo`}
        >
          <SelectSearchDemo />
        </DemoBox>
        <DemoBox
          title={t('滚动加载')}
          desc={t('滚动加载')}
          componentName="select"
          demoName={`demo/${lang}/select-scrollloading-demo`}
        >
          <SelectScrollLoadingDemo />
        </DemoBox>
        <DemoBox
          title={t('自定义创建')}
          desc={t('自定义创建选项')}
          componentName="select"
          demoName={`demo/${lang}/select-allow-create`}
        >
          <SelectAllowCreate />
        </DemoBox>
        <DemoBox
          title="Tree Select"
          desc="Tree Select"
          componentName="select"
          demoName={`demo/${lang}/select-tree-demo`}
        >
          <SelectTreeDemo />
        </DemoBox>
        <DemoBox
          title="Virtual Select"
          desc={t('虚拟滚动只支持list模式数据源')}
          componentName="select"
          demoName={`demo/${lang}/select-virtual-render`}
        >
          <SelectVirtualRender />
        </DemoBox>
        <DemoBox
          title={t('多选模式下自定义tag')}
          desc={t('多选模式下自定义tag')}
          componentName="select"
          demoName={`demo/${lang}/select-slot-demo`}
        >
          <SelectSlotDemo />
        </DemoBox>
        <PropsBox propsData={propsJson} subtitle="" />
      </div>
    );
  },
});
