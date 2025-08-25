/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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
// 处理table有关checkbox-label溢出是否需要显示tooltip
import { Ref } from 'vue';

const useCheckboxToolTip = () => {
  const renderDomStyles = (el: HTMLElement) => {
    let stylesSize = {
      paddingSize: 0,
      borderSize: 0,
      marginSize: 0,
    };
    if (!el) {
      return stylesSize;
    }

    function getHorizontalSpace(payload: string) {
      const distanceValues = payload
        .trim()
        .split(' ')
        .map(item => Number.parseFloat(item));
      // 根据值的数量来确定如何解析
      if (distanceValues.length === 1) {
        // 只有一个值，表示四个方向的边距都相同
        return {
          distanceLeft: distanceValues.at(0),
          distanceRight: distanceValues.at(0),
        };
      } else if (distanceValues.length === 2) {
        // 两个值，表示垂直和水平方向的边距
        return {
          distanceLeft: distanceValues.at(1),
          distanceRight: distanceValues.at(1),
        };
      } else if (distanceValues.length === 3 || distanceValues.length === 4) {
        // 三个或四个值，分别表示上、右（和下）、下（和左，如果存在）的边距
        return {
          distanceLeft: distanceValues.at(distanceValues.length - 1),
          distanceRight: distanceValues.at(1),
        };
      }

      // 如果 payload 格式不正确，返回默认值
      return {
        distanceLeft: 0,
        distanceRight: 0,
      };
    }

    const computedStyle = getComputedStyle(el);
    const originalPadding = computedStyle.getPropertyValue('padding');
    const originalMargin = computedStyle.getPropertyValue('margin');
    const originalBorder = computedStyle.getPropertyValue('border');

    stylesSize.borderSize =
      Number.parseFloat(computedStyle.getPropertyValue('border-left-width')) +
      Number.parseFloat(computedStyle.getPropertyValue('border-right-width'));

    stylesSize.paddingSize =
      Number.parseFloat(computedStyle.getPropertyValue('padding-left')) +
      Number.parseFloat(computedStyle.getPropertyValue('padding-right'));

    stylesSize.marginSize =
      Number.parseFloat(computedStyle.getPropertyValue('margin-left')) +
      Number.parseFloat(computedStyle.getPropertyValue('margin-right'));

    const hasPadding = originalPadding !== '' && originalPadding !== '0px' && originalPadding !== undefined;
    const hasMargin = originalMargin !== '' && originalMargin !== '0px' && originalMargin !== undefined;
    const hasBorder = originalBorder !== '' && originalBorder.indexOf('0px') === -1 && originalBorder !== undefined;

    if (hasPadding) {
      const { distanceLeft, distanceRight } = getHorizontalSpace(originalPadding);
      stylesSize.paddingSize = distanceLeft + distanceRight;
    }

    if (hasMargin) {
      const { distanceLeft, distanceRight } = getHorizontalSpace(originalMargin);
      stylesSize.marginSize = distanceLeft + distanceRight;
    }

    if (hasBorder) {
      stylesSize.borderSize = Number.parseFloat(computedStyle.getPropertyValue('border-width'));
    }

    return stylesSize;
  };

  const resolveOverflowTips = (field: string, itemRef: Ref, listRef: Ref) => {
    const labelRef = listRef.value[field];
    const checkBoxLabelRef = itemRef.value?.querySelector('.bk-checkbox-label');
    if (labelRef && checkBoxLabelRef) {
      const CHECKBOX_WIDTH = 16;
      const labelStyles = renderDomStyles(labelRef);
      const checkBoxLabel = renderDomStyles(checkBoxLabelRef);
      const filterPopoverStyles = renderDomStyles(itemRef.value);
      // 获取每个item项的margin、padding、 border
      const allTipStyles =
        labelRef?.offsetWidth +
        labelStyles?.borderSize +
        labelStyles?.marginSize +
        labelStyles?.paddingSize +
        filterPopoverStyles?.borderSize +
        filterPopoverStyles?.marginSize +
        filterPopoverStyles?.paddingSize +
        checkBoxLabel?.marginSize +
        checkBoxLabel?.paddingSize;
      const curOffsetWidth = itemRef.value?.offsetWidth || 0;
      if (labelRef?.offsetWidth > curOffsetWidth || CHECKBOX_WIDTH + allTipStyles > curOffsetWidth) {
        return true;
      }
    }
    return false;
  };

  return {
    renderDomStyles,
    resolveOverflowTips,
  };
};
export type UseCheckboxToolTip = ReturnType<typeof useCheckboxToolTip>;
export default useCheckboxToolTip;
