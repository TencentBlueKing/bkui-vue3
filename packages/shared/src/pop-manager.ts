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

import { bKMaskManager } from './bk-mask-manager';
import { random } from './utils';
import { bkZIndexManager } from './z-index-manager';

class BKPopIndexManager {
  /** 用来缓存弹出层实例 */
  private popInstanceList: Array<any>;
  private readonly uuidAttrName: string;
  constructor() {
    this.popInstanceList = [];
    this.uuidAttrName = 'data-bk-pop-uuid';
  }

  /**
   * 展示弹窗
   * @param content 弹窗内容
   * @param showMask 是否显示遮罩
   * @param appendStyle 追加样式
   * @returns
   */
  public show(content?: HTMLElement, showMask = true, appendStyle = {}) {
    if (!content) {
      console.warn('pop show error: content is null or undefined');
      return;
    }
    const zIndex = bkZIndexManager.getModalNextIndex();
    const uuid = random(16);
    content.setAttribute(this.uuidAttrName, uuid);
    this.popInstanceList.push({ uuid, zIndex, content, showMask, appendStyle });
    showMask && bKMaskManager.backupActiveInstance();
    bKMaskManager.show(content, zIndex, showMask, appendStyle, uuid);
  }

  /**
   * 关闭最后一个弹窗 如果当前还有父级弹窗，则激活父级弹窗
   * @param removeLastContent 默认:true 是否自动关闭最后一个弹窗实例 某些场景下，已经主动关闭最后一个弹窗，此处只需要处理其他逻辑
   */
  public popHide(removeLastContent = true) {
    if (this.popInstanceList.length) {
      if (removeLastContent) {
        const lastItem = this.popInstanceList.pop();
        bKMaskManager.popIndexStore(lastItem.uuid);
        lastItem.remove();
      }

      if (this.popInstanceList.length) {
        const activeItem = this.popInstanceList.slice(-1)[0];
        const { zIndex, content, showMask, appendStyle, uuid } = activeItem;
        bKMaskManager.show(content, zIndex, showMask, appendStyle, uuid);
      } else {
        bKMaskManager.hide();
      }
    }
  }

  /**
   * 关闭指定弹窗
   * @param content { HTMLElement } 关闭弹窗内容
   * **/
  public hide(content?: HTMLElement) {
    /** 检查当前实例是否存在于已缓存列表 */
    const uuid = content?.getAttribute(this.uuidAttrName);
    if (uuid) {
      const itemIndex = this.popInstanceList.findIndex(item => item.uuid === uuid);
      if (itemIndex >= 0) {
        this.popInstanceList[itemIndex].content.remove();
        this.popInstanceList.splice(itemIndex, 1);
        bKMaskManager.popIndexStore(uuid);
        if (!this.popInstanceList.length) {
          bKMaskManager.hide();
        } else {
          this.popHide(false);
        }
      }
    } else {
      content?.remove();
    }
  }
}

export const bkPopIndexManager = new BKPopIndexManager();
