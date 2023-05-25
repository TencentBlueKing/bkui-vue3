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

import type { Language } from './en';

const zhCn: Language = {
  lang: 'zh-cn',
  steps: {
    step1: '步骤1',
    step2: '步骤2',
    step3: '步骤3',
  },
  datePicker: {
    selectDate: '选择日期',
    selectTime: '选择时间',
    clear: '清除',
    ok: '确定',
    weekdays: {
      sun: '日',
      mon: '一',
      tue: '二',
      wed: '三',
      thu: '四',
      fri: '五',
      sat: '六',
    },
    hour: '时',
    min: '分',
    sec: '秒',
    toNow: '至今',
    // now: '此刻',
  },
  dialog: {
    ok: '确定',
    cancel: '取消',
    prev: '上一步',
    next: '下一步',
  },
  popConfirm: {
    ok: '确定',
    cancel: '取消',
  },
  form: {
    notBeEmpty: '不能为空',
    incorrectFormat: '格式不正确',
    max: '最大值',
    min: '最小值',
    maxLen: '最大长度',
    verifyError: '验证错误',
  },
  pagination: {
    eachPage: '每页',
    strip: '条',
    total: '共计',
  },
  process: {
    step1: '步骤1',
    step2: '步骤2',
    step3: '步骤3',
    step4: '步骤4',
  },
  searchSelect: {
    pleaseSelect: '请选择',
    loading: '加载中...',
    filterQueryMustHasValue: '包含键值的过滤查询必须有一个值',
    ok: '确认',
    cancel: '取消',
    or: '或',
    and: '且',
  },
  select: {
    noData: '无数据',
    noMatchedData: '无匹配数据',
    loading: '加载中...',
    pleaseSelect: '请选择',
    enterKeywords: '请输入关键字',
    all: '全部',
  },
  table: {
    emptyText: '暂无数据',
    confirm: '确定',
    reset: '重置',
    setting: {
      title: '表格设置',
      fields: {
        title: '字段显示设置',
        subtitle: (max: number) => `（最多${max}项）`,
        selectAll: '全选',
      },
      lineHeight: {
        title: '表格行高',
        small: '小',
        medium: '中',
        large: '大',
      },
      options: {
        ok: '确认',
        cancel: '取消',
      },
    },
  },
  transfer: {
    sourceList: '源列表',
    targetList: '目标列表',
    removeAll: '清空',
    selectAll: '选择全部',
    noData: '无数据',
    noSelected: '未选择任何项',
    search: '搜索',
  },
  upload: {
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    drapFileOr: '将文件拖到此处或',
    clickUpload: '点击上传',
    uploadLabel: '上传文件',
  },
  input: {
    placeholder: '请输入',
  },
  tagInput: {
    placeholder: '请输入并按Enter结束',
  },
  // exception: {
  //   403: '无业务权限',
  //   404: '页面不存在',
  //   500: '服务维护中',
  //   building: '功能建设中',
  //   empty: '没有数据',
  //   searchEmpty: '搜索为空',
  //   login: '请登入蓝鲸',
  // },

  // imageViewer: {
  //   loadFailed: '抱歉，图片加载失败',
  //   quitTips: 'ESC 可以退出全屏',
  // },
  // notify: {
  //   showMore: '查看更多',
  // },
  // sideslider: {
  //   title: '标题',
  // },
  // tree: {
  //   emptyText: '暂无数据',
  // },
  // navigation: {
  //   headerTitle: '栏目名称',
  // },
  // bigTree: {
  //   emptyText: '暂无搜索结果',
  // },
  // message: {
  //   copy: '复制',
  //   copied: '已复制',
  // },
  // image: {
  //   zoomIn: '放大',
  //   zoomOut: '缩小',
  //   rotateLeft: '向左旋转',
  //   rotateRight: '向右旋转',
  //   fullScreen: '适应屏幕',
  //   original: '快速回到 1：1',
  //   prev: 'prev',
  //   next: 'next',
  // },
  // versionDetail: {
  //   currentTagText: '当前版本',
  // },
};

export default zhCn;
