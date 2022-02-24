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

import { defineComponent, reactive, ref, PropType, onBeforeUnmount } from 'vue';
import { CollapseLeft } from '@bkui-vue/icon';
import NavigationTitle from './navigation-title';
export type BkNavigationType = 'top-bottom' | 'left-right';
const NavigationProps = {
  navWidth: {
    type: [Number, String],
    default: 60,
  },
  hoverWidth: {
    type: [Number, String],
    default: 260,
  },
  sideTitle: {
    type: String,
    default: '',
  },
  headerTitle: {
    type: String,
    default: '',
  },
  hoverLeaveDelay: {
    type: Number,
    default: 0,
  },
  hoverEnterDelay: {
    type: Number,
    default: 100,
  },
  defaultOpen: Boolean,
  headHeight: {
    type: [Number, String],
    default: 52,
  },
  navigationType: {
    type: String as PropType<BkNavigationType>,
    default: 'left-right',
    validator(v: BkNavigationType) {
      return ['top-bottom', 'left-right'].includes(v);
    },
  },
  needMenu: {
    type: Boolean,
    default: true,
  },
};
export default defineComponent({
  name: 'Navigation',
  props: NavigationProps,
  emits: ['leave', 'toggle', 'hover', 'toggle-click'],
  slots: ['header', 'menu', 'footer', 'side-icon', 'side-header'],
  setup(props, { emit }) {
    const defaultHeaderTitle = ref(props.headerTitle);
    const nav = reactive({
      click: false,
      hover: false,
      delay: false,
      timer: null,
      enterTimer: null,
    });

    if (props.defaultOpen) {
      nav.click = !nav.click;
      nav.hover = nav.click;
      emit('toggle', nav.hover);
    }

    onBeforeUnmount(() => {
      nav.timer && window.clearTimeout(nav.timer);
    });

    const handleMouseOver =  () => {
      if (!nav.click) {
        nav.enterTimer = setTimeout(() => {
          nav.hover = true;
          nav.enterTimer && window.clearTimeout(nav.enterTimer);
          nav.timer && window.clearTimeout(nav.timer);
          emit('hover', nav.hover);
          emit('toggle', nav.hover);
        }, props.hoverEnterDelay);
      }
    };
    const handleMouseLeave = () => {
      if (!nav.click) {
        nav.enterTimer && window.clearTimeout(nav.enterTimer);
        nav.timer = setTimeout(() => {
          nav.hover = false;
          window.clearTimeout(nav.timer);
          emit('leave', nav.hover);
          emit('toggle', nav.hover);
        }, props.hoverLeaveDelay);
      }
    };
    const handleClick = () => {
      nav.click = !nav.click;
      nav.hover = nav.click;
      emit('toggle', nav.hover);
      emit('toggle-click', nav.hover);
    };
    return {
      defaultHeaderTitle,
      nav,
      onBeforeUnmount,
      handleMouseOver,
      handleMouseLeave,
      handleClick,
    };
  },
  render() {
    return <div class="bk-navigation">
      {
        this.navigationType === 'top-bottom' && <div
            class="bk-navigation-header"
            style={{ flexBasis: `${this.headHeight}px` }}>
            <NavigationTitle sideTitle={this.sideTitle}>
              {
                {
                  default: this.$slots['side-header'],
                  'side-icon': !this.$slots['side-header'] ? this.$slots['side-icon'] : undefined,
                }
              }
            </NavigationTitle>
            <div class="header-right">
              {
                this.$slots.header?.()
              }
            </div>
        </div>
      }
      <div class="bk-navigation-wrapper">
        {
          this.needMenu &&  <div class="navigation-nav"
                      style={{ width: !this.nav.click ? `${this.navWidth}px` : `${this.hoverWidth}px` }}>
                      <div class="nav-slider"
                      onMouseenter={this.handleMouseOver}
                      onMouseleave={this.handleMouseLeave}
                      style={{
                        width: !this.nav.hover ? `${this.navWidth}px` : `${this.hoverWidth}px`,
                        borderRight: this.navigationType !== 'top-bottom' ? 'none' : '1px solid #DCDEE5',
                      }}>
                      {
                        this.navigationType !== 'top-bottom' && <NavigationTitle
                        style={{ flexBasis: `${this.headHeight}px` }}
                        sideTitle={this.sideTitle}>
                          {
                            {
                              default: this.$slots['side-header'],
                              'side-icon': !this.$slots['side-header'] ? this.$slots['side-icon'] : undefined,
                            }
                          }
                        </NavigationTitle>
                      }
                      <div class="nav-slider-list"
                        style={{ height: `calc(100vh - ${+this.headHeight + 56}px)` }}>
                        {
                          this.$slots.menu?.()
                        }
                      </div>
                      <div class="nav-slider-footer">
                        <div class={{ 'is-left': this.navigationType !== 'top-bottom', 'footer-icon': true }}
                            onClick={this.handleClick}>
                              <CollapseLeft class="footer-icon-svg" style={{ transform: this.nav.click ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
                        </div>
                    </div>
                </div>
          </div>
        }
        <div class="navigation-container" style={{ maxWidth: this.needMenu ? 'calc(100vw - 60px)' : '100vw' }}>
          {
            this.navigationType !== 'top-bottom' && <div class="container-header" style={{ flexBasis: `${this.headHeight}px` }}>
              {
                this.$slots.header?.() || [
                  <div class="container-header-title">{this.headerTitle}</div>,
                  <div class="container-header-sets">
                    {
                      this.$slots['header-set']?.()
                    }
                  </div>,
                ]
              }
          </div>
          }
          <div class="container-content" style={{ maxHeight: `calc(100vh - ${this.headHeight}px)` }}>
              {
                this.$slots.default?.()
              }
              <div class="container-footer">
                {
                  this.$slots.footer?.()
                }
              </div>
          </div>
        </div>
      </div>
    </div>;
  },
});
