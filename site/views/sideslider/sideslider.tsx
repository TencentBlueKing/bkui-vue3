/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
import { defineComponent, ref } from 'vue';

import Button from '@bkui-vue/button';
import Sideslider from '@bkui-vue/sideslider';
export default defineComponent({
  name: 'Sideslider',
  setup() {
    const isShow = ref(false);
    const handleOpenSlider = () => {
      isShow.value = !isShow.value;
    };
    // const sleep = ms => new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(true);
    //   }, ms);
    // });
    const handleCloseBefore = async () => {
      console.log('关闭前触发');
      // await sleep(3000);
      return true;
    };
    const handleHidden = () => {
      console.log('关闭后触发');
    };
    const handleShown = () => {
      console.log('显示后触发');
    };
    const handleAnimationEnd = () => {
      console.log('动画结束后触发');
    };
    function handleChange() {
      console.log(123);
    }
    return {
      handleOpenSlider,
      handleCloseBefore,
      handleHidden,
      handleShown,
      handleAnimationEnd,
      handleChange,
      isShow,
    };
  },
  render() {
    const sideSliderSlot = {
      default: () => <div style='height: 1200px;width: 80px;'>我是内容</div>,
      footer: () => <div>我是尾部asjdjas</div>,
    };
    return (
      <div>
        <Button
          theme='primary'
          onClick={this.handleOpenSlider}
        >
          测试
        </Button>
        <Sideslider
          width='500'
          extCls='custom-sideslider'
          v-model={[this.isShow, 'isShow']}
          beforeClose={this.handleCloseBefore}
          direction='right'
          quickClose={true}
          scrollable={true}
          showMask={true}
          title='我是自定义标题'
          transfer={true}
          onAnimationEnd={this.handleAnimationEnd}
          // @ts-ignore
          onChange={this.handleChange}
          onHidden={this.handleHidden}
          onShown={this.handleShown}
        >
          {sideSliderSlot}
        </Sideslider>
      </div>
    );
  },
});
