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

import type { ExtractPropTypes } from 'vue';
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
} from 'vue';

import { BKPopover, bkZIndexManager, IBKPopover } from '@bkui-vue/shared';
import type { Placement } from '@popperjs/core';

import type { DatePickerPlacementType } from '../interface';

const pickerDropdownProps = {
  placement: {
    type: String as PropType<DatePickerPlacementType>,
    default: 'bottom-start',
    validator: (value) => {
      const validList: DatePickerPlacementType[] = [
        'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end',
      ];
      if (validList.indexOf(value) < 0) {
        console.error(`placement property is not valid: '${value}'`);
        return false;
      }
      return true;
    },
  },
  className: {
    type: String,
  },
  extPopoverCls: {
    type: String,
  },
  appendToBody: {
    type: Boolean,
  },
  triggerRef: {
    type: Object,
  },
  onClick: Function as PropType<(e: MouseEvent) => void>,
} as const;

export type PickerDropdownProps = Readonly<ExtractPropTypes<typeof pickerDropdownProps>>;

export default defineComponent({
  props: pickerDropdownProps,
  emits: ['changeVisible'],
  setup(props, { emit }) {
    let popoverInstance: any = Object.create(null);

    const refContentRef = ref(null);

    onMounted(() => {
      updateDropdown();
    });
    onBeforeUnmount(() => {
      destoryDropdown();
    });

    // const resetTransformOrigin = (state) => {
    //   if (popoverInstance && Object.keys(popoverInstance).length !== 0) {
    //     const dataPopperPlacement = state.attributes.popper['data-popper-placement'] as string;
    //     const arr = dataPopperPlacement.split('-');
    //     const placementStart = arr[0];
    //     const placementEnd = arr[1];
    //     const leftOrRight = dataPopperPlacement === 'left' || dataPopperPlacement === 'right';
    //     if (!leftOrRight) {
    //       state.styles.popper.transformOrigin = placementStart === 'bottom'
    //         || (placementStart !== 'top' && placementEnd === 'start')
    //         ? 'center top'
    //         : 'center bottom';
    //     }
    //   }
    // };

    const destoryDropdown = () => {
      if (popoverInstance && Object.keys(popoverInstance).length !== 0) {
        const instance = popoverInstance as IBKPopover;
        instance.isShow && instance.hide();
        instance.destroy();
        popoverInstance = null;
        emit('changeVisible', false);
      }
    };

    // const transforms = {
    //   top: 'bottom center',
    //   'top-start': 'bottom left',
    //   'top-end': 'bottom right',

    //   bottom: 'top center',
    //   'bottom-start': 'top left',
    //   'bottom-end': 'top right',

    //   left: 'right center',
    //   'left-start': 'right top',
    //   'left-end': 'right bottom',

    //   right: 'left center',
    //   'right-start': 'left top',
    //   'right-end': 'left bottom',
    // };

    // const toTransformOrigin = (placement: Placement) => transforms[placement];

    // const toVar = (value: string, fallback?: string) => ({
    //   var: value,
    //   varRef: fallback ? `var(${value}, ${fallback})` : `var(${value})`,
    // });

    // const cssVars = {
    //   arrowShadowColor: toVar('--popper-arrow-shadow-color'),
    //   arrowSize: toVar('--popper-arrow-size', '8px'),
    //   arrowSizeHalf: toVar('--popper-arrow-size-half'),
    //   arrowBg: toVar('--popper-arrow-bg'),
    //   transformOrigin: toVar('--popper-transform-origin'),
    //   arrowOffset: toVar('--popper-arrow-offset'),
    // } as const;

    // const setTransformOrigin = (state: State) => {
    //   state.elements.popper.style.setProperty(
    //     cssVars.transformOrigin.var,
    //     toTransformOrigin(state.placement),
    //   );
    // };

    // const transformOrigin: Modifier<'transformOrigin', any> = {
    //   name: 'transformOrigin',
    //   enabled: true,
    //   phase: 'write',
    //   fn: ({ state }) => {
    //     setTransformOrigin(state);
    //   },
    //   effect: ({ state }) => () => {
    //     setTransformOrigin(state);
    //   },
    // };

    // const matchWidth: Modifier<'matchWidth', any> = {
    //   name: 'matchWidth',
    //   enabled: true,
    //   phase: 'beforeWrite',
    //   requires: ['computeStyles'],
    //   fn: ({ state }) => {
    //     state.styles.popper.width = `${state.rects.reference.width + 1}px`;
    //   },
    //   effect: ({ state }) => () => {
    //     const reference = state.elements.reference as HTMLElement;
    //     state.elements.popper.style.width = `${reference.offsetWidth}px`;
    //   },
    // };

    const updateDropdown = () => {
      if (popoverInstance && Object.keys(popoverInstance).length !== 0) {
        nextTick(() => {
          popoverInstance.update();
        });
      } else {
        nextTick(() => {
          popoverInstance = new BKPopover(
            props.triggerRef as HTMLElement,
            refContentRef.value as HTMLElement,
            {
              placement: props.placement as Placement,
              trigger: 'manual',
              modifiers: [
                // matchWidth,
                // transformOrigin,
                {
                  name: 'computeStyles',
                  options: {
                    adaptive: false, // true by default
                    gpuAcceleration: false,
                  },
                },
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4],
                  },
                },
                // {
                //   name: 'preventOverflow',
                //   options: {
                //     // boundariesElement: 'window',
                //     padding: {
                //       top: 2,
                //       bottom: 2,
                //       left: 5,
                //       right: 5,
                //     },
                //   },
                // },
                // {
                //   name: 'flip',
                //   options: {
                //     padding: 5,
                //     rootBoundary: 'document',
                //   },
                // },
                // {
                //   name: 'onUpdate',
                //   enabled: true,
                //   phase: 'afterWrite',
                //   fn({ state }) {
                //     resetTransformOrigin(state);
                //   },
                // },
              ],
              // onFirstUpdate: () => {
              //   resetTransformOrigin(popoverInstance.instance.state);
              // },
            },
          );
          // popoverInstance.update();
        });
      }
    };

    const styles = computed(() => {
      const style = {};

      if (props.appendToBody) {
        style['z-index'] = 1060 + bkZIndexManager.getModalNextIndex();
      }

      return style;
    });

    const state = reactive({
      styles,
    });

    return {
      ...toRefs(state),
      refContentRef,
      updateDropdown,
      destoryDropdown,
    };
  },
  render() {
    return (
      <div
        ref="refContentRef"
        class={['bk-date-picker-dropdown', this.className, this.extPopoverCls]}
        style={this.styles}
        onClick={this.onClick}
      >
          {this.$slots.default?.() ?? ''}
      </div>
    );
  },
});
