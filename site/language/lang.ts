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

// 考虑后期数据可能要通过接口获取，所以不在子组件统一进行国际化

// 按侧边栏模块按需引入
import Base from '../locales/Base';
import Data from '../locales/Data';
import FeedBack from '../locales/FeedBack';
import Form from '../locales/Form';
import Layout from '../locales/Layout';
import Nav from '../locales/Nav';;

interface LANG {
  [langName: string]: string[];
}

const Common: LANG = {
  复制成功: ['Copy succeeded'],
  复制失败: ['Copy failed'],
  属性: ['Property'],
  删除: ['Delete'],
  基本用法: ['Basic Usage'],
  基础用法: ['Basic Usage'],
  插槽: ['Slot'],
  测试: ['Test'],
  确认: ['Confirm'],
  取消: ['Cancel'],
  格式错误: ['Format error'],
  执行: ['Implement'],
  代码: ['Code'],
  事件: ['Event'],
  配置数据: ['Configuration data'],
  首页: ['Home Page'],
  进度条: ['Progress Bar'],
  滑块开关: ['Slide Switch'],
  自定义separator: ['Custom Separator'],
  面包屑: ['Crumbs'],
  分割符: ['Separator'],
  分隔符: ['Separator'],
  展开: ['Open'],
  收起: ['Stop'],
  提示信息: ['Prompt information'],
  蓝鲸: ['Blueking'],
  蓝鲸智云: ['Blue whale intelligence cloud'],
  微信: ['WeChat'],
  企业微信: ['WeCom'],
  正常: ['Normal'],
  没有数据: ['No data'],
  暂无数据: ['No data'],
  确定: ['Confirm'],
  重置: ['Reset'],
  全选: ['Select All'],
  小: ['small'],
  中: ['medium'],
  大: ['large'],
};

const MenuTitle: LANG = {
  'Vue 组件库': ['Vue component library'],
  开始: ['Start'],
  基础: ['Base'],
  布局: ['Layout'],
  导航: ['Nav'],
  表单: ['Form'],
  数据: ['Data'],
  反馈: ['Feedback'],
};

const MenuSubTitle: LANG = {
  快速上手: ['Quick start'],
  'Button 基础按钮': ['Button'],
  'Icon 图标': ['Icon'],
  'Grid 栅格': ['Grid'],
  'Menu 菜单': ['Menu'],
  'Navigation 导航': ['Navigation'],
  'FixedNavbar 悬浮导航': ['FixedNavbar'],
  'BackTop 返回顶部': ['BackTop'],
  'Breadcrumb 面包屑': ['Breadcrumb'],
  'Link 文字链接': ['Link'],
  'Steps 步骤': ['Steps'],
  'Process 步骤': ['Process steps'],
  'Timeline 时间轴': ['Timeline'],
  'ColorPicker 颜色选择器': ['ColorPicker'],
  'DatePicker 日期选择器': ['DatePicker'],
  'TimePicker 时间选择器': ['TimePicker'],
  'Divider 分割线': ['Divider'],
  'Tab 选项卡': ['Tab'],
  'Radio 单选框': ['Radio'],
  'Checkbox 多选框': ['Checkbox'],
  'Switcher 开关': ['Switcher'],
  'Select 下拉选框': ['Select'],
  'Input 输入框': ['Input'],
  'Form 表单': ['Form'],
  'Upload 文件上传': ['Upload'],
  'TagInput 标签': ['TagInput'],
  'Cascader 级联选择': ['Cascader'],
  'SearchSelect 查询选择器': ['SearchSelect'],
  'Badge 标记': ['Badge'],
  'Progress 进度条': ['Progress'],
  'Collapse 折叠面板': ['Collapse'],
  'AnimateNumber 动画数字': ['AnimateNumber'],
  'Rate 评分': ['Rate'],
  'Swiper 轮播图': ['Swiper'],
  'Table 表格': ['Table'],
  'DropdownMenu 下拉菜单': ['DropdownMenu'],
  'Tooltips 工具提示': ['Tooltips'],
  'Tree 树': ['Tree'],
  'Tag 标签': ['Tag'],
  'Diff 差异对比': ['Diff'],
  'Pagination 分页': ['Pagination'],
  'Loading 加载': ['Loading'],
  'Alert 警告': ['Alert'],
  'Exception 异常提示': ['Exception'],
  'Card 卡片': ['Card'],
  'Popover 弹出框提示': ['Popover'],
  'Message 消息提示': ['Message'],
  InfoBox提示框: ['InfoBox'],
  'infoBox 消息提示': ['infoBox'],
  'Notify 通知提示': ['Notify'],
  'Slider 滑动选择器': ['Slider'],
  'Sideslider 侧栏': ['Sideslider'],
  'Transfer 穿梭框': ['Transfer'],
  'Dialog 对话框': ['Dialog'],
};

const QuickStart: LANG = {
  '本组件库基于Vue3研发，本节介绍如何在项目中结合webpack 一起使用@blueking/bkui-vue': [
    'This component library is based on Vue3 research and development. This section describes how to use @blueking/bkui-vue in combination with webpack in a project',
  ],
};


const Lang = {
  ...Common,
  ...MenuTitle,
  ...MenuSubTitle,
  ...QuickStart,
  ...Base,
  ...Layout,
  ...Nav,
  ...Form,
  ...Data,
  ...FeedBack,
};

export default Lang;
