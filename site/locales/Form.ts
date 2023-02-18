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

const Radio: LANG = {
  单选框组: ['Radio Group'],
  '表单-单选框，在一组选项中进行单选': ['Form - radio box, radio selection in a group of options'],
  选中: ['Selected'],
  默认选中: ['Selected by default'],
  '配合 bk-radio-group 使用': ['Use with bk-radio-group'],
  按钮样式: ['Button style'],
  'Radios 属性': ['Radios Attributes'],
  'Radios-Groups 属性': ['Radios-Groups Attributes'],
  'Radios-Button 属性': ['Radios-Button Attributes'],
  'Radios-Groups 事件': ['Radios-Groups event'],
  'Radios-Button 事件': ['Radios-Button event'],
  邦定值: ['Bonding value'],
  选中状态的值: ['Value of selected state'],
  禁用: ['Disable'],
  默认是否选中: ['Selected by default'],
  当绑定值变化时触发的事件: ['Event triggered when binding value changes'],
};

const CheckBox: LANG = {
  '表单-多选框，在一组选项中进行多选': ['Form - multiple selection box, multiple selections in a group of options'],
  '单独使用：选中时值为true': ['Use alone: the value is true when selected'],
  选中微信: ['Select WeChat'],
  多选框组: ['Multi-selection box group'],
  多个选项在同一个数组的场景: ['Multiple options in the same array'],
  '配合 bk-checkbox-grop 使用，label 配置选中时的值': [
    'Used with bk-checkbox-grop, label configures the selected value',
  ],
  '配置 checked': ['Configure checked'],
  '配置 disabled': ['Configure disabled'],
  半选: ['Half selection'],
  'Checkbox 属性': ['Checkbox Attributes'],
  'Checkbox 事件': ['Checkbox event'],
  'Checkbox-Group 属性': ['Checkbox-Group Attributes'],
  'Checkbox-Group 事件': ['Checkbox-Group event'],
  'Radios-Button 事件': ['Radios-Button event'],
  选中时的值: ['Value when selected'],
  没有选中时的值: ['Value when not selected'],
  默认是否勾选: ['Check by default'],
  是否半选: ['Whether to select half'],
  状态改变时前置校验函数: ['Pre-check function when state changes'],
};

const Switcher: LANG = {
  主题: ['Theme'],
  真值: ['True value'],
  假值: ['False value'],
  更多示例: ['More examples'],
  'Switcher 属性': ['Switcher Attributes'],
  'Switcher 事件': ['Switcher event'],
  不可用状态: ['Unavailable status'],
  在两种状态之间的切换: ['Switching between two states'],
  选中时禁用: ['Disable when selected'],
  未选中时禁用: ['Disable when unchecked'],
  '尺寸，显示文本时此属性无效': ['Size, this Attributes is invalid when displaying text'],
  '可以通过 value / v-model 属性来定义开关状态，': [
    'You can define the switch state through the value/v-model attribute,',
  ],
  '可以通过 size 属性来定义开关的尺寸，需要更大或更小尺寸时使用 large、small 值配置，不配置即为默认尺寸。当设置 show-text 时将显示为特定尺寸同时 size 将失效。':
    [
      'You can define the size of the switch through the size attribute. If you need a larger or smaller size, use the large and small values to configure it. If you do not configure it, it is the default size. When show-text is set, it will be displayed as a specific size and the size will be invalid.',
    ],
  '可以通过 theme 属性来定义开关的主题': ['You can define the theme of the switch through the theme attribute'],
  '可以使用 disabled 属性来定义开关是否禁用，它接受一个 Boolean 值': [
    'You can use the disabled attribute to define whether the switch is disabled. It accepts a Boolean value',
  ],
  前置状态检测: ['Pre-state detection'],
  自定义文案: ['Custom copy'],
  '可以通过 onText/offText 来修改展示的文案自定义文案': [
    'You can modify the displayed custom copy through onText/offText',
  ],
  '可以通过 before-change 接收一个函数来做前置状态检测，返回 false状态切换失败；返回true状态切换成功；返回一个promise，resolve状态切换成功，reject状态切换失败':
    [
      'You can receive a function through before-change to do the pre-state detection, and return false status switch failure; Returns true. The status switch is successful; A promise is returned. The resolve status switch succeeds, and the reject status switch fails',
    ],
  是否打开: ['Open or not'],
  是否显示文本: ['Show text or not'],
  是否为描边效果: ['Whether it is a stroke effect'],
  是否为方形效果: ['Square effect or not'],
  switcher的真值: ['True value of switch'],
  switcher的假值: ['False value of switch'],
  打开状态显示的文本: ['Text for opening status display'],
  关闭状态显示的文本: ['Turn off text for status display'],
  '状态切换的前置检测接收操作后的状态（lastValue），返回true，false，Promise': [
    'The pre-detection of the status after receiving the operation (lastValue) of the status switch returns true, false, Promise',
  ],
  状态发生变化时回调函数: ['Callback function when the state changes'],
};

const Select: LANG = {
  '尺寸 & 风格': ['Size&Style'],
  多选: ['Multiple choice'],
  分组: ['Group'],
  搜索: ['Search'],
  滚动加载: ['Rolling load'],
  自定义创建: ['Custom create'],
  '将动作或菜单折叠到下拉菜单中，支持单选和多选': [
    'Collapse the action or menu into the drop-down menu, support single and multiple selection',
  ],
  基础单选: ['Basic single choice'],
  'large、default、 small 三种尺寸，normal、simplicity两种风格': ['Large, default and small, normal and simple'],
  爬山: ['climbing'],
  跑步: ['running'],
  未知: ['unknown'],
  健身: ['fitness'],
  骑车: ['bike'],
  跳舞: ['dancing'],
  睡觉: ['sleep'],
  '运动-1': ['Exercise - 1'],
  '运动-2': ['Exercise - 2'],
  '运动-3': ['Exercise - 3'],
  请选择: ['Please select'],
  无数据: ['No data'],
  无匹配数据: ['No matching data'],
  '加载中...': ['Loading...'],
  请输入关键字: ['Please enter keywords'],
  支持tag形式的多选: ['Support multiple selection in tag form'],
  分组1: ['Group 1'],
  分组2: ['Group 2'],
  '远程搜索和本地搜索，注意：动态Options时建议使用value作为key，防止出现option没有销毁问题': [
    'Remote search and local search. Note: It is recommended to use value as the key in dynamic Options to prevent the option from being destroyed',
  ],
  自定义创建选项: ['Custom creation options'],
  多选模式下自定义tag: ['Custom tag in multi-selection mode'],
  虚拟滚动只支持list模式数据源: ['Virtual scrolling only supports list mode data sources'],
  测试数据: ['test data'],
  全部: ['All'],
  覆盖全面: ['Comprehensive coverage'],
  '从配置管理，到作业执行、任务调度和监控自愈，再通过运维大数据分析辅助运营决策，全方位覆盖业务运营的全周期保障管理。':
    [
      'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
    ],
  'child-2-方案成熟': ['Child-2 - mature scheme'],
  '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维': [
    'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
  ],
  'child-2-覆盖全面': ['Child-2 - comprehensive coverage'],
  'child-2-开放平台': ['Child-2 - open platform'],
  'child-3-方案成熟': ['Child-3-mature scheme'],
  'child-3-开放平台': ['Child-3-open platform'],
  'child-3-覆盖全面': ['Child-3 - comprehensive coverage'],
  '开放的PaaS，具备强大的开发框架和调度引擎，以及完整的运维开发培训体系，助力运维快速转型升级。': [
    'he open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
  ],
  开放平台: ['Open platform'],
};

const Input: LANG = {
  常用的输入框: ['Common input box'],
  基础输入框: ['Basic input box'],
  'hover 时才显示 clear 按钮': ['The clear button is only displayed when hover'],
  数字输入框: ['Digital input box'],
  '配置show-clear-only-hover为true时，清除按钮在hover时才会显示': [
    'When show-clear-only-hover is configured to be true, the clear button will only be displayed when hover',
  ],
  多行文本输入框: ['Multiline text input box'],
  带清空操作输入框: ['With emptying operation input box'],
  带Icon输入框: ['With Icon input box'],
  带状态输入框: ['With status input box'],
  密码框: ['Password box'],
  组合型输入框: ['Combined input box'],
  事件回调: ['Event callbacks'],
  'HTML 原生属性透传': ['HTML native attribute pass-through'],
  简约风格输入框: ['Simple style input box'],
  'Input 属性': ['Input Attributes'],
  'Input 插槽': ['Input slot'],
  'Input 事件': ['Input event'],
  更新modelValue值: ['Update modelValue value'],
  '使用 bk-input 标签配置输入框组件': ['Use the bk-input tag to configure the input box component'],
  '通过配置 type 属性为 number 来设置数字类型输入，通过设置 max，min 设置最大最小值, 设置 precision 保留小数位(初始值会被四舍五入，例如：numberInputValue=4.5，precision=0时，值会被四舍五入为5)。数字输入框时，clearable 配置不生效':
    [
      'Set the numeric type input by configuring the type attribute to number, set the maximum and minimum values by setting max and min, and set the precision to retain the decimal places (the initial value will be rounded, for example, when numberInputValue=4.5, precision=0, the value will be rounded to 5). Clearable configuration does not take effect when digital input box',
    ],
  '通过配置 type 属性为 textarea 来显示多行文本输入框': [
    'Display the multiline text input box by configuring the type attribute as textarea',
  ],
  '通过配置 clearable 属性为 true 来启用有文本时允许清空操作': [
    'Enable the clearing operation when there is text by configuring the clearable property to be true',
  ],
  '通过配置 slot=prefix, slot=suffix，来让组合输入框': [
    'Configure slot=prefix, slot=suffix to make the combined input box',
  ],
  '通过配置 slot=prefix, slot=suffix，来设置icon': ['Set the icon by configuring slot=prefix, slot=suffix'],
  '通过配置 disabled, readonly，来让输入框禁用、只读': [
    'Enable the input box to be disabled and read-only by configuring disabled and readonly',
  ],
  '通过配置 type 属性为 password 来设置密码框；通过配置 password-icon 属性来设置切换显示密码的 icon': [
    'Set the password box by configuring the type attribute as password; Set the icon to switch the display of password by configuring the password-icon Attributes',
  ],
  '支持 keyup enter keypress keydown change focus blur 回调事件': [
    'Support up and down keys to change focus blur callback events',
  ],
  '支持 HTML input 标签所有原生属性，设置 password 禁用自动填充功能': [
    'Support all native attributes of HTML input tag, set password to disable automatic filling function',
  ],
  通过属性behavior配置简约风格: ['Configure simple style through attribute behavior'],
  输入框类型: ['Input box type'],
  空白提示: ['Blank prompt'],
  '前缀字符，当配置prefix slot时失效': ['Prefix character, invalid when configuring prefix slot'],
  '后缀字符，当配置suffix slot时失效': ['Suffix character, invalid when suffix slot is configured'],
  '是否可清除。数字输入框时，此配置不生效': [
    'Whether it can be cleared. This configuration does not take effect when digital input box',
  ],
  最大输入长度: ['Maximum input length'],
  最小输入长度: ['Minimum input length input length'],
  '输入框尺寸，只在 type!="textarea" 时有效': ['Input box size, only in type= Valid when "textarea'],
  保留小数位: ['Keep decimal places'],
  '是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效': [
    'Whether to display the input word count is only valid when type="text" or type="textarea"',
  ],
  '简约风格设置(simplicity:简约 normal:正常 type=textarea时不生效)': [
    'Simple style setting (simple: simple normal: normal type=textarea does not take effect)',
  ],
  前置插槽: ['Front slot'],
  后置插槽: ['Rear slot'],
  获取焦点时触发事件: ['Trigger event when getting focus'],
  失去焦点时触发事件: ['Trigger event when losing focus'],
  值变更时触发事件: ['Trigger event when the value changes'],
  清空值时触发事件: ['Event triggered when emptying value'],
  输入时触发事件: ['Trigger event on input'],
  按下键盘时触发: ['Triggered when the keyboard is pressed'],
  按下键盘时触发事件: ['Event triggered when keyboard is pressed'],
  按下键盘按键松开时触发事件: ['Event triggered when keyboard key is released'],
  '获取焦点时，按下回车时触发事件': ['When getting the focus, press Enter to trigger the event'],
  粘贴内容时触发事件: ['Event triggered when pasting content'],
};

const Form: LANG = {
  表单模式: ['Form mode'],
  'label 描述': ['Label description'],
  顶部对齐: ['Align top'],
  表单验证: ['Form validate'],
  组合表单组件: ['Combined form components'],
  'Form 属性': ['Form Attributes'],
  'Form-Item 属性': ['Form-Item Attributes'],
  '由输入框、选择器、单选框、多选框等控件组成': [
    'It consists of input box, selector, radio box, multiple box and other controls',
  ],
  姓名: ['Name'],
  性别: ['Sex'],
  联系方式: ['Contact'],
  学历: ['Education'],
  介绍: ['Introduce'],
  男: ['Male'],
  女: ['Female'],
  本科以上: ['Bachelor degree or above'],
  本科以下: ['Below undergraduate'],
  请输入: ['Please enter'],
  提交: ['Submit'],
  'FormItem 组件配置 description': ['FormItem component configuration description'],
  不能为空: [' cannot be empty'],
  格式不正确: [' incorrect format'],
  '请输入并按 Enter 结束': ['Please enter and press Enter to end'],
  最大值: [' maximum'],
  最小值: [' minimum'],
  最大长度: [' maximum length'],
  日: ['Sun'],
  一: ['Mon'],
  二: ['Tue'],
  三: ['Wed'],
  四: ['Thu'],
  五: ['Fri'],
  六: ['Sat'],
  表单域标签的宽度: ['The width of the form field label'],
  表单域标签的位置: ['Location of form field labels'],
  表单数据: ['Form data'],
  表单验证规则: ['Form validate rules'],
  '表单域 model 字段': ['Form field model field'],
  标签: ['Tag'],
  是否必填: ['Required'],
  验证规则最大值: ['Maximum value of validation rule'],
  验证规则最小值: ['Validation rule minimum'],
  验证规则Email: ['Verification rule Email'],
  验证规则: ['Validation rules'],
  是否自动验证: ['Whether to automatically verify'],
  中文名: ['Chinese name'],
  常用联系方式: ['Common contact information'],
  姓名长度不能小于: ['Name length cannot be less than'],
  杭州: ['Hangzhou'],
  南京: ['Nanjing'],
  重庆: ['Chongqing'],
  台北: ['Taibei'],
  海口: ['Haikou'],
};

const Upload: LANG = {
  上传图片: ['Upload pictures'],
  通过点击或者拖拽上传文件: ['Upload files by clicking or dragging'],
  上传组件类型: ['Upload component type'],
  '只允许上传JPG、PNG、JPEG的文件': ['Only JPG, PNG and JPEG files can be uploaded'],
  '只允许上传JPG、PNG、JPEG、ZIP的文件': ['Only JPG, PNG, JPEG and ZIP files can be uploaded'],
  '配置 accept 属性，限制用户只允许上传 jpg、jpeg、png 格式的图片': [
    'Configure the accept attribute to restrict users to upload only images in jpg, jpeg, and png formats',
  ],
  '上传组件提供图片和文件上传的功能，由 accept 属性来定义允许上传的文件类型，默认为 *': [
    'The upload component provides the function of uploading pictures and files. The accept attribute defines the file types that can be uploaded. The default is*',
  ],
  将文件拖到此处或: ['Drag files here or '],
  点击上传: ['Click Upload'],
  '上传 zip 文件': ['Upload zip file'],
  只允许上传ZIP的文件: ['Only ZIP files can be uploaded'],
  '配置 accept 属性，限制用户只允许上传 zip 格式的文件': [
    'Configure the accept attribute to restrict users to only upload files in zip format',
  ],
  设置文件大小: ['Set file size'],
  '最大上传5(Mb)的文件': ['Upload up to 5 (Mb) files'],
  '配置 size 属性，限制上传文件的大小': ['Configure the size attribute to limit the size of uploaded files'],
  设置上传文件个数: ['Set the number of uploaded files'],
  最多上传2个文件: ['Upload up to 2 files'],
  '配置 limit 属性，设置上传文件个数': ['Configure the limit attribute and set the number of uploaded files'],
  点击按钮上传: ['Click the button to upload'],
  上传文件: ['Upload File'],
  上传成功: ['Upload succeeded'],
  上传失败: ['Upload failed'],
  '设置 theme 属性为 button': ['Set the theme Attributes to button'],
  照片墙: ['Photo wall'],
  '设置 theme 属性为 picture，限制文件类型为图片类型，比如：png，jpeg，jpg': [
    'Set the theme attribute to picture, and limit the file type to picture type, such as: png, jpeg, jpg',
  ],
  头像上传: ['Picture upload'],
  '设置 theme 属性为 picture，multiple 属性设置为 false，并限制文件类型为图片类型，比如：png，jpeg，jpg': [
    'Set the theme attribute to picture, the multiple attribute to false, and limit the file type to picture type, such as: png, jpeg, jpg',
  ],
  自定义文件列表项: ['Custom File List Item'],
  '使用 slot 自定义文件列表项': ['Use slot to customize file list items'],
  'Upload 属性': ['Upload Attributes'],
  '支持拖拽和点击(draggable)': ['Support drag and click'],
  '按钮(button)': ['Button'],
  '图片卡片(picture)': ['Picture card'],
  '可选的文件类型。theme为 picture 时且 accept 没有配置时，可接受文件文类型为："image/png,image/jpeg,image/jpg"': [
    'Optional file type. When the theme is picture and accept is not configured, the acceptable file type is: "image/png, image/jpeg, image/jpg',
  ],
  '服务器地址（必传）': ['Server address (required)'],
  '请求头 {\'{\'}\' name: \'\', value: \'\' {\'}\'}': ['Request header {\'{\'}\' name: \'\', value: \'\' {\'}\'}'],
  '处理返回码的函数，默认参数 response，需要返回 true 或 false': [
    'The function that handles the return code, the default parameter response, needs to return true or false',
  ],
  是否支持多选: ['Support multiple selection'],
  后台读取文件的: ['Read files in the background'],
  '限制上传文件体积 {\'{\'} maxFileSize: 1, maxImgSize: 1 {\'}\'}': ['Limit upload file size { maxFileSize: 1, maxImgSize: 1 }'],
  限制上传文件个数: ['Limit the number of uploaded files'],
  自定义上传属性: ['Custom upload attribute'],
  '是否允许带上 cookie': ['Allow cookies'],
  用来验证文件名是否合法的: ['Used to verify whether the file name is legal'],
  '覆盖默认的上传行为，自定义上传的实现': [
    'Override the default upload behavior and customize the upload implementation',
  ],
  默认图片: ['Default picture'],
  '上传文件之前的钩子，参数为上传的文件，若返回false或者返回 Promise 且被 reject，则停止上传': [
    'The hook before uploading the file. The parameter is the uploaded file. If false is returned or Promise is returned and rejected, the upload will be stopped',
  ],
  '删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除': [
    'The hook before the file is deleted. The parameter is the uploaded file and file list. If false is returned or Promise is returned and rejected, the deletion will be stopped',
  ],
  是否采用大文件分片上传: ['Whether to upload large files in pieces'],
  分片上传chunk服务器路径: ['Partitioning upload chunk server path'],
  分片上传合并chunk服务器路径: ['Partitioning upload merge chunk server path'],
  分片大小: ['Slice size'],
  'Upload 事件': ['Upload event'],
  所有文件上传完毕后的事件: ['Events after all files are uploaded'],
  文件上传进行时的事件: ['Events during file upload'],
  文件上传成功后的事件: ['Events after successful file upload'],
  文件上传失败后的事件: ['Events after file upload failure'],
  文件上传个数超出限制后的事件: ['Events after the number of files uploaded exceeds the limit'],
  '文件上传成功后，点击删除文件触发的事件': [
    'After the file is uploaded successfully, click the event triggered by deleting the file',
  ],
  'Upload 插槽': ['Upload slot'],
  自定义默认内容: ['Customize default content'],
  触发文件选择框的内容: ['Trigger the contents of the file selection box'],
  提示说明文字: ['Prompt text'],
  文件列表项内容: ['File list item content'],
};

const TagInput: LANG = {
  'TagInput 标签输入框': ['TagInput'],
  '常用于对标签列表的填写、关键字的输入': ['It is often used to fill in the label list and enter keywords'],
  请选择城市: ['Please select a city'],
  '请输入“州”来体验下搜索效果': ['Ease enter "State" to experience the search effect'],
  '通过 bk-tag-input 来使用组件，其中 list 属性为下拉选择列表选项': [
    'Use components through bk-tag-input, where the list attribute is a drop-down selection list option',
  ],
  触发方式: ['Trigger mode'],
  '配置 trigger': ['Configure trigger'],
  默认: ['Default'],
  'hover 显示': ['Hover display'],
  '配置 trigger 来设置下拉框的显示方式，有 focus（获焦点时显示）, search（搜索时显示）两种': [
    'Configure trigger to set the display mode of drop-down box, including focus (display when getting focus) and search (display when searching)',
  ],
  '设置 show-clear-only-hover 为 true，则其 clear 按钮在 hover 时才会显示': [
    'Set show-clear-only-hover to true, and its clear button will be displayed when hover',
  ],
  '设置 allow-create 属性来输入自定义标签，按 Enter 键结束；设置 has-delete-icon 属性可显示标签删除按钮': [
    'Set the allow-create attribute to enter the custom label, and press Enter to end; Set the has-delete-icon attribute to display label deletion',
  ],
  '设置 allow-auto-match 属性当输入内容时失去焦点后，如果完全匹配则自动选中，如果设置 allow-create 属性则创建标签': [
    'Set the allow-auto-match attribute. When the focus is lost when entering content, it will be automatically selected if it matches completely. If the allow-create attribute is set, a label will be created',
  ],
  '设置 save-key 属性定义选项的保存 key 值；设置 display-key 属性定义选项展示名称；search-key 属性定义多字段索引；tpl 属性可自定义下拉列表展示':
    [
      'Set the save key value of the save-key attribute definition option; Set the display-key attribute to define the option display name; The search-key attribute defines the multi-field index; Tpl attribute can be displayed in the user-defined drop-down list',
    ],
  '设置列表数据源 disabled 属性来禁用列表中的某些项，禁止用户选择': [
    'Set the disabled attribute of the list data source to disable some items in the list and prevent users from selecting',
  ],
  '配置 tooltip-key 定义选中标签 hover 时的显示文案': [
    'Set the selected label configuration tooltip-key to define the display text when the label hover is selected',
  ],
  设置选中标签: ['Set selected label'],
  '设置 disabled 属性来禁用组件': ['Set the disabled Attributes to disable the component'],
  '设置选中标签 tooltips': ['Set the selected label tooltips'],
  '设置 tpl 方法自定义下拉列表展示；设置 tagTpl 方法自定义标签展示，通过 max-data 属性限制最大可选数量': [
    'Set tpl method custom drop-down list display; Set the tagTpl method to customize the label display, and limit the maximum number of options through the max-data attribute',
  ],
  '设置 filter-callback 定义过滤方法；设置 create-tag-validator 定义创建标签校验方法': [
    'Set filter-callback to define the filtering method; Set create-tag-validator definition to create label verification method',
  ],
  '配置 use-group 来启用分组功能， 数据源必须加上 children 的配置': [
    'Configure use-group to enable grouping. The data source must be configured with children',
  ],
  '粘贴内容默认按“;”来分割内容，设置 paste-fn 方法可以自定义粘贴输出内容': [
    'Paste content is divided by ";" by default. Set the paste-fn method to customize the paste output content',
  ],
  列表项禁用: ['List item disabled'],
  组件禁用状态: ['Component Disable Status'],
  更多自定义配置: ['More custom configurations'],
  失去焦点自动匹配: ['Automatic matching without focus'],
  分组展示: ['Group presentation'],
  批量输入: ['Batch input'],
  简: ['Jane'],
  杰克: ['Jack'],
  阿尔曼: ['Aerman'],
  杰森: ['Jason'],
  华中地区: ['Central China'],
  华南地区: ['South China'],
  华北地区: ['North China'],
  河南省: ['Henan Province'],
  河北省: ['Hebei Province'],
  广东省: ['Guangdong Province'],
  湖南省: ['Hunan Province'],
  湖北省: ['Hubei Province'],
  海南省: ['Hainan Province'],
  北京市: ['Beijing'],
  天津市: ['Tianjin'],
  直辖市: ['municipality directly under the Central Government'],
  省会郑州: ['Zhengzhou, the provincial capital'],
  省会武汉: ['Wuhan, the provincial capital'],
  省会长沙: ['Changsha, the provincial capital'],
  省会广州: ['Guangzhou, the provincial capital'],
  省会海口: ['Haikou, the provincial capital'],
  省会石家庄: ['Shijiazhuang, the provincial capital'],
  '综合例子(单选)': ['Comprehensive examples (single choice)'],
  '综合例子(多选)': ['Comprehensive examples (multiple choice)'],
  '通过 username 或 sex 搜索列表': ['Search the list through username or sex'],
  '请输入 username 或 nickname': ['Please enter username or nickname'],
  '请输入 J 或 杰 来体验下搜索效果': ['Please enter J or Jerry to experience the search effect'],
  '该例子自定义 filter-callback 通过 username 或 sex 搜索列表，定义 create-tag-validator 只允许创建以 A 开头的标签': [
    'This example defines the user-defined filter-callback to search the list through username or sex, and defines the create-tag-validator to only allow the creation of tags beginning with A',
  ],
  '复制内容 guangzhou|chongqing|beijing 来体验粘贴多输入效果': [
    'Copy content to experience the effect of pasting multiple inputs',
  ],
  下拉菜单所需的数据列表: ['List of data required by the drop-down menu'],
  空数据时显示的提示文案: ['Prompt text displayed when empty data'],
  是否禁用组件: ['Whether to disable components'],
  '多选时，是否允许选中后继续展示下拉选项': [
    'When multiple selections are selected, whether to continue to display the drop-down options after selection',
  ],
  '循环 list 时，保存字段的 key 值': ['When cycling the list, save the key value of the field'],
  '循环 list 时，展示字段的 key 值': ['When cycling the list, display the key value of the field'],
  '输入时，搜索的 key 值': ['The key value searched during input'],
  让选中的标签在鼠标移上去时显示提示文案: [
    'The selected label will display the prompt text when the mouse is moved up',
  ],
  是否启用分组: ['Enable grouping'],
  是否显示标签删除按钮: ['Show label delete button'],
  是否允许清空: ['Allow emptying'],
  是否允许自定义标签输入: ['Allow custom label input'],
  '是否限制可选个数，-1为不限制': ['Whether to limit the number of options, - 1 is unlimited'],
  '下拉列表搜索结果显示个数，默认为 10': ['The number of search results displayed in the pull list is 10 by default'],
  '配置输入时失焦点后，如果完全匹配则自动选中，如果自定义则自动输入': [
    'After losing focus during configuration input, it will be automatically selected if it is completely matched, and automatically entered if it is customized',
  ],
  '自定义设置下拉弹框的宽度，单选会撑满因此失效': [
    'Customize the width of the drop-down pop-up box. Single selection will be full and invalid',
  ],
  自定义设置下拉弹框的长度: ['Customize the length of the drop-down box'],
  '输入分隔符号，支持批量输入': ['Input separator, support batch input'],
  自定义下拉列表模板: ['Customize drop-down list template'],
  自定义标签模板: ['Custom label template'],
  批量粘贴处理文本返回格式: ['Batch paste processing text return format'],
  文字与左边框距离: ['Distance between text and left border'],
  '搜索列表触发展示方式，默认是输入关键字搜索时展示，也可以获取焦点是展示（用在数据量少的时候）': [
    'The search list triggers the display method. The default is to display when you enter keywords to search. You can also get the focus of display (used when the data volume is small)',
  ],
  '自定义标签校验函数，返回 boolean，参数(tag)，tag表示当前输入值，在自定义标签时，可以自定义添加标签的校验': [
    'User-defined label verification function, return boolean, parameter (tag), tag represents the current input value. When customizing the label, you can customize the label verification',
  ],
  '过滤函数，参数 (filterVal, filterKey, data)，分别表示当前过滤的文本、当前数据使用的 key、所有数据，方便使用者根据自己的逻辑来筛选数据':
    [
      'Filter function, parameters (filterVal, filterKey, data), respectively represent the currently filtered text, the key used by the current data, and all data, which is convenient for users to filter data according to their own logic',
    ],
  '是否在只有 hover 的时候才显示 clear 清除按钮': ['Whether to display the clear button only when hover'],
  '失焦是否折叠 tags': ['Whether the tags are folded out of focus'],
  '定义 tag 超出内容的 v-bk-tooltips 配置': ['Define v-bk-tooltips configuration for tag exceeding content'],
};

const Cascader: LANG = {
  'Cascader 级联组件': ['Cascader'],
  'Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面': [
    'The breadcrumb component displays the path of the current page and quickly returns to any previous page',
  ],
  基础数据展示: ['Basic data display'],
  '通过trigger设置`click`或`hover`实现下一级的触发方式; 设置`filterable`属性可以进行搜索。': [
    'Set \'click\' or \'hover\' to trigger the next level; Set the \'filterable\' Attributes to search.',
  ],
  '设置`check-any-level`为true，可以将非叶子节点作为可选级': [
    'Set \'check any level\' to true, and non-leaf nodes can be used as optional levels',
  ],
  '开启 multiple 属性进行多选，注意此时 v-model 对应的值应是二维数组': [
    'Turn on the multiple attribute for multiple selection. Note that the corresponding value of v-model should be a two-dimensional array',
  ],
  通过插槽对节点内容实现个性化需求: ['Personalize node content through slots'],
  '可以通过`scoped slot`对级联选择器的备选项的节点内容进行自定义，scoped slot传入node表示当前节点的 Node 的数据,data代表原数据':
    [
      'You can customize the node content of alternative options of cascade selector through \'scoped slot\'. The scoped slot passes in the node to represent the data of the node of the current node, and the data represents the original data',
    ],
  '通过设置`separator`属性实现自定义分隔': ['Set the \'separator\' attribute to realize custom separation'],
  远程加载: ['Set \'separator\' attribute to realize custom separation'],
  任意级可选: ['Optional at any level'],
  通过配置实现任意级可选: ['Optional at any level through configuration'],
  通过multiple开启多选: ['Enable multiple selection through multiple'],
  列表别名设置: ['List alias settings'],
  是否开启搜索: ['Enable search'],
  '当前被选中的值,多选时配置一个二维数组': [
    'For the currently selected value, configure a two-dimensional array when selecting multiple values',
  ],
  'id-key name-key适配': ['id-key name-key adaptation'],
  '列表id指定的key值，默认为id,若需要改为其他key值，在这里传入即可,列表name指定的key值，默认为name,若需要改为其他key值，在这里传入即可':
    [
      'The key value specified by the list id is id by default. If it needs to be changed to another key value, it can be passed in here. The key value specified by the list name is name by default. If it needs to be changed to another key value, it can be passed in here',
    ],
  仅显示最后一级: ['Show only the last level'],
  'Cascader 属性': ['Cascader Attributes'],
  'Cascader 事件': ['Cascader event'],
  '可在输入框仅显示最后一级的标签，而非完整路径': [
    'Only the label of the last level can be displayed in the input box, not the full path',
  ],
  '设置`show-complete-name`属性为`false`，则可以使输入框仅显示最后一级，默认显示完整路径': [
    'Set the \'show complete name\' attribute to \'false\', then the input box can only display the last level, and the full path is displayed by default',
  ],
  是否多选: ['Whether to select multiple'],
  可选项数据源: ['Optional data source'],
  '远程加载list，异步加载': ['Remote load list, asynchronous load'],
  '列表id指定的key值，默认为id,若需要改为其他key值，在这里传入即可': [
    'The key value specified by the list id is id by default. If you need to change it to another key value, just pass it in here',
  ],
  '列表name指定的key值，默认为name,若需要改为其他key值，在这里传入即可': [
    'The key value specified in the list name is name by default. If you need to change it to another key value, just pass it in here',
  ],
  '列表children子节点了列表指定的key值，默认为children,若需要改为其他key值，在这里传入即可': [
    'The children sub-node of the list has the key value specified in the list. The default value is children. If you need to change it to another key value, you can pass it in here',
  ],
  '可以通过`is-remote`开启动态加载，并通过`remote-method`来设置加载数据源的方法。注意远程拉取数据格式需要遵循list的要求':
    [
      'Dynamic loading can be enabled through \'is remote\', and the method of loading data sources can be set through \'remote method\'. Note that the format of remote pull data should follow the requirements of list',
    ],
  是否允许选择任意一级: ['Allow to select any level'],
  输入框中是否显示选中值的完整路径: ['Whether the full path of the selected value is displayed in the input box'],
  未选择数据时的占位: ['Placeholder when no data is selected'],
  选项分隔符: ['Option separator'],
  下拉列表滚动高度: ['Scroll height of drop-down list'],
  子版面的宽度: ['Width of sub-layout'],
  '内容改变时触发，回调为当前所选内容': [
    'Triggered when the content changes, and the callback is the current selected content',
  ],
  '切换下拉折叠状态时调用, 回调参数为当前是否展开': [
    'Called when switching the pull-down folding state. The callback parameter is whether to expand currently',
  ],
  '清空选项时调用, 回调参数为请空前的内容': [
    'Called when the option is cleared. The callback parameter is unprecedented',
  ],
  湖南: ['Hunan'],
  长沙: ['Changsha'],
  岳阳: ['Yueyang'],
  广西: ['Guangxi'],
  云南: ['Yunnan'],
  昆明: ['Kunming'],
  大理: ['Dali'],
  玉溪: ['Yuxi'],
  官渡区: ['Guandu District'],
  西山区: ['Xishan District'],
  长文字测试五华山五华山五华山: ['Long text test Wuhuashan Wuhuashan Wuhuashan'],
  目录: ['Catalogue'],
  根目录: ['Root directory'],
};

const SearchSelect: LANG = {
  'Search Select组件， 为页面和模块提供方便的搜索选择功能': ['Search Select component, which provides convenient search and selection functions for pages and modules'],
  基础使用: ['Basic use'],
  远程加载子列表: ['Remote load sublist'],
  data数据字段配置: ['Data data field configuration'],
  '通过配置属性 geMenuList 方法 来做到异步获取menu列表 同时配合 data 内子项 async 属性来配置针对不同的选择项是否需要远程获取子列表': ['Configure the Attributes geMenuList method to obtain the menu list asynchronously, and configure whether to obtain the sub-list remotely for different selection items with the data sub-item async Attributes'],
  校验输入的选择项: ['Check input options'],
  '通过配置属性 validateValues 方法 来做到对选择的子项进行校验 validateValues 返回校验失败文案 返回true则代表校验成功': ['Validate the selected sub-items by configuring the Attributes validateValues method. If validateValues returns verification failure, the text returns true, which means the verification is successful'],
  '同时配合子项配置 noValidate 来做到不同的选择项是否触发校验': ['At the same time, configure noValidate with sub-items to ensure whether different options trigger verification'],
  配置每个选项独立的placeholder: ['Configure an independent placeholder for each option'],
  '配置 menu 插槽来自定义 menu 面板': ['Configure the menu slot to customize the menu panel'],
  '配置 valueBehevior 属性定义生成 value 交互行为': ['Configure the valueBehavior attribute definition to generate value interaction behavior'],
  '改变配置 valueBehevior 值为 need-key 来做到存文本不可生成 value tag': ['Change the configuration valueBehavior value to need-key to ensure that no value tag can be generated when saving text'],
  '通过配置子选项属性 placeholder 来做到针对每一个选项都有独自的placeholder': ['Configure the sub-option Attributes placeholder to ensure that each option has its own placeholder'],
  menu面板子项插槽: ['Menu panel subitem slot'],
  'menu 插槽': ['Menu slot'],
  'valueBehevior 行为': ['ValueBehavior'],
  搜索选择数据: ['Search selection data'],
  已选择的数据项: ['Selected data items'],
  最大高度: ['Maximum height'],
  条件选择列表: ['Condition selection list'],
  是否可以清空: ['Can be cleared'],
  自定义动态获取选择项列表方法: ['User-defined dynamic verification selection or input value. If the text of verification failure is returned, it means verification failure'],
  '自定义动态验证选择或者输入值 如果返回 校验失败的文本则代表校验失败': ['User-defined dynamic verification selection or input value. If the text of verification failure is returned, it means verification failure'],
  多选的值的链接符号: ['Link symbol for multiple selected values'],
  是否过滤掉已选择项: ['Filter out selected items'],
  '配置纯文本是否可以生成value (all: 可以，need-key: 需要key值)': ['Configure whether plain text can generate value (all: yes, need-key: key value is required)'],
  '搜索选择数据选项唯一key值（必须是全局唯一）': ['Unique key value of search selection data option (must be globally unique)'],
  或: ['Or'],
  且: ['And'],
  placeholder: ['placeholder'],
  '[{\'{\'} id: \'or\', name: \'或\' {\'}\'}, {\'{\'} id: \'and\', name: \'且\' {\'}\'}]': ['[{\'{\'} id: or, name: or {\'}\'}, {\'{\'} id: and, name: and {\'}\'}]'],
  展示字段: ['Display field'],
  子列表: ['Sublist'],
  '是否可多选 默认不可多选': ['Whether to select multiple by default'],
  '是否远程获取子列表 需配合组件属性 getMenuList使用 (默认是true)': ['Whether to obtain the sub-list remotely needs to be used with the component Attributes getMenuList (the default is true)'],
  '是否校验 需配合组件属性 validateValues使用': ['Whether the verification needs to be used with the component Attributes validateValues'],
  组件最左侧填充插槽: ['The leftmost populated slot of the component'],
  组件最右侧填充插槽: ['The rightmost populated slot of the component'],
  实例状态: ['Instance status'],
  实例业务: ['Instance business'],
  IP地址: ['IP address'],
  刺激战场: ['Stimulate the battlefield'],
  绝地求生: ['Survival of the Jedi'],
  redis创建中: ['Redis is being created'],
  运行中: ['Running'],
  已关机: ['Shutdown'],
  创建中: ['Creating'],
  '请选择/请输入': ['Please select/enter'],
  '改变配置 valueBehevior 值为 need-key  来做到存文本不可生成 value tag': ['Change the configuration valueBehavior value to need-key to ensure that no value tag can be generated when saving text'],
  输入格式为XXX: ['Input format is XXX'],
  实例名: ['Instance name'],
  实例地址: ['Instance address'],
  测试六: ['Test VI'],
  必须项: ['Required'],
};

export default {
  ...Radio,
  ...CheckBox,
  ...Switcher,
  ...Select,
  ...Input,
  ...Form,
  ...Upload,
  ...TagInput,
  ...Cascader,
  ...SearchSelect,
};
