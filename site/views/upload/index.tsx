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

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import {
  type IPropsTableItem,
} from '../../typings';

import AcceptImage from './demo/accept-image.vue';
import AcceptZip from './demo/accept-zip.vue';
import Base from './demo/base.vue';
import Limit from './demo/limit.vue';
import MaxSize from './demo/max-size.vue';
import SinglePicture from './demo/single-picture.vue';
import SlotsFile from './demo/slots-file.vue';
import ThemeButton from './demo/theme-button.vue';
import ThemePicture from './demo/theme-picture.vue';

const { t } = i18n.global;

const uploadProps: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'draggable',
    desc: t('上传组件类型'),
    optional: [t('支持拖拽和点击(draggable)'), t('按钮(button)'), t('图片卡片(picture)')],
  },
  {
    name: 'accept',
    type: 'String',
    default: null,
    desc: t('可选的文件类型。theme为 picture 时且 accept 没有配置时，可接受文件文类型为："image/png,image/jpeg,image/jpg"'),
    optional: ['image/png', '.zip'],
  },
  {
    name: 'url',
    type: 'String',
    default: null,
    desc: t('服务器地址（必传）'),
    optional: [],
  },
  {
    name: 'header',
    type: 'Array / Object',
    default: null,
    desc: t('请求头 {\'{\'}\' name: \'\', value: \'\' {\'}\'}'),
    optional: [],
  },
  {
    name: 'handle-res-code',
    type: 'Function',
    default: null,
    desc: t('处理返回码的函数，默认参数 response，需要返回 true 或 false'),
    optional: [],
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: 'true',
    desc: t('是否支持多选'),
    optional: ['true', 'false'],
  },
  {
    name: 'name',
    type: 'String',
    default: 'upload_file',
    desc: t('后台读取文件的'),
    optional: [],
  },
  {
    name: 'size',
    type: 'Number/ Object',
    default: '5(MB)',
    desc: t('限制上传文件体积 {\'{\'} maxFileSize: 1, maxImgSize: 1 {\'}\'}'),
    optional: [],
  },
  {
    name: 'limit',
    type: 'Number',
    default: null,
    desc: t('限制上传文件个数'),
    optional: [],
  },
  {
    name: 'form-data-attributes',
    type: 'Array | [{ name: "attrName", value: Object }]',
    default: null,
    desc: t('自定义上传属性'),
    optional: [],
  },
  {
    name: 'with-credentials	',
    type: 'Boolean',
    default: 'false',
    desc: t('是否允许带上 cookie'),
    optional: ['true', 'false'],
  },
  {
    name: 'tip',
    type: 'String',
    default: null,
    desc: t('提示信息'),
    optional: [],
  },
  {
    name: 'validate-name',
    type: 'RegExp',
    default: null,
    desc: t('用来验证文件名是否合法的'),
    optional: [],
  },
  {
    name: 'custom-request',
    type: 'Function',
    default: null,
    desc: t('覆盖默认的上传行为，自定义上传的实现'),
    optional: [],
  },
  {
    name: 'files',
    type: 'Array',
    default: null,
    desc: t('默认图片'),
    optional: [],
  },
  {
    name: 'before-upload',
    type: 'Function',
    default: null,
    desc: t('上传文件之前的钩子，参数为上传的文件，若返回false或者返回 Promise 且被 reject，则停止上传'),
    optional: [],
  },
  {
    name: 'before-remove',
    type: 'Function',
    default: null,
    desc: t('删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除'),
    optional: [],
  },
  {
    name: 'slice-upload',
    type: 'Boolean',
    default: 'false',
    desc: t('是否采用大文件分片上传'),
    optional: ['true', 'false'],
  },
  {
    name: 'slice-url',
    type: 'String',
    default: null,
    desc: t('分片上传chunk服务器路径'),
    optional: [],
  },
  {
    name: 'merge-url',
    type: 'String',
    default: null,
    desc: t('分片上传合并chunk服务器路径'),
    optional: [],
  },
  {
    name: 'chunk-size',
    type: 'Number',
    default: '10M',
    desc: t('分片大小'),
    optional: [],
  },
];

const uploadEvents: IPropsTableItem[] = [
  {
    name: 'done',
    type: 'Function',
    default: null,
    desc: t('所有文件上传完毕后的事件'),
    optional: ['fileList'],
  },
  {
    name: 'progress',
    type: 'Function',
    default: null,
    desc: t('文件上传进行时的事件'),
    optional: ['event', 'file', 'fileList'],
  },
  {
    name: 'success',
    type: 'Function',
    default: null,
    desc: t('文件上传成功后的事件'),
    optional: ['file', 'fileList'],
  },
  {
    name: 'error',
    type: 'Function',
    default: null,
    desc: t('文件上传失败后的事件'),
    optional: ['file', 'fileList', 'error'],
  },
  {
    name: 'exceed',
    type: 'Function',
    default: null,
    desc: t('文件上传个数超出限制后的事件'),
    optional: ['file', 'fileList'],
  },
  {
    name: 'delete',
    type: 'Function',
    default: null,
    desc: t('文件上传成功后，点击删除文件触发的事件'),
    optional: ['file（删除的哪个文件对象）', 'fileList（删除后的文件列表）'],
  },
];

const uploadSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'String',
    default: null,
    desc: t('自定义默认内容'),
    optional: [],
  },
  {
    name: 'trigger',
    type: 'String',
    default: null,
    desc: t('触发文件选择框的内容'),
    optional: [],
  },
  {
    name: 'tip',
    type: 'String',
    default: null,
    desc: t('提示说明文字'),
    optional: [],
  },
  {
    name: 'file',
    type: 'String',
    default: null,
    desc: t('文件列表项内容'),
    optional: ['{ file: UploadFile }'],
  },
];

export default defineComponent({
  name: 'Checkbox',

  render() {
    return (
      <div>
        <DemoTitle
          name="Upload"
          desc={ t('通过点击或者拖拽上传文件') }>
        </DemoTitle>
        <DemoBox
          title={t('基础用法')}
          desc={ t('上传组件提供图片和文件上传的功能，由 accept 属性来定义允许上传的文件类型，默认为 *') }
          componentName="upload"
          demoName="/demo/base">
            <Base />
        </DemoBox>
        <DemoBox
          title={ t('上传图片') }
          desc={ t('配置 accept 属性，限制用户只允许上传 jpg、jpeg、png 格式的图片')}
          componentName="upload"
          demoName="/demo/accept-image">
            <AcceptImage />
        </DemoBox>
        <DemoBox
          title={ t('上传 zip 文件') }
          desc={ t('配置 accept 属性，限制用户只允许上传 zip 格式的文件') }
          componentName="upload"
          demoName="/demo/accept-zip">
            <AcceptZip />
        </DemoBox>
        <DemoBox
          title={ t('设置文件大小') }
          desc={ t('配置 size 属性，限制上传文件的大小') }
          componentName="upload"
          demoName="/demo/max-size">
            <MaxSize />
        </DemoBox>
        <DemoBox
          title={ t('设置上传文件个数') }
          desc={ t('配置 limit 属性，设置上传文件个数') }
          componentName="upload"
          demoName="/demo/limit">
            <Limit />
        </DemoBox>
        <DemoBox
          title={ t('点击按钮上传') }
          desc={ t('设置 theme 属性为 button') }
          componentName="upload"
          demoName="/demo/theme-button">
            <ThemeButton />
        </DemoBox>
        <DemoBox
          title={ t('照片墙') }
          desc={t('设置 theme 属性为 picture，限制文件类型为图片类型，比如：png，jpeg，jpg') }
          componentName="upload"
          demoName="/demo/theme-picture">
            <ThemePicture />
        </DemoBox>
        <DemoBox
          title={ t('头像上传') }
          desc={ t('设置 theme 属性为 picture，multiple 属性设置为 false，并限制文件类型为图片类型，比如：png，jpeg，jpg') }
          componentName="upload"
          demoName="/demo/single-picture">
            <SinglePicture />
        </DemoBox>
        <DemoBox
          title={ t('自定义文件列表项') }
          desc={ t('使用 slot 自定义文件列表项') }
          componentName="upload"
          demoName="/demo/slots-file">
            <SlotsFile />
        </DemoBox>
        <PropsBox
          title={ t('Upload 属性') }
          subtitle=""
          propsData={uploadProps}/>
        <PropsBox
          title={ t('Upload 事件') }
          subtitle=""
          propsData={uploadEvents}/>
        <PropsBox
          title={ t('Upload 插槽')}
          subtitle=""
          propsData={uploadSlots}/>
      </div>
    );
  },
});
