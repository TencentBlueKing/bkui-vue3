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

import { bkZIndexManager } from './z-index-manager';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export class BkMaskManager {
  /** 遮罩容器 */
  private readonly mask: HTMLElement;

  /** 遮罩备份容器，用于多个组件实例显示，遮罩只显示最后一个 **/
  private readonly backupMask: HTMLElement;

  /** 是否允许多个遮罩实例 */
  private readonly multiInstance: boolean = false;

  /** 遮罩控制器唯一标识 */
  private readonly uniqueMaskAttrTag: string = '';

  /** 设置弹出层父级组件，默认是body */
  private parentNode: HTMLElement = document.body;

  /** 遮罩当前显示组件实例 **/
  private activeInstance: HTMLElement | undefined = undefined;

  /** 遮罩样式 **/
  private readonly maskStyle: any = {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: 'none',
    'background-color': 'rgba(0,0,0,.6)',
  };

  /**
   * 遮罩管理器
   *
   * @param multiInstance 是否允许多实例
   * @param maskAttrTag 遮罩DOM唯一标志，支持自定义和 auto
   */
  constructor(config?: any) {
    const { multiInstance = false, maskAttrTag = 'auto', parentNode = document.body, maskStyle = {} } = config || {};
    this.activeInstance = undefined;
    this.maskStyle = Object.assign({}, this.maskStyle, maskStyle);
    this.multiInstance = multiInstance;
    this.uniqueMaskAttrTag = this.getMaskAttrTag(maskAttrTag);
    this.parentNode = parentNode || document;
    this.mask = this.getMask();
    this.backupMask = this.createMask('data-bk-backup-uid');
    this.setMaskStyle();
  }


  public show(content?: HTMLElement, zIndex?: number) {
    // @ts-ignore
    const localZIndex: number = /-?\d+/.test(`${zIndex}`) ? zIndex : bkZIndexManager.getModalNextIndex();
    this.mask.style.setProperty('display', 'block');
    this.mask.style.setProperty('z-index', `${localZIndex}`);
    this.backupMask.style.setProperty('z-index', `${localZIndex - 1}`);

    if (content) {
      this.activeInstance = content;
      this.appendContentToMask(content);
    }
  }

  public hide(content?: HTMLElement) {
    this.mask.style.setProperty('display', 'none');
    content?.remove();
    this.activeInstance?.remove();
    this.activeInstance = undefined;
  }

  public backupActiveInstance() {
    if (this.activeInstance) {
      this.backupMask.append(this.activeInstance);
    }
  }

  public backupContentElement(content?: HTMLElement) {
    content && this.backupMask.append(content);
  }

  public getActiveContentInstance() {
    return this.activeInstance;
  }

  /**
   * 初始化当前遮罩管理器
   * @returns 当前遮罩容器
   */
  private getMask(): HTMLElement {
    if (this.multiInstance) {
      return this.createMask();
    }

    let div: HTMLElement | null = this.parentNode.querySelector(`[data-bkmask-uid='${this.uniqueMaskAttrTag}']`);
    if (!div) {
      div = this.createMask();
    }

    return div;
  }

  /**
   * 创建遮罩层DOM
   * @returns 返回DOM
   */
  private createMask(attrName = 'data-bk-mask-uid') {
    const div: HTMLElement = document.createElement('div');
    div.setAttribute(attrName, this.uniqueMaskAttrTag);
    this.parentNode.append(div);
    return div;
  }

  private setMaskStyle() {
    if (this.mask) {
      Object.entries(this.maskStyle).forEach(cfg => this.mask.style.setProperty(cfg[0], cfg[1] as string));
    }
  }

  /**
   * 根据输入生成唯一遮罩标识
   * @param tag 输入标识
   * @returns string 返回唯一标识
   */
  private getMaskAttrTag(tag: string) {
    if (/^(auto|\s+)$/i.test(tag) || tag === null || tag === undefined || tag === '') {
      return `__bk_mask_${uuidv4()}`;
    }

    return tag;
  }

  private appendContentToMask(content: HTMLElement) {
    this.mask.append(content);
  }
}

export const bKMaskManager = new BkMaskManager({});
