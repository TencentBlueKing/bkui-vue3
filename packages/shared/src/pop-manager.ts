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

import { isElement } from './helper';
import { BkMaskManager } from './mask-manager';
import { random } from './utils';
import { bkZIndexManager } from './z-index-manager';

const popInstanceStore = new WeakMap();

export class BKPopIndexManager {
  /** 用来缓存弹出层实例 */
  private readonly uuidAttrName: string;
  private clickFn?: { fn: (e: MouseEvent) => void; target: HTMLElement };
  private bKMaskManagerInstance: BkMaskManager;
  private transfer: HTMLElement;
  private uniqId: string;

  constructor(options?) {
    this.clickFn = undefined;
    this.uuidAttrName = 'data-bk-pop-uuid';

    this.uniqId = random(16);
    this.transfer = this.getParentNode(options?.transfer);
    this.bKMaskManagerInstance = new BkMaskManager({
      parentNode: this.getParentNode(options?.transfer),
      popInstance: this,
      onClick: this.onMaskClickFn,
    });
  }

  get popInstanceList(): any[] {
    if (!popInstanceStore.has(this.transfer)) {
      popInstanceStore.set(this.transfer, []);
    }
    return popInstanceStore.get(this.transfer);
  }

  set popInstanceList(val) {
    popInstanceStore.set(this.transfer, val);
  }

  public getParentNode(transfer) {
    if (typeof transfer === 'string') {
      const target = document.querySelector(transfer) as HTMLElement;
      if (target) {
        return target;
      }
    }

    if (isElement(transfer)) {
      return transfer;
    }

    return document.body;
  }

  public onMaskClick(callFn: (e: MouseEvent) => void, target: HTMLElement) {
    this.clickFn = { fn: callFn, target };
  }

  /**
   * 展示弹窗
   * @param content 弹窗内容
   * @param showMask 是否显示遮罩
   * @param appendStyle 追加样式
   * @param transfer 是否显示在body内（即是否显示在div#app内，默认为false）
   * @returns
   */
  public show(
    content?: HTMLElement,
    showMask = true,
    appendStyle = {},
    transfer = false,
    zindex = undefined,
    onMaskClick?,
  ) {
    if (!content) {
      console.warn('pop show error: content is null or undefined');
      return;
    }
    const zIndex = typeof zindex === 'number' ? zindex : bkZIndexManager.getModalNextIndex();
    const uuid = random(16);
    content.setAttribute(this.uuidAttrName, uuid);
    if (this.popInstanceList.length > 0) {
      showMask && this.bKMaskManagerInstance.backupContentElement(this.popInstanceList.slice(-1)[0].content);
    }

    this.popInstanceList.push({ uuid, zIndex, content, showMask, appendStyle });
    this.bKMaskManagerInstance.show(content, zIndex, showMask, appendStyle, uuid, transfer, onMaskClick, this.uniqId);
  }

  /**
   * 销毁指定实例
   * @param content 指定实例内容
   * @param transfer
   */
  public destroy(content?: HTMLElement, transfer = false) {
    this.clickFn = undefined;
    this.hide(content, transfer);
  }

  /**
   * 关闭最后一个弹窗 如果当前还有父级弹窗，则激活父级弹窗
   * @param removeLastContent 默认:true 是否自动关闭最后一个弹窗实例 某些场景下，已经主动关闭最后一个弹窗，此处只需要处理其他逻辑
   */
  public popHide(removeLastContent = true) {
    if (this.popInstanceList.length) {
      if (removeLastContent) {
        const lastItem = this.popInstanceList.pop();
        this.bKMaskManagerInstance.popIndexStore(lastItem.uuid);
        lastItem.remove();
      }

      if (this.popInstanceList.length) {
        const activeItem = this.popInstanceList.slice(-1)[0];
        const { zIndex, content, showMask, appendStyle, uuid } = activeItem;
        this.bKMaskManagerInstance.show(content, zIndex, showMask, appendStyle, uuid);
      } else {
        this.bKMaskManagerInstance.hide();
        // this.clickFn.length = 0;
      }
    }
  }

  /**
   * 关闭指定弹窗
   * @param content { HTMLElement } 关闭弹窗内容
   * **/
  public hide(content?: HTMLElement, transfer = false) {
    /** 检查当前实例是否存在于已缓存列表 */
    const uuid = content?.getAttribute(this.uuidAttrName);
    if (uuid) {
      const itemIndex = this.popInstanceList.findIndex(item => item.uuid === uuid);
      if (itemIndex >= 0) {
        if (!transfer) this.popInstanceList[itemIndex].content.remove();
        this.popInstanceList.splice(itemIndex, 1);
        this.bKMaskManagerInstance.popIndexStore(uuid);
        if (!this.popInstanceList.length) {
          this.bKMaskManagerInstance.hide(transfer);
        } else {
          this.popHide(false);
        }
      }
    } else {
      content?.remove();
    }

    this.bKMaskManagerInstance.removeClickEvent();
  }

  public removeLastEvent() {
    this.bKMaskManagerInstance.destroyEvent(this.uniqId);
  }

  private onMaskClickFn(e: MouseEvent) {
    if (this.clickFn) {
      const { fn } = this.clickFn;
      if (fn) {
        Reflect.apply(fn, this, [e]);
      }
    }
  }
}

export const bkPopIndexManager = new BKPopIndexManager();
