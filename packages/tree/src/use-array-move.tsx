/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
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
import { TreeNode } from './props';

type InsertPosition = 'insertAfter' | 'insertBefore';

export function useArrayMove() {
  /**
   * 移动连续元素到指定位置
   * @param arr 源数组
   * @param sourceIndex 源元素起始索引位置
   * @param targetIndex 目标索引位置
   * @param sourceChildCount 拖拽源元素个数连续子元素个数，这里是索引位置，必然是 sourceIndex 之后的连续索引，不包含原元素
   * @param targetChildCount 目标元素个数连续子元素个数，这里是索引位置，必然是 targetIndex 之后的连续索引，不包含原元素
   * @param position 插入位置
   * @returns 新的数组
   */
  const moveElement = (
    arr: TreeNode[],
    sourceIndex: number,
    targetIndex: number,
    sourceChildCount = 0,
    targetChildCount = 0,
    position: InsertPosition = 'insertAfter',
  ) => {
    // 检查索引是否有效
    if (
      sourceIndex < 0 ||
      targetIndex < 0 ||
      sourceIndex >= arr.length ||
      targetIndex >= arr.length ||
      (sourceIndex === targetIndex && position === 'insertAfter') ||
      sourceIndex + sourceChildCount >= arr.length ||
      targetIndex + targetChildCount >= arr.length
    ) {
      return Array.from(arr);
    }

    // 创建数组副本
    const newArray = Array.from(arr);

    // 获取要移动的元素（包含源元素及其子元素）
    const elementsToMove = newArray.splice(sourceIndex, sourceChildCount + 1);

    // 计算实际插入位置
    let insertIndex = targetIndex;

    // 如果源位置在目标位置之前，需要调整插入位置
    if (sourceIndex < targetIndex) {
      insertIndex = targetIndex - (sourceChildCount + 1);
    }

    // 计算最终插入位置（在目标节点的子节点之后）
    const finalInsertIndex = insertIndex + targetChildCount + (position === 'insertAfter' ? 1 : 0);

    // 确保插入位置有效
    const safeInsertIndex = Math.max(0, Math.min(finalInsertIndex, newArray.length));

    // 插入元素
    newArray.splice(safeInsertIndex, 0, ...elementsToMove);

    return newArray;
  };

  return { moveElement };
}
