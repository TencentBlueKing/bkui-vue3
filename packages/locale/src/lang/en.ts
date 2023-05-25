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

const en = {
  lang: 'en',
  steps: {
    step1: 'step1',
    step2: 'step2',
    step3: 'step3',
  },
  datePicker: {
    selectDate: 'Select Date',
    selectTime: 'Select Time',
    clear: 'Clear',
    ok: 'OK',
    weekdays: {
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
    },
    hour: 'Hour',
    min: 'Minute',
    sec: 'Second',
    toNow: 'Now',
    // now: 'Now',
  },
  dialog: {
    ok: 'OK',
    cancel: 'Cancel',
    prev: 'prev',
    next: 'next',
  },
  popConfirm: {
    ok: 'OK',
    cancel: 'Cancel',
  },
  form: {
    notBeEmpty: 'cannot be empty',
    incorrectFormat: 'incorrect format',
    max: 'maximum value',
    min: 'minimum value',
    maxLen: 'maximum length',
    verifyError: 'verify error',
  },
  pagination: {
    eachPage: 'Each Page',
    strip: '',
    total: 'Total',
  },
  process: {
    step1: 'step1',
    step2: 'step2',
    step3: 'step3',
    step4: 'step4',
  },
  searchSelect: {
    pleaseSelect: 'Please Select',
    loading: 'Loading...',
    filterQueryMustHasValue: 'Filter query containing key value must have value',
    ok: 'OK',
    cancel: 'Cancel',
    or: 'Or',
    and: 'And',
  },
  select: {
    noData: 'No data',
    noMatchedData: 'No matched data',
    loading: 'Loading...',
    pleaseSelect: 'Please select',
    enterKeywords: 'Please enter keywords',
    all: 'All',
  },
  table: {
    emptyText: 'No Data',
    confirm: 'Confirm',
    reset: 'Reset',
    setting: {
      title: 'Table Settings',
      fields: {
        title: 'Displaying Fields Setting',
        subtitle: (max: number) => `（${max} fields most）`,
        selectAll: 'All',
      },
      lineHeight: {
        title: 'Table Line Height',
        small: 'small',
        medium: 'medium',
        large: 'large',
      },
      options: {
        ok: 'OK',
        cancel: 'Cancel',
      },
    },
  },
  transfer: {
    sourceList: 'Source List',
    targetList: 'Target List',
    removeAll: 'Remove All',
    selectAll: 'Select All',
    noData: 'No Data',
    noSelected: 'No Selected',
    search: 'Search',
  },
  upload: {
    uploadSuccess: 'Upload Success',
    uploadFailed: 'Upload Failed',
    drapFileOr: 'Drag files here or ',
    clickUpload: 'Click Upload',
    uploadLabel: 'Upload Files',
  },
  input: {
    placeholder: 'Please input',
  },
  tagInput: {
    placeholder: 'Please input and press ENTER to finish',
  },
  // exception: {
  //   403: 'Forbidden',
  //   404: 'Not Found',
  //   500: 'Internal Server Error',
  //   building: 'Building',
  //   empty: 'No Data',
  //   searchEmpty: 'Search Is Empty',
  //   login: 'Please log in to Blueking',
  // },
  // imageViewer: {
  //   loadFailed: 'Picture failed to load.',
  //   quitTips: 'ESC Can Exit fullscreen',
  // },
  // notify: {
  //   showMore: 'Show more',
  // },
  // sideslider: {
  //   title: 'Title',
  // },
  // tree: {
  //   emptyText: 'No Data',
  // },
  // navigation: {
  //   headerTitle: 'Program name',
  // },
  // bigTree: {
  //   emptyText: 'No Data',
  // },
  // message: {
  //   copy: 'copy',
  //   copied: 'copied',
  // },
  // image: {
  //   zoomIn: 'zoom in',
  //   zoomOut: 'zoom out',
  //   rotateLeft: 'anticlockwise',
  //   rotateRight: 'clockwise rotation',
  //   fullScreen: 'full screen',
  //   original: 'original size',
  //   prev: 'prev',
  //   next: 'next',
  // },
  // versionDetail: {
  //   currentTagText: 'Current',
  // },
};

export type Language = typeof en;

export default en;
