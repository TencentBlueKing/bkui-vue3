/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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

import { NavGroupMeta, type IComponentWiki } from '@bkui-vue/shared';

import { APIResponse } from '../src/upload.type';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '提供图片和文件上传功能',
    props: {
      url: 'https://jsonplaceholder.typicode.com/posts/',
      accept: 'image/*',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'type',
    description: '上传类型',
    type: 'string',
    options: ['formdata', 'binary'],
    default: 'formdata',
  },
  {
    name: 'theme',
    description: '上传主题',
    type: 'string',
    options: ['button', 'draggable', 'picture'],
    default: 'draggable',
  },
  {
    name: 'files',
    description: '上传文件',
    type: 'Array<UploadFile>',
    default: [],
  },
  {
    name: 'name',
    description: '后台读取文件的 key',
    type: 'string',
    default: 'upload_file',
  },
  {
    name: 'multiple',
    description: '是否多选',
    type: 'boolean',
    default: true,
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'autoUpload',
    description: '是否自动上传',
    type: 'boolean',
    default: true,
  },
  {
    name: 'accept',
    description: '上传文件类型',
    type: 'string',
    default: '',
  },
  {
    name: 'delayTime',
    description: '延迟上传时间',
    type: 'number',
    default: 0,
  },
  {
    name: 'url',
    description: '上传地址',
    type: 'string',
    default: '',
  },
  {
    name: 'method',
    description: '上传方法',
    type: 'string',
    default: 'post',
  },
  {
    name: 'size',
    description: '上传大小',
    type: 'object | number',
    default: {
      maxFileSize: 5,
      maxImgSize: 1,
    },
  },
  {
    name: 'handleResCode',
    description: '处理响应码',
    type: 'function',
    default: (res: APIResponse) => {
      if (res && res.code === 0) {
        return true;
      }
      return false;
    },
  },
  {
    name: 'headers',
    description: '请求头',
    type: 'Headers',
    default: {},
  },
  {
    name: 'header',
    description: '请求头',
    type: 'HeaderDataAttr | HeaderDataAttr[]',
    default: [],
  },
  {
    name: 'tip',
    description: '提示',
    type: 'string',
    default: '',
  },
  {
    name: 'validateName',
    description: '验证文件名称',
    type: 'RegExp',
    default: '',
  },
  {
    name: 'withCredentials',
    description: '是否携带凭证',
    type: 'boolean',
    default: false,
  },
  {
    name: 'limit',
    description: '上传文件数量',
    type: 'number',
    default: 0,
  },
  {
    name: 'data',
    description: '上传文件数据',
    type: 'ExtraFormData | ExtraFormData[]',
    default: [],
  },
  {
    name: 'formDataAttributes',
    description: '上传文件数据属性',
    type: 'FormDataAttr | FormDataAttr[]',
    default: [],
  },
  {
    name: 'extCls',
    description: '扩展类名',
    type: 'string',
    default: '',
  },
  {
    name: 'customRequest',
    description: '自定义请求',
    type: 'UploadRequestHandler',
    default: '',
  },
  {
    name: 'selectChange',
    description: '选择文件改变',
    type: '(event: Event) => boolean | void',
    default: '',
  },
  {
    name: 'beforeUpload',
    description: '上传文件前',
    type: '(file: UploadRawFile, uploadFiles: File[]) => Promise<boolean> | boolean',
    default: '',
  },
  {
    name: 'beforeRemove',
    description: '删除文件前',
    type: '(file: UploadFile, uploadFiles: UploadFile[]) => Promise<boolean> | boolean',
    default: '',
  },
  {
    name: 'sliceUpload',
    description: '是否分片上传',
    type: 'boolean',
    default: false,
  },
  {
    name: 'sliceUrl',
    description: '分片上传地址',
    type: 'string',
    default: '',
  },
  {
    name: 'mergeUrl',
    description: '合并上传地址',
    type: 'string',
    default: '',
  },
  {
    name: 'chunkSize',
    description: '分片大小',
    type: 'number',
    default: 10,
  },
  {
    name: 'isShowPreview',
    description: '是否显示预览按钮',
    type: 'boolean',
    default: true,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'exceed',
    description: '上传文件数量超出限制时触发',
    params: [
      {
        name: 'files',
        type: 'File[]',
      },
      {
        name: 'fileList',
        type: 'UploadFiles',
      },
    ],
  },
  {
    name: 'progress',
    description: '上传进度时触发',
    params: [
      {
        name: 'event',
        type: 'UploadProgressEvent',
      },
      {
        name: 'file',
        type: 'UploadRawFile',
      },
      {
        name: 'fileList',
        type: 'UploadFiles',
      },
    ],
  },
  {
    name: 'success',
    description: '上传成功时触发',
    params: [
      {
        name: 'res',
        type: 'unknown',
      },
      {
        name: 'file',
        type: 'UploadRawFile',
      },
      {
        name: 'fileList',
        type: 'UploadFiles',
      },
    ],
  },
  {
    name: 'error',
    description: '上传失败时触发',
    params: [
      {
        name: 'rawFile',
        type: 'UploadRawFile',
      },
      {
        name: 'fileList',
        type: 'UploadFiles',
      },
      {
        name: 'error',
        type: 'Error',
      },
    ],
  },
  {
    name: 'delete',
    description: '删除文件时触发',
    params: [
      {
        name: 'file',
        type: 'UploadFile',
      },
      {
        name: 'fileList',
        type: 'UploadFile[]',
      },
    ],
  },
  {
    name: 'done',
    description: '上传完成时触发',
    params: [
      {
        name: 'fileList',
        type: 'UploadFiles',
      },
    ],
  },
  {
    name: 'preview',
    description: '预览文件时触发',
    params: [
      {
        name: 'file',
        type: 'UploadFile',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'upload';

// 组件标签
const title = 'Upload';

// 组件中文标签
const titleCN = '上传';

// 组件描述
const description = '上传';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
};

export default wiki;
