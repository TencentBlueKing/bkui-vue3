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
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineComponent, nextTick, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { clickoutside } from '@bkui-vue/directives';
import BkInput from '@bkui-vue/input';
import BKPopover from '@bkui-vue/popover';
import { OnFirstUpdateFnType } from '@bkui-vue/shared';

import { NavGroupMeta } from '../typings';

import './demo-nav.less';

// function useFocus() {
//   const isFocus = ref(false);
//   const handleFocus = () => {
//     isFocus.value = true;
//   };
//   const handleBlur = () => {
//     isFocus.value = false;
//   };
//   return {
//     isFocus,
//     handleFocus,
//     handleBlur,
//   };
// }

function navListScrollToView() {
  const navListRef = ref(null);
  return {
    navListRef,
    scroll: () => {
      const curActiveMenu = document.querySelector('.nav-item.item-active');
      if (curActiveMenu) {
        // 171 是距离顶部的距离，85 是留出多余的高度，不给 85 的话，会显得太顶到顶部了
        navListRef.value.scrollTop = (curActiveMenu as any).offsetTop - 171 - 85;
      }
    },
  };
}

export default defineComponent({
  name: 'DemoNav',
  directives: {
    clickoutside,
  },
  setup() {
    const state = reactive({
      searchVal: '',
      selectIndex: 0,
      isPopoverShow: false,
      contentMaxHeight: 300,
      allList: [],
      renderList: [],
    });

    const { push, options: { routes } } = useRouter();
    const curRoute = useRoute();

    const { navListRef, scroll } = navListScrollToView();

    watch(
      () => curRoute.name,
      (_to, from) => {
        // 刷新页面
        if (!from) {
          nextTick(() => {
            // const curActiveMenu = document.querySelector('.nav-item.item-active');
            // if (curActiveMenu) {
            //   // 171 是距离顶部的距离，85 是留出多余的高度，不给 85 的话，会显得太顶到顶部了
            //   navListRef.value.scrollTop = (curActiveMenu as any).offsetTop - 171 - 85;
            // }
            scroll();
          });
        }
      },
    );

    const getNavGroup = (group: NavGroupMeta) => {
      const list = routes.filter(item => item.meta?.group === group);
      const handleRoute = (routeName) => {
        push({ name: routeName });
      };
      return (
        <div class="nav-group">
          <div class="nav-group-title">{group}</div>
          <ul class="nav-group-list">
            {
              list.map(item => (
                <li
                  class={`nav-item ${item.name === curRoute.name ? 'item-active' : ''}`}
                  onClick={() => handleRoute(item.name)}>
                    {item.meta?.navName || item.name}
                </li>
              ))
            }
          </ul>
        </div>
      );
    };

    const list = routes.filter(item => item.meta).map(item => ({ id: item.name, name: item.meta.navName }));
    state.allList = [...list];
    state.renderList = [...list];

    // const { handleBlur } = useFocus();
    const hidePopover = () => {
      state.isPopoverShow = false;
      // handleBlur();
    };

    const searchListContainerRef = ref(null);

    const doSearch = () => {
      setTimeout(() => {
        searchListContainerRef.value.scrollTop = 0;
      });
      const query = (state.searchVal.trim() || '').toLowerCase();
      if (query) {
        state.renderList = [...state.allList.filter(item => item.name.toLowerCase().indexOf(query) > -1)];
      } else {
        state.renderList = [...state.allList];
      }
      state.isPopoverShow = !!query;
    };

    const searchHandler = () => {
      state.selectIndex = 0;
      doSearch();
    };

    /**
     * 点击左侧导航或者搜索时切换 router
     *
     * @param {Object} component 组件信息对象
     * @param {boolean} fromSearch 是否来自搜索
     */
    const changeRouter = (component, fromSearch) => {
      push({
        name: component.id,
      }).then(() => {
        if (fromSearch) {
          // const curActiveMenu = document.querySelector('.nav-item.item-active');
          // if (curActiveMenu) {
          //   // curActiveMenu.scrollIntoView({ block: 'center' });
          //   // 171 是距离顶部的距离，85 是留出多余的高度，不给 85 的话，会显得太顶到顶部了
          //   navListRef.value.scrollTop = (curActiveMenu as any).offsetTop - 171 - 85;
          // }
          scroll();
        }
      });

      state.searchVal = '';
      hidePopover();
    };

    const keyupHandler = (_val, e) => {
      const { keyCode } = e;
      const { length } = state.renderList;
      switch (keyCode) {
        // 上
        case 38:
          e.preventDefault();
          if (state.selectIndex === -1 || state.selectIndex === 0) {
            state.selectIndex = length - 1;
            searchListContainerRef.value.scrollTop = searchListContainerRef.value.scrollHeight;
          } else {
            state.selectIndex = state.selectIndex - 1;
            nextTick(() => {
              const curSelectNode = searchListContainerRef.value.querySelector('li.cur');
              const { offsetTop } = curSelectNode;
              if (offsetTop < searchListContainerRef.value.scrollTop) {
                searchListContainerRef.value.scrollTop -= 32;
              }
            });
          }
          break;
        // 下
        case 40:
          e.preventDefault();
          if (state.selectIndex < length - 1) {
            state.selectIndex = state.selectIndex + 1;
            nextTick(() => {
              const curSelectNode = searchListContainerRef.value.querySelector('li.cur');
              const { offsetTop } = curSelectNode;
              // searchListContainerRef.value 上下各有 6px 的 padding
              if (offsetTop > state.contentMaxHeight - 2 * 6) {
                // 每一个 item 是 32px height
                searchListContainerRef.value.scrollTop += 32;
              }
            });
          } else {
            state.selectIndex = 0;
            searchListContainerRef.value.scrollTop = 0;
          }
          break;
        case 13:
          e.preventDefault();
          if (state.renderList[state.selectIndex]) {
            changeRouter(state.renderList[state.selectIndex], true);
          }
          break;
        default:
          break;
      }
    };

    const popperWidth = ref<string | number>(220);
    // 初始化PopoverWidth
    const onPopoverFirstUpdate: OnFirstUpdateFnType = (instance) => {
      const { reference } = instance.elements;
      popperWidth.value = (reference as HTMLElement).offsetWidth;
    };

    const handleChooseCom = (e) => {
      const item = state.renderList[state.selectIndex];
      if (!item) return;

      changeRouter(item, true);
    };

    return {
      ...toRefs(state),
      getNavGroup,
      searchHandler,
      keyupHandler,
      popperWidth,
      hidePopover,
      changeRouter,
      onPopoverFirstUpdate,
      searchListContainerRef,
      navListRef,
      handleChooseCom,
    };
  },
  render() {
    const { t }  = useI18n();
    return <div class="demo-nav">
      <h1 class="demo-nav-title">{t('Vue 组件库') } <span class="title-mark">3.x</span></h1>
      {/* <BkInput class="demo-nav-input" type="search" onInput={this.searchHandler} v-model={this.searchVal}/> */}
      <div class="demo-nav-search-wrapper" v-clickoutside={this.hidePopover}>
        <BKPopover
          theme="light"
          trigger="manual"
          width={this.popperWidth}
          arrow={false}
          placement="bottom-start"
          offset={2}
          isShow={this.isPopoverShow}
          disableTeleport
        >
          {{
            default: () => (
              <div class="demo-nav-popover">
                <BkInput class="demo-nav-input" type="search" clearable={true} v-model={this.searchVal}
                onInput={this.searchHandler}
                onClear={this.hidePopover}
                onKeydown={this.keyupHandler}
                onEnter={this.handleChooseCom} />
              </div>
            ),
            content: () => (
              <div class="search-dropdown-list">
                <ul ref="searchListContainerRef" style={{ maxHeight: `${this.contentMaxHeight}px` }} class="outside-ul">
                  {
                    this.renderList.length
                      ? this.renderList.map((item, index) => (
                        <li class={[
                          'search-dropdown-list-item',
                          this.selectIndex === index ? 'cur' : '',
                        ]} onClick={() => this.changeRouter(item, true)}>
                          <span class="text" v-html={
                            item.name.replace(new RegExp(`(${this.searchVal})`, 'i'), '<em>$1</em>')
                          }></span>
                        </li>
                      ))
                      : (
                        <li class="search-dropdown-list-item">
                          <span class="text">{ t('没有找到组件') }</span>
                        </li>
                      )
                  }
                </ul>
              </div>
            ),
          }}
        </BKPopover>
      </div>

      <div class="demo-nav-list" ref="navListRef">
        {
          Object.values(NavGroupMeta).map(group => this.getNavGroup(group))
        }
      </div>
    </div>;
  },
});
