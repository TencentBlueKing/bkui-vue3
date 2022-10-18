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
declare module '@vue/runtime-core' {
  interface GlobalComponents {
    BkBreadcrumbItem: typeof import('./breadcrumb/breadcrumb-item').default;
    BkButtonGroup: typeof import('./button/button-group').default;
    BkCascaderPanel: typeof import('./cascader/cascader-panel').default;
    BkCheckboxGroup: typeof import('./checkbox/checkbox-group').default;
    BkRow: typeof import('./container/row').default;
    BkCol: typeof import('./container/col').default;
    BkDropdownMenu: typeof import('./dropdown/dropdown-menu').default;
    BkDropdownItem: typeof import('./dropdown/dropdown-item').default;
    BkFormItem: typeof import('./form/form-item').default;
    BkComposeFormItem: typeof import('./form/compose-form-item').default;
    BkMenuItem: typeof import('./menu/menu-item').default;
    BkSubmenu: typeof import('./menu/submenu').default;
    BkMenuGroup: typeof import('./menu/menu-group').default;
    BkRadioGroup: typeof import('./radio/radio-group').default;
    BkRadioButton: typeof import('./radio/radio-button').default;
    BkOption: typeof import('./select/option').default;
    BkOptionGroup: typeof import('./select/optionGroup').default;
    BkTabPanel: typeof import('./tab/tab-panel').default;
    BkAlert: typeof import('./alert/alert').default;
    BkAnimateNumber: typeof import('./animate-number/animate-number').default;
    BkAffix: typeof import('./affix/affix').default;
    BkBacktop: typeof import('./backtop/backtop').default;
    BkBadge: typeof import('./badge/badge').default;
    BkBreadcrumb: typeof import('./breadcrumb/breadcrumb').default;
    BkButton: typeof import('./button/button').default;
    BkCard: typeof import('./card/card').default;
    BkCheckbox: typeof import('./checkbox/checkbox').default;
    BkCollapse: typeof import('./collapse/collapse').default;
    BkDialog: typeof import('./dialog/dialog').default;
    BkException: typeof import('./exception/exception').default;
    BkFixedNavbar: typeof import('./fixed-navbar/fixed-navbar').default;
    BkInput: typeof import('./input/input').default;
    BkLink: typeof import('./link/link').default;
    BkLoading: typeof import('./loading/loading').default;
    BkModal: typeof import('./modal/modal').default;
    BkPopover: typeof import('./popover/popover').default;
    BkPopover2: typeof import('./popover2/popover2').default;
    BkProgress: typeof import('./progress/progress').default;
    BkRadio: typeof import('./radio/radio').default;
    BkRate: typeof import('./rate/rate').default;
    BkSwiper: typeof import('./swiper/swiper').default;
    BkSelect: typeof import('./select/select').default;
    BkSideslider: typeof import('./sideslider/sideslider').default;
    BkSteps: typeof import('./steps/steps').default;
    BkSwitcher: typeof import('./switcher/switcher').default;
    BkTable: typeof import('./table/table').default;
    BkTag: typeof import('./tag/tag').default;
    BkTagInput: typeof import('./tag-input/tag-input').default;
    BkDivider: typeof import('./divider/divider').default;
    BkTab: typeof import('./tab/tab').default;
    BkMessage: typeof import('./message/messageConstructor').default;
    BkNotify: typeof import('./notify/notifyConstructor').default;
    BkMenu: typeof import('./menu/menu').default;
    BkNavigation: typeof import('./navigation/navigation').default;
    BkDatePicker: typeof import('./date-picker/date-picker').default;
    BkTransfer: typeof import('./transfer/transfer').default;
    BkTree: typeof import('./tree/tree').default;
    BkVirtualRender: typeof import('./virtual-render/virtual-render').default;
    BkForm: typeof import('./form/form').default;
    BkPagination: typeof import('./pagination/pagination').default;
    BkContainer: typeof import('./container/container').default;
    BkcontainerProps: typeof import('./container/container').default;
    BkDropdown: typeof import('./dropdown/dropdown').default;
    BkCascader: typeof import('./cascader/cascader').default;
    BkSlider: typeof import('./slider/slider').default;
    BkResizeLayout: typeof import('./resize-layout/resize-layout').default;
    BkTimeLine: typeof import('./timeline/timeline').default;
    BkProcess: typeof import('./process/process').default;
    BkUpload: typeof import('./upload/upload').default;
    BkCodeDiff: typeof import('./code-diff/code-diff').default;
    BkSeachSelect: typeof import('./code-diff/search-select').default;
  }
}
export {};
