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

interface LANG {
  [langName: string]: string[];
}

const ResizeLayout: LANG = {
  通过拉伸侧栏调整布局大小: ['Resize the layout by stretching the sidebar'],
  最小化: ['Minimize'],
  实时拉伸: ['Live stretch'],
  可折叠: ['Foldable'],
  多级嵌套: ['Multilevel nesting'],
};

const Grid: LANG = {
  '通过栅格系统，迅速简便地创建布局。': ['Create layouts quickly and easily through the grid system'],
  基础布局: ['Basic Layout'],
  'flex 布局': ['Flex Layout'],
  栅格数: ['Number of grids'],
  栅格布局集合: ['Grid Layout Collection'],
  '创建基础的栅格布局。默认采用 24 栅格系统，将区域进行 24 等分。': [
    'Create a basic grid layout. By default, a 24 grid system is used to divide the area 24 evenly.',
  ],
  自定义设置栅格之间的边距以及每个栅格的占位数: ['Customize the margin between grids and the percentage of each grid'],
  自定义设置栅格数以及整个栅格容器的左右边距: [
    'Customize the number of grids and the left and right margins of the entire grid container',
  ],
  '通过 bk-container 的 col 属性来设置栅格数，这里设置成 12，将区域进行 12 等分，通过 bk-container 的 margin 属性来整个栅格容器的左右边距。':
    [
      'The number of grids is set by the col attribute of bk-container. Here it is set to 12. The area is divided into 12 equal parts. The left and right margins of the entire grid container are determined by the margin attribute of bk-container.',
    ],
  '通过 bk-container 的 flex 属性来开启 flex 布局，配合 bk-col, bk-row 的嵌套使用来实现更复杂的布局。': [
    'Open the flex layout through the flex attribute of bk-container, and realize more complex layout with the nested use of bk-col and bk-row.',
  ],
  '通过 bk-container 的 gutter 属性来设置栅格之间的间隔，通过 bk-col 的 span 属性来设置栅格的占位数。': [
    'The spacing between grids is set by the gutter attribute of bk-container, and the number of grids is set by the span attribute of bk-col.',
  ],
  自定义设置栅格的顺序以及栅格的偏移: ['Customize the order and offset of the grid'],
  '通过 bk-col 的 push 和 pull 属性来设置栅格的顺序。通过 bk-col 的 offset 属性设置栅格的偏移。': [
    'Set the grid order through the push and pull attributes of bk-col. Set the offset of the grid through the offset attribute of bk-col.',
  ],
  'bk-container 属性': ['Bk-container Attributes'],
  'bk-col 属性': ['Bk-col Attributes'],
  栅格之间的间距: ['Spacing between grids'],
  栅格容器的左右外边距: ['The left and right outer margins of the grid container'],
  '是否启用 flex 布局': ['Enable flex layout'],
  '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-grid-container 上': [
    'Configure the custom style class name, and the incoming class will be added to the DOM. bk-grid-container at the outermost layer of the component',
  ],
  '栅格的占位格数，当设置为 0 时，则自动设置为 col 相当于 width: 100%': [
    'The number of grid placeholders. When set to 0, it is automatically set to col, which is equivalent to width: 100%',
  ],
  栅格的偏移: ['Offset of grid'],
  栅格向左移动格数: ['Grid moves the number of cells to the left'],
  栅格向右移动格数: ['Grid moves the number of cells to the right'],
};

export default {
  ...ResizeLayout,
  ...Grid,
};
