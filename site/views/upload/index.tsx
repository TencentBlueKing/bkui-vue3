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

const uploadProps: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'draggable',
    desc: '上传组件类型',
    optional: ['支持拖拽和点击(draggable)', '按钮(button)', '图片卡片(picture)'],
  },
  {
    name: 'accept',
    type: 'String',
    default: null,
    desc: '可选的文件类型。theme为 picture 时且 accept 没有配置时，可接受文件文类型为："image/png,image/jpeg,image/jpg"',
    optional: ['image/png', '.zip'],
  },
  {
    name: 'url',
    type: 'String',
    default: null,
    desc: '服务器地址（必传）',
    optional: [],
  },
  {
    name: 'header',
    type: 'Array / Object',
    default: null,
    desc: '请求头 { name: " ", value: " " }',
    optional: [],
  },
  {
    name: 'handle-res-code',
    type: 'Function',
    default: null,
    desc: '处理返回码的函数，默认参数 response，需要返回 true 或 false',
    optional: [],
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: 'true',
    desc: '是否支持多选',
    optional: ['true', 'false'],
  },
  {
    name: 'name',
    type: 'String',
    default: 'upload_file',
    desc: '后台读取文件的 key',
    optional: [],
  },
  {
    name: 'size',
    type: 'Number/ Object',
    default: '5(MB)',
    desc: '限制上传文件体积 { maxFileSize: 1, maxImgSize: 1 }',
    optional: [],
  },
  {
    name: 'limit',
    type: 'Number',
    default: null,
    desc: '限制上传文件个数',
    optional: [],
  },
  {
    name: 'form-data-attributes',
    type: 'Array | [{ name: "attrName", value: Object }]',
    default: null,
    desc: '自定义上传属性',
    optional: [],
  },
  {
    name: 'with-credentials	',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许带上 cookie',
    optional: ['true', 'false'],
  },
  {
    name: 'tip',
    type: 'String',
    default: null,
    desc: '提示信息',
    optional: [],
  },
  {
    name: 'validate-name',
    type: 'RegExp',
    default: null,
    desc: '用来验证文件名是否合法的',
    optional: [],
  },
  {
    name: 'custom-request',
    type: 'Function',
    default: null,
    desc: '覆盖默认的上传行为，自定义上传的实现',
    optional: [],
  },
  {
    name: 'files',
    type: 'Array',
    default: null,
    desc: '默认图片',
    optional: [],
  },
  {
    name: 'before-upload',
    type: 'Function',
    default: null,
    desc: '上传文件之前的钩子，参数为上传的文件，若返回false或者返回 Promise 且被 reject，则停止上传',
    optional: [],
  },
  {
    name: 'before-remove',
    type: 'Function',
    default: null,
    desc: '删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除',
    optional: [],
  },
  {
    name: 'slice-upload',
    type: 'Boolean',
    default: 'false',
    desc: '是否采用大文件分片上传',
    optional: ['true', 'false'],
  },
  {
    name: 'slice-url',
    type: 'String',
    default: null,
    desc: '分片上传chunk服务器路径',
    optional: [],
  },
  {
    name: 'merge-url',
    type: 'String',
    default: null,
    desc: '分片上传合并chunk服务器路径',
    optional: [],
  },
  {
    name: 'chunk-size',
    type: 'Number',
    default: '10M',
    desc: '分片大小',
    optional: [],
  },
];

const uploadEvents: IPropsTableItem[] = [
  {
    name: 'done',
    type: 'Function',
    default: null,
    desc: '所有文件上传完毕后的事件',
    optional: ['fileList'],
  },
  {
    name: 'progress',
    type: 'Function',
    default: null,
    desc: '文件上传进行时的事件',
    optional: ['event', 'file', 'fileList'],
  },
  {
    name: 'success',
    type: 'Function',
    default: null,
    desc: '文件上传成功后的事件',
    optional: ['file', 'fileList'],
  },
  {
    name: 'error',
    type: 'Function',
    default: null,
    desc: '文件上传失败后的事件',
    optional: ['file', 'fileList', 'error'],
  },
  {
    name: 'exceed',
    type: 'Function',
    default: null,
    desc: '文件上传个数超出限制后的事件',
    optional: ['file', 'fileList'],
  },
  {
    name: 'delete',
    type: 'Function',
    default: null,
    desc: '文件上传成功后，点击删除文件触发的事件	',
    optional: ['file（删除的哪个文件对象）', 'fileList（删除后的文件列表）'],
  },
];

const uploadSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'String',
    default: null,
    desc: '自定义默认内容',
    optional: [],
  },
  {
    name: 'trigger',
    type: 'String',
    default: null,
    desc: '触发文件选择框的内容',
    optional: [],
  },
  {
    name: 'tip',
    type: 'String',
    default: null,
    desc: '提示说明文字',
    optional: [],
  },
  {
    name: 'file',
    type: 'String',
    default: null,
    desc: '文件列表项内容',
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
          desc="通过点击或者拖拽上传文件">
        </DemoTitle>
        <DemoBox
          title="基础用法"
          desc="上传组件提供图片和文件上传的功能，由 accept 属性来定义允许上传的文件类型，默认为 *"
          componentName="upload"
          demoName="/demo/base">
            <Base />
        </DemoBox>
        <DemoBox
          title="上传图片"
          desc="配置 accept 属性，限制用户只允许上传 jpg、jpeg、png 格式的图片"
          componentName="upload"
          demoName="/demo/accept-image">
            <AcceptImage />
        </DemoBox>
        <DemoBox
          title="上传 zip 文件"
          desc="配置 accept 属性，限制用户只允许上传 zip 格式的文件"
          componentName="upload"
          demoName="/demo/accept-zip">
            <AcceptZip />
        </DemoBox>
        <DemoBox
          title="设置文件大小"
          desc="配置 size 属性，限制上传文件的大小"
          componentName="upload"
          demoName="/demo/max-size">
            <MaxSize />
        </DemoBox>
        <DemoBox
          title="设置上传文件个数"
          desc="配置 limit 属性，设置上传文件个数"
          componentName="upload"
          demoName="/demo/limit">
            <Limit />
        </DemoBox>
        <DemoBox
          title="点击按钮上传"
          desc="设置 theme 属性为 button"
          componentName="upload"
          demoName="/demo/theme-button">
            <ThemeButton />
        </DemoBox>
        <DemoBox
          title="照片墙"
          desc="设置 theme 属性为 picture，限制文件类型为图片类型，比如：png，jpeg，jpg"
          componentName="upload"
          demoName="/demo/theme-picture">
            <ThemePicture />
        </DemoBox>
        <DemoBox
          title="头像上传"
          desc="设置 theme 属性为 picture，multiple 属性设置为 false，并限制文件类型为图片类型，比如：png，jpeg，jpg"
          componentName="upload"
          demoName="/demo/single-picture">
            <SinglePicture />
        </DemoBox>
        <DemoBox
          title="自定义文件列表项"
          desc="使用 slot 自定义文件列表项"
          componentName="upload"
          demoName="/demo/slots-file">
            <SlotsFile />
        </DemoBox>
        <PropsBox
          title="Upload Attributes"
          subtitle=""
          propsData={uploadProps}/>
        <PropsBox
          title="Upload Events"
          subtitle=""
          propsData={uploadEvents}/>
        <PropsBox
          title="Upload Slots"
          subtitle=""
          propsData={uploadSlots}/>
      </div>
    );
  },
});
