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

import { BKPopIndexManager } from './pop-manager';
import { random } from './utils';
import { bkZIndexManager } from './z-index-manager';
// eslint-disable-next-line @typescript-eslint/naming-convention
const DEFAULT_MASK_UUID = function () {};
DEFAULT_MASK_UUID.prototype.def_val = `__bk_mask_${random(16)}`;

const MaskEventMap = new WeakMap();

const getMaskEvent = (mask) => {
  if (MaskEventMap.has(mask)) {
    return MaskEventMap.get(mask);
  }

  return [];
};

const setMaskEvent = (mask, event, args?, content?, instanceId?) => {
  const maskEvent = getMaskEvent(mask);
  if (maskEvent.some(evet => evet.instanceId === instanceId)) {
    return;
  }

  maskEvent.push({ event, args, content, instanceId });
  MaskEventMap.set(mask, maskEvent);
};

class MaskQueueMaker {
  private timer = null;
  private store = [];
  private maskMap = new WeakMap();

  public appendMaker(fn) {
    this.store.push(fn);
    this.executeMaker();
  }

  public pushMaskStyle(parentNode, style) {
    const value = this.getMaskMap(parentNode);
    this.setMaskMap(parentNode, { styles: [style], ...(value || {}) });
  }

  public getMaskStyles(parentNode) {
    return this.getMaskMap(parentNode)?.styles || [];
  }

  public setMaskId(parentNode, id) {
    const value = this.getMaskMap(parentNode);
    if (!value) {
      this.setMaskMap(parentNode, { id, ...(value || {}) });
    } else {
      Object.assign(value, { id });
      this.setMaskMap(parentNode, value);
    }
  }

  public getMaskId(parentNode) {
    return this.getMaskMap(parentNode)?.id;
  }

  public setMaskMap(key, value) {
    this.maskMap.set(key, value);
  }

  public getMaskMap(key) {
    return this.maskMap.get(key);
  }

  private executeMaker() {
    this.timer && cancelAnimationFrame(this.timer);
    this.timer = requestAnimationFrame(() => {
      const fn = this.store.pop();
      if (typeof fn === 'function') {
        Reflect.apply(fn, this, []);
        this.executeMaker();
      }
    });
  }
}

const bkMaskMaker = new MaskQueueMaker();

type BkMaskManagerConfig = {
  multiInstance?: boolean;
  maskAttrTag?: string;
  parentNode?: HTMLElement | Document;
  maskStyle?: any;
  onClick?: (e: MouseEvent) => void;
  popInstance?: BKPopIndexManager;
};

type MaskConfigStore = {
  zIndex: number;
  style: any;
  uuid?: string;
  preUID?: string;
};

export class BkMaskManager {
  /** 遮罩容器 */
  private mask: HTMLElement;

  /** 遮罩备份容器，用于多个组件实例显示，遮罩只显示最后一个 **/
  private backupMask: HTMLElement;

  /** 是否允许多个遮罩实例 */
  private readonly multiInstance: boolean = false;

  /** 遮罩控制器唯一标识 */
  private uniqueMaskAttrTag = '';

  /** 设置弹出层父级组件，默认是body */
  private parentNode: HTMLElement | Document = document.body;

  /** 遮罩当前显示组件实例 **/
  private activeInstance: HTMLElement | undefined = undefined;

  /** 记录已在使用的z-index */
  private zIndexStore: Map<string, MaskConfigStore> = new Map();

  /** 记录最后一个UUID */
  private lastUUID: string | null = null;

  /** 遮罩样式 **/
  private readonly maskStyle: any = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: 'none',
    'background-color': 'rgba(0,0,0,.6)',
  };

  // 用于判定是否已经初始化过当前实例
  private isInit = false;

  private maskAttrTag = 'auto';

  /**
   * 遮罩管理器
   *
   * @param multiInstance 是否允许多实例
   * @param maskAttrTag 遮罩DOM唯一标志，支持自定义和 auto
   */
  constructor(config?: BkMaskManagerConfig) {
    const {
      multiInstance = false,
      maskAttrTag = 'auto',
      parentNode = document.body,
      maskStyle = {},
    } = config || {};
    this.parentNode = parentNode || document;
    this.maskAttrTag = maskAttrTag;
    this.activeInstance = undefined;
    this.multiInstance = multiInstance;
    this.uniqueMaskAttrTag = this.getMaskAttrTag(maskAttrTag);

    // 避免多个实例多处初始化，此处会做队列处理
    // 合并重复的处理请求
    // 如果当前实例初始化时，仍未执行完队列，则需要进行请求合并
    bkMaskMaker.appendMaker(() => {
      this.initInstance(maskStyle);
    });
  }

  public setOption(option: BkMaskManagerConfig) {
    const {
      parentNode = document.body,
      maskStyle = {},
      maskAttrTag = this.maskAttrTag,
    } = option || {};
    this.parentNode = parentNode || document;
    this.setMaskStyle(Object.assign({}, this.maskStyle, maskStyle));
    this.uniqueMaskAttrTag = this.getMaskAttrTag(maskAttrTag);
  }

  /**
   * 显示遮罩
   * @param content 遮罩内容
   * @param zIndex z-index
   * @param showMask 是否显示遮罩
   * @param appendStyle 追加样式
   * @param transfer 是否显示将内容加入遮罩下
   */
  public show(
    content?: HTMLElement,
    zIndex?: number,
    showMask = true,
    appendStyle = {},
    uuid: string | null = null,
    transfer = false,
    onMaskClick?,
    instanceId?,
  ) {
    const uid = uuid ?? random(16);
    // @ts-ignore
    const localZIndex: number = /-?\d+/.test(`${zIndex}`)
      ? zIndex
      : bkZIndexManager.getModalNextIndex();
    let style = Object.assign({}, this.maskStyle, appendStyle || {});

    /**
     * 如果不显示遮罩，此处遮罩继承父级
     * 同时，如果父级弹出层有遮罩，此处不能覆盖
     */
    if (!showMask) {
      if (this.lastUUID) {
        const preStore = this.zIndexStore.get(this.lastUUID);
        if (preStore) {
          style = preStore?.style;
        }
      }
    }

    /** 缓存当前z-index */
    this.storeMaskInsCfg({
      zIndex: localZIndex,
      style: { ...style },
      uuid: uid,
      preUID: this.lastUUID,
    });

    Object.assign(style, {
      display: 'block',
      'z-index': `${localZIndex}`,
      'pointer-events': 'all',
    });
    this.initInstance(style);
    if (onMaskClick) {
      this.catchClickEvent(content, onMaskClick, instanceId);
    }

    this.setMaskStyle(style);

    bkMaskMaker.pushMaskStyle(this.parentNode, { ...style });

    this.backupMask.style.setProperty('z-index', `${localZIndex - 1}`);

    if (!showMask) {
      this.mask.style.setProperty('pointer-events', 'none');
      content?.style.setProperty('pointer-events', 'all');
    }

    if (content) {
      if (transfer) content.style.setProperty('z-index', `${localZIndex + 1}`); // 表明内容不在遮罩下，内容区z-index + 1
      this.activeInstance = content;
      this.appendContentToMask(content); // 表明内容在body下，即在遮罩下
    }
  }

  public hide(transfer = false, content?: HTMLElement, uuid?: string) {
    const uid = uuid ?? this.lastUUID;
    if (!transfer) {
      content?.remove();
      this.activeInstance?.remove();
    }
    this.removeClickEvent();
    this.activeInstance = undefined;
    this.popIndexStore(uid);
    const maskList = bkMaskMaker.getMaskStyles(this.parentNode);
    maskList?.pop();
    if (!maskList?.length) {
      this.mask.style.setProperty('display', 'none');
    } else {
      const style = maskList.slice(-1)[0];
      this.setMaskStyle(style);
    }
  }

  public storeMaskInsCfg(config: MaskConfigStore) {
    this.zIndexStore.set(config.uuid, config);
    this.lastUUID = config.uuid;
    return this.zIndexStore.get(config.uuid);
  }

  /**
   * 移除最后一次缓存数据
   */
  public popIndexStore(uuid: string) {
    if (this.zIndexStore.has(uuid)) {
      const rmIns = this.zIndexStore.get(uuid);
      this.lastUUID = rmIns.preUID;
      return this.zIndexStore.delete(uuid);
    }

    this.lastUUID = null;
    return false;
  }

  public backupActiveInstance() {
    if (this.activeInstance) {
      this.backupMask.append(this.activeInstance);
    }
  }

  public backupContentElement(content?: HTMLElement) {
    content && this.backupMask?.append(content);
  }

  public getActiveContentInstance() {
    return this.activeInstance;
  }

  public removeClickEvent() {
    // if (this.mask) {
    //   const events = getMaskEvent(this.mask);
    //   if (!events.length) {
    //     console.log('removeEventListener handleMaskClick');
    //     this.mask.removeEventListener('click', this.handleMaskClick);
    //   }
    // }
  }

  private initInstance(maskStyle) {
    if (!this.isInit) {
      this.isInit = true;
      this.backupMask = this.getBackupMask();
      const { instance, isExist } = this.getMask();
      this.mask = instance;

      !isExist
        && this.setMaskStyle(Object.assign({}, this.maskStyle, maskStyle));
    }
  }

  /**
   * 初始化当前遮罩管理器
   * @returns 当前遮罩容器
   */
  private getMask(): { instance: HTMLElement; isExist: boolean } {
    if (this.multiInstance) {
      return { instance: this.createMask(), isExist: false };
    }

    let isExist = true;
    let div: HTMLElement | null = this.parentNode.querySelector(`[data-bk-mask-uid='${this.uniqueMaskAttrTag}']`);
    if (!div) {
      isExist = false;
      div = this.createMask();
      div.addEventListener(
        'click',
        e => this.handleMaskClick(e),
        true,
      );
    }

    return {
      instance: div,
      isExist,
    };
  }

  private catchClickEvent(content, onMaskClick, instanceId) {
    if (this.mask) {
      setMaskEvent(this.mask, onMaskClick, [], content, instanceId);
    }
  }


  private handleMaskClick(e) {
    if (e.target !== this.mask) {
      return;
    }

    const events = getMaskEvent(this.mask);
    if (events.length) {
      const { event } = events.pop();
      if (typeof event === 'function') {
        event(e);
        // Reflect.apply(event, this, [e, ...(args || [])]);
      }
    }
  }

  private getBackupMask() {
    const attrName = 'data-bk-backup-uid';
    let div: HTMLElement | null = this.parentNode.querySelector(`[${attrName}]`);
    if (!div) {
      div = this.createMask(attrName);
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

  private setMaskStyle(maskStyle = {}) {
    if (this.mask) {
      Object.entries(maskStyle).forEach(cfg => this.mask.style.setProperty(cfg[0], cfg[1] as string));
    }
  }

  /**
   * 根据输入生成唯一遮罩标识
   * @param tag 输入标识
   * @returns string 返回唯一标识
   */
  private getMaskAttrTag(tag: string) {
    if (
      /^(auto|\s+)$/i.test(tag)
      || tag === null
      || tag === undefined
      || tag === ''
    ) {
      if (!bkMaskMaker.getMaskId(this.parentNode)) {
        bkMaskMaker.setMaskId(this.parentNode, `__bk_mask_${random(16)}`);
      }

      return bkMaskMaker.getMaskId(this.parentNode);
    }

    return tag;
  }

  private appendContentToMask(content: HTMLElement) {
    this.mask.append(content);
  }
}

export const bKMaskManager = new BkMaskManager({});
