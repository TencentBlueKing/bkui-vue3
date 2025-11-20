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
      theme: 'button',
      withCredentials: true,
      isShowPreview: true,
    },
  },
  {
    title: '上传图片',
    description: '只允许jpg、png、jpeg格式',
    props: {
      theme: 'picture',
      withCredentials: true,
      size: 5,
      isShowPreview: true,
      url: 'https://jsonplaceholder.typicode.com/posts/',
    },
    style: `
      .edit-component-component {
        display: flex;
        justify-content: center;
      }
    `,
  },
  {
    title: '拖拽上传',
    description: '把文件拖拽到指定区域进行上传',
    props: {
      size: 5,
      withCredentials: true,
      isShowPreview: true,
      url: 'https://jsonplaceholder.typicode.com/posts/',
    },
  },
  {
    title: '点击按钮上传',
    description: '设置 theme 属性为 button',
    props: {
      files: [
        {
          name: 'test.ppt',
        },
      ],
      theme: 'button',
      size: 5,
      tip: '最大上传5(Mb)的文件',
      handleResCode: `
        (response) => {
          if (response.id) {
            return true;
          }
          return false;
        }
      `,
      withCredentials: true,
      isShowPreview: true,
      url: 'https://jsonplaceholder.typicode.com/posts/',
    },
    style: `
      .edit-component-view-wrapper .edit-component-view .edit-component-component {
        text-align: left;
      }
    `,
  },
  {
    title: '设置文件大小和个数',
    description: '设置文件大小和个数',
    props: {
      size: 5,
      limit: 2,
      tip: `最多上传2个文件，单个文件大小不超过5MB`,
      withCredentials: true,
      isShowPreview: true,
      url: 'https://jsonplaceholder.typicode.com/posts/',
    },
    style: `
      .edit-component-view-wrapper .edit-component-view .edit-component-component {
        text-align: left;
      }
    `,
  },
  {
    title: '自定义文件列表项',
    description: '使用 slot 自定义文件列表项',
    props: {
      files: [
        {
          name: 'test.ppt',
        },
      ],
      theme: 'button',
      size: 5,
      tip: '最大上传5(Mb)的文件',
      handleResCode: `
        (response) => {
          if (response.id) {
            return true;
          }
          return false;
        }
      `,
      withCredentials: true,
      isShowPreview: true,
      url: 'https://jsonplaceholder.typicode.com/posts/',
    },
    slots: {
      file: `
        <div>
          {{data.file.name}}
          <a
            class="action-link"
            href="javascrip:;"
            @click.stop.prevent="() => {
              console.log('删除');
              // 这里可以调用删除方法
              // uploader.value?.handleRemove(file);
            }"
            >删除</a>
          <a
            v-if="data.file.status === 'fail'"
            class="action-link"
            href="javascrip:;"
            @click.stop.prevent="() => {
              console.log('重试');
              // 这里可以调用重试方法
              // uploader.value?.handleRetry(file);
            }"
            >重试</a>
        </div>
      `,
    },
    style: `
      .edit-component-view-wrapper .edit-component-view .edit-component-component {
        text-align: left;
      }
    `,
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
    link: '/components/upload/api#UploadFile',
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
    link: '/components/upload/api#APIResponse',
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
    type: 'HeaderDataAttr | Array<HeaderDataAttr>',
    default: [],
    link: '/components/upload/api#HeaderDataAttr',
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
    type: 'ExtraFormData | Array<ExtraFormData>',
    default: [],
    link: '/components/upload/api#ExtraFormData',
  },
  {
    name: 'formDataAttributes',
    description: '上传文件数据属性',
    type: 'FormDataAttr | Array<FormDataAttr>',
    default: [],
    link: '/components/upload/api#FormDataAttr',
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
    type: '(options: UploadRequestOptions) => Promise<unknown> | XMLHttpRequest',
    default: '',
    link: '/components/upload/api#UploadRequestOptions',
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
    type: '(file: File & { uid: number }, Array<UploadFile>) => Promise<boolean> | boolean',
    default: '',
  },
  {
    name: 'beforeRemove',
    description: '删除文件前',
    type: '(file: UploadFile, uploadFiles: Array<UploadFile>) => Promise<boolean> | boolean',
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
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
      },
    ],
  },
  {
    name: 'progress',
    description: '上传进度时触发',
    params: [
      {
        name: 'event',
        type: 'ProgressEvent & { percent: number }',
      },
      {
        name: 'file',
        type: 'File & { uid: number }',
      },
      {
        name: 'fileList',
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
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
        type: 'File & { uid: number }',
      },
      {
        name: 'fileList',
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
      },
    ],
  },
  {
    name: 'error',
    description: '上传失败时触发',
    params: [
      {
        name: 'rawFile',
        type: 'File & { uid: number }',
      },
      {
        name: 'fileList',
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
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
        link: '/components/upload/api#UploadFile',
      },
      {
        name: 'fileList',
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
      },
    ],
  },
  {
    name: 'done',
    description: '上传完成时触发',
    params: [
      {
        name: 'fileList',
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
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
        link: '/components/upload/api#UploadFile',
      },
      {
        name: 'files',
        type: 'Array<UploadFile>',
        link: '/components/upload/api#UploadFile',
      },
    ],
  },
];

const types = [
  {
    name: 'UploadFile',
    description: '上传文件',
    fields: [
      {
        name: 'name',
        type: 'string',
        description: '文件名称',
      },
      {
        name: 'status',
        type: 'string',
        description: '文件状态',
        options: ['success', 'error', 'uploading', 'new'],
      },
      {
        name: 'statusText',
        type: 'string',
        description: '文件状态文本',
      },
      {
        name: 'percentage',
        type: 'number',
        description: '文件上传进度',
      },
      {
        name: 'response',
        type: 'unknown',
        description: '文件上传响应',
      },
      {
        name: 'size',
        type: 'number',
        description: '文件大小',
      },
      {
        name: 'uid',
        type: 'number',
        description: '文件唯一标识',
      },
      {
        name: 'url',
        type: 'string',
        description: '文件URL',
      },
      {
        name: 'raw',
        type: 'File & { uid: number }',
        description: '文件原始数据',
      },
      {
        name: 'isPic',
        type: 'boolean',
        description: '是否为图片',
      },
    ],
  },
  {
    name: 'APIResponse',
    description: 'API响应',
    fields: [
      {
        name: 'code',
        type: 'number',
        description: '响应码',
      },
      {
        name: 'data',
        type: 'any',
        description: '响应数据',
      },
      {
        name: 'message',
        type: 'string',
        description: '响应消息',
      },
    ],
  },
  {
    name: 'HeaderDataAttr',
    description: '请求头数据',
    fields: [
      {
        name: 'name',
        type: 'string',
        description: '请求头名称',
      },
      {
        name: 'value',
        type: 'string',
        description: '请求头值',
      },
    ],
  },
  {
    name: 'ExtraFormData',
    description: '额外上传数据',
    fields: [
      {
        name: '[key: string]',
        type: '[Blob | string, string] | Blob | string',
        description: 'Blob | string 与 string 的键值对，或 Blob | string',
      },
    ],
  },
  {
    name: 'FormDataAttr',
    description: '表单数据属性',
    fields: [
      {
        name: 'name',
        type: 'string',
        description: '数据名称',
      },
      {
        name: 'value',
        type: '[Blob | string, string] | Blob | string',
        description: '数据值',
      },
    ],
  },
  {
    name: 'UploadRequestOptions',
    description: '上传请求选项',
    fields: [
      {
        name: 'action',
        type: 'string',
        description: '上传地址',
      },
      {
        name: 'method',
        type: 'string',
        description: '上传方法',
      },
      {
        name: 'type',
        type: 'string',
        options: ['formdata', 'binary'],
        description: '上传类型',
      },
      {
        name: 'data',
        type: 'ExtraFormData | Array<ExtraFormData>',
        description: '上传数据',
        link: '/components/upload/api#ExtraFormData',
      },
      {
        name: 'formDataAttributes',
        type: 'FormDataAttr | Array<FormDataAttr>',
        description: '表单数据属性',
        link: '/components/upload/api#FormDataAttr',
      },
      {
        name: 'filename',
        type: 'string',
        description: '文件名称',
      },
      {
        name: 'file',
        type: 'File',
        description: '文件',
      },
      {
        name: 'headers',
        type: 'Headers',
        description: '请求头',
      },
      {
        name: 'header',
        type: 'HeaderDataAttr | Array<HeaderDataAttr>',
        description: '请求头',
        link: '/components/upload/api#HeaderDataAttr',
      },
      {
        name: 'withCredentials',
        type: 'boolean',
        description: '是否携带凭证',
      },
      {
        name: 'sliceUrl',
        type: 'string',
        description: '分片上传地址',
      },
      {
        name: 'mergeUrl',
        type: 'string',
        description: '合并上传地址',
      },
      {
        name: 'chunkSize',
        type: 'number',
        description: '分片大小',
      },
      {
        name: 'onProgress',
        type: '(event: ProgressEvent & { percent: number }, i?: number) => void',
        description: '上传进度',
      },
      {
        name: 'onError',
        type: '(error: Error) => void',
        description: '上传错误',
      },
      {
        name: 'onSuccess',
        type: '(res: APIResponse | XMLHttpRequestResponseType | unknown) => void',
        description: '上传成功',
        link: '/components/upload/api#APIResponse',
      },
      {
        name: 'onComplete',
        type: 'function',
        description: '上传完成',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '自定义默认内容',
  },
  {
    name: 'trigger',
    description: '触发文件选择框的内容',
  },
  {
    name: 'tip',
    description: '提示说明文字',
  },
  {
    name: 'list',
    description: '文件列表项内容',
    params: [
      {
        name: 'file',
        type: '{ file: UploadFile }',
        link: '/components/upload/api#UploadFile',
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
  types,
  slots,
  presets,
  description,
};

export default wiki;
