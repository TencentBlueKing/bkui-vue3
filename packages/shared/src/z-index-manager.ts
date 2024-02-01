/**
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

/**
 * 页面框架层级
 */
export enum BKLAYERTYPE {
  /** 网站内容的背景、拓扑的画布等 */
  BOTTOM = 'bottom',

  /** 页面呈现的各类内容 */
  CONTENT = 'content',

  /** 顶部导航、侧边导航以及用户信息等 */
  NAVI = 'navi',

  /** 页面需全屏操作的部分功能或编辑器的全屏模式 */
  FULLSCREEN = 'fullScreen',

  /** 各类功能插件 */
  PLUGINS = 'plugins',

  /** 各类弹窗或抽屉（非模态弹窗不考虑） */
  MODAL = 'modal',

  /** 各类消息提示 */
  MESSAGE = 'message',

  /** 各类popper提示 */
  POPPER = 'popper',
}

/** 定义不同分层默认值 */
export const BKLAYERD_INDEX_EFAULT_VALUE = {
  [BKLAYERTYPE.BOTTOM]: 0,
  [BKLAYERTYPE.CONTENT]: 1,
  [BKLAYERTYPE.NAVI]: 100,
  [BKLAYERTYPE.FULLSCREEN]: 1000,
  [BKLAYERTYPE.MODAL]: 2000,
  [BKLAYERTYPE.PLUGINS]: 5000,
  [BKLAYERTYPE.MESSAGE]: 6000,
  [BKLAYERTYPE.POPPER]: 8000,
};

class BKZIndexManager {
  storageLayerIndexValue: any = {};
  constructor() {
    this.copyDefaultValue();
  }

  /**
   *
   * @param type
   * @returns
   */
  public getNextIndex(type: BKLAYERTYPE): number {
    if (Object.prototype.hasOwnProperty.call(this.storageLayerIndexValue, type)) {
      this.storageLayerIndexValue[type] = this.storageLayerIndexValue[type] + 1;
      return this.storageLayerIndexValue[type];
    }

    this.storageLayerIndexValue[BKLAYERTYPE.MODAL] = this.storageLayerIndexValue[BKLAYERTYPE.MODAL] + 1;
    return this.storageLayerIndexValue[BKLAYERTYPE.MODAL];
  }

  /** 获取弹窗类型最新zIndex的值 */
  public getModalNextIndex() {
    return this.getNextIndex(BKLAYERTYPE.MODAL);
  }

  /** 获取Message类型最新zIndex的值 */
  public getMessageNextIndex() {
    return this.getNextIndex(BKLAYERTYPE.MESSAGE);
  }

  /** 获取全屏类型最新zIndex的值 */
  public getFullScreenNextIndex() {
    return this.getNextIndex(BKLAYERTYPE.FULLSCREEN);
  }

  /** 获取导航类型最新zIndex的值 */
  public getNaviNextIndex() {
    return this.getNextIndex(BKLAYERTYPE.NAVI);
  }

  /** 获取导航类型最新zIndex的值 */
  public getPopperIndex() {
    return this.getNextIndex(BKLAYERTYPE.POPPER);
  }

  /**
   * 更新自定义默认zIndex配置
   * @param config 配置项
   */
  public setDefaultZIndex(config: any) {
    Object.keys(config || {}).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this.storageLayerIndexValue.__proto__, key)) {
        Object.assign(this.storageLayerIndexValue.__proto__, { [key]: config[key] });
      }
    });

    this.copyDefaultValue();
  }

  /**
   * 重置zIndex
   * @param config 配置项
   */
  public resetZIndex(config: any) {
    Object.keys(config || {}).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this.storageLayerIndexValue, key)) {
        Object.assign(this.storageLayerIndexValue, { [key]: config[key] });
      }
    });
  }

  /**
   * 根据默认设置创建副本
   */
  private copyDefaultValue() {
    const properties = Object.keys(BKLAYERD_INDEX_EFAULT_VALUE).reduce(
      (props, key: string) =>
        Object.assign(props, {
          [key]: {
            value: BKLAYERD_INDEX_EFAULT_VALUE[key as BKLAYERTYPE],
            writable: true,
            configurable: true,
          },
        }),
      {},
    );
    this.storageLayerIndexValue = Object.create(BKLAYERD_INDEX_EFAULT_VALUE, properties);
  }
}

export const bkZIndexManager = new BKZIndexManager();
