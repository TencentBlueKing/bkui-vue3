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
import { throttle } from 'lodash';
import { computed, CSSProperties, defineComponent, effectScope, ref, shallowRef, Teleport, Transition } from 'vue';

import { bkTooltips } from '@bkui-vue/directives';
import { AngleLeft, AngleRight, Close } from '@bkui-vue/icon';
import { bkZIndexManager } from '@bkui-vue/shared';

import { propsImageViever as props } from './props';

export type ViewerAction =
  | 'zoomIn'
  | 'zoomOut'
  | 'clockwise'
  | 'anticlockwise';

export default defineComponent({
  name: 'ImageViewer',
  directives: {
    bkTooltips,
  },
  props,
  emits: ['close', 'change'],
  setup(props, { emit }) {
    const scopeEventListener = effectScope();
    // @ts-ignore
    const wrapper = ref<HTMLDivElement>();
    const imgRefs = ref<HTMLImageElement[]>([]);
    const mode = ref('');
    const index = ref(props.initialIndex);
    const loading = ref(false);
    const error = ref(false);
    const transform = shallowRef({
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false,
    });
    const isSingle = computed(() => props?.urlList?.length < 2);
    const isFirst = computed(() => index.value === 0);
    const isLast = computed(() => index.value === props.urlList.length - 1);

    const currentImg = computed(() => props.urlList[index.value]);
    const currentName = computed(() => {
      const arr = currentImg.value.split('/');
      return arr[arr.length - 1];
    });
    const imgStyle = computed(() => {
      const { scale, deg, offsetX, offsetY, enableTransition } = transform.value;
      let translateX = offsetX / scale;
      let translateY = offsetY / scale;

      switch (deg % 360) {
        case 90:
        case -270:
          ;[translateX, translateY] = [translateY, -translateX];
          break;
        case 180:
        case -180:
          ;[translateX, translateY] = [-translateX, -translateY];
          break;
        case 270:
        case -90:
          ;[translateX, translateY] = [-translateY, translateX];
          break;
      }

      const style: CSSProperties = {
        transform: `scale(${scale}) rotate(${deg}deg) translate(${translateX}px, ${translateY}px)`,
        transition: enableTransition ? 'transform .3s' : '',
      };
      if (mode.value === 'contain') {
        style.maxWidth = '100%';
        style.maxHeight = '100%';
      }
      return style;
    });
    const wrapStyles = computed(() => {
      let zIndex = 2000;
      if (props.zIndex) {
        zIndex = props.zIndex;
      } else {
        zIndex += bkZIndexManager.getModalNextIndex() || 1;
      }
      return { zIndex };
    });
    const keydownHandler = throttle((e: KeyboardEvent) => {
      switch (Number(e.code)) {
        // ESC
        case 27:
          hide();
          break;
        // SPACE
        case 32:
          toggleMode('original');
          break;
        // LEFT_ARROW
        case 37:
          prev();
          break;
        // UP_ARROW
        case 38:
          handleActions('zoomIn');
          break;
        // RIGHT_ARROW
        case 39:
          next();
          break;
        // DOWN_ARROW
        case 40:
          handleActions('zoomOut');
          break;
      }
    });
    const mousewheelHandler = throttle((e: WheelEvent | any /* TODO: wheelDelta is deprecated */) => {
      const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
      if (delta > 0) {
        handleActions('zoomIn', {
          zoomRate: 1.2,
          enableTransition: false,
        });
      } else {
        handleActions('zoomOut', {
          zoomRate: 1.2,
          enableTransition: false,
        });
      }
    });

    scopeEventListener.run(() => {
      document.addEventListener('keydown', keydownHandler);
      document.addEventListener('mousewheel', mousewheelHandler);
    });

    function hide() {
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('mousewheel', mousewheelHandler);
      scopeEventListener.stop();
      emit('close');
    }

    function toggleMode(modeNames) {
      if (loading.value) return;

      mode.value = modeNames;
      reset();
    }

    function reset() {
      transform.value = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      };
    }

    function prev() {
      if (isFirst.value && !props.loops) return;
      const len = props.urlList.length;
      index.value = (index.value - 1 + len) % len;
    }

    function next() {
      if (isLast.value && !props.loops) return;
      const len = props.urlList.length;
      index.value = (index.value + 1) % len;
    }

    function handleActions(action: ViewerAction, options = {}) {
      if (loading.value) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options,
      };
      switch (action) {
        case 'zoomOut':
          if (transform.value.scale > 0.2) {
            transform.value.scale = Number.parseFloat((transform.value.scale - zoomRate).toFixed(3));
          }
          break;
        case 'zoomIn':
          if (transform.value.scale < 7) {
            transform.value.scale = Number.parseFloat((transform.value.scale + zoomRate).toFixed(3));
          }
          break;
        case 'clockwise':
          transform.value.deg += rotateDeg;
          break;
        case 'anticlockwise':
          transform.value.deg -= rotateDeg;
          break;
      }
      transform.value.enableTransition = enableTransition;
    }
    function handleImgLoad() {
      error.value = false;
      loading.value = false;
    }

    function handleImgError(e: Event) {
      error.value = true;
      loading.value = false;
      (e.target as HTMLImageElement).alt = '加载失败';
    }
    function handleMouseDown(e: MouseEvent) {
      if (loading.value || e.button !== 0 || !wrapper.value) return;
      transform.value.enableTransition = false;

      const { offsetX, offsetY } = transform.value;
      const startX = e.pageX;
      const startY = e.pageY;


      const mousemove = throttle((ev: MouseEvent) => {
        transform.value = {
          ...transform.value,
          offsetX: offsetX + ev.pageX - startX,
          offsetY: offsetY + ev.pageY - startY,
        };
      });
      const mouseup = () => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
      e.preventDefault();
    }
    return () => (
      <Teleport to='body'>
        <Transition>
          <div tabindex='-1' ref='wrapper' class='bk-image-viewer-wrapper' style={wrapStyles.value}>
            <div
              class='bk-image-viewer-mask'
              onClick={() => {
                props.maskClose && hide();
              }}/>
            {
              props.isShowTitle && props.urlList.length ? (
                <div class='bk-image-viewer-header'>
                  <div>{currentName}</div>
                  <div class='tc '>{index.value + 1}/{props.urlList.length}</div>
                  <div class='quit-box tr'>
                    <div class='quit-tips mr10'>ESC 可以退出全屏</div>
                    <div class='bk-image-viewer-close' onClick={hide}>
                      <Close/>
                    </div>
                  </div>
                </div>
              ) : ''
            }
            {!isSingle.value ? (
              <>
                <div
                  onClick={prev}
                  class={`bk-image-viewer-btn bk-image-viewer-prev ${!props.loops && isFirst ? 'is-disabled' : ''}`}>
                  <AngleLeft/>
                </div>
                <div
                  onClick={next}
                  class={`bk-image-viewer-btn bk-image-viewer-prev ${!props.loops && isLast ? 'is-disabled' : ''}`}>
                  <AngleRight/>
                </div>
                <div class="bk-image-viewer-actions-inner">
                  <AngleLeft v-bk-tooltips="{content: '提示信息', placement: 'top'}" onClick={() => handleActions('zoomOut')}/>
                  <i
                    class=""
                    v-bk-tooltips="{content: '提示信息', placement: 'top'}"
                    onClick={() => handleActions('zoomOut')} />
                  <i
                    class="bk-icon icon-narrow-line"
                    v-bk-tooltips="{content: '提示信息', placement: 'top'}"
                    onClick={() => handleActions('zoomOut')} />

                </div>
              </>
            ) : ''}
            <div class={`bk-image-viewer-canvas ${props.isShowTitle ? 'bk-image-viewer-has-header' : ''}`}>
              {error.value ? (
                <div class="bk-image-viewer-error">
                  <div><i class="bk-icon icon-image-fail"></i></div>
                  <div>抱歉，图片加载失败</div>
                </div>
              ) : (
                props.urlList.map((url, i) => {
                  if (i === index.value) {
                    return '';
                  }
                  return <img
                    key={i}
                    ref={el => (imgRefs[i] = el as HTMLImageElement)}
                    class="bk-image-viewer-img"
                    style={imgStyle.value}
                    src={url}
                    onLoad={handleImgLoad}
                    onError={handleImgError}
                    onMousedown={handleMouseDown}
                  />;
                })
              )}
            </div>

          </div>
        </Transition>
      </Teleport>
    );
  },
});
