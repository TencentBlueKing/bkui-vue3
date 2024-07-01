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
import BkScrollbarCore, { Options } from './scrollbar-core';

const { addClasses, classNamesToQuery } = BkScrollbarCore.helpers;

export default class BkScrollBar extends BkScrollbarCore {
  static globalObserver: MutationObserver;

  static instances = new WeakMap();

  static removeObserver() {
    BkScrollBar.globalObserver?.disconnect();
  }

  constructor(...args: ConstructorParameters<typeof BkScrollbarCore>) {
    super(...args);

    // Save a reference to the instance, so we know this DOM node has already been instancied
    BkScrollBar.instances.set(args[0], this);
  }

  initDOM() {
    this.wrapperEl = this.options.wrapperNode ?? this.createScrollElement(this.classNames.wrapper);
    this.contentEl = this.options.contentNode ?? this.createScrollElement(this.classNames.contentEl);
    this.delegateXContent = this.options.delegateXContent;
    this.delegateYContent = this.options.delegateYContent;

    if (!this.axis.x.track.el || !this.axis.y.track.el) {
      const track = document.createElement('div');
      const scrollbar = document.createElement('div');

      addClasses(track, this.classNames.track);

      addClasses(scrollbar, this.classNames.scrollbar);

      track.appendChild(scrollbar);

      this.axis.x.track.el = track.cloneNode(true) as HTMLElement;
      addClasses(this.axis.x.track.el, this.classNames.horizontal);

      this.axis.y.track.el = track.cloneNode(true) as HTMLElement;
      addClasses(this.axis.y.track.el, this.classNames.vertical);

      this.el.appendChild(this.axis.x.track.el);
      this.el.appendChild(this.axis.y.track.el);
    }

    BkScrollbarCore.prototype.initDOM.call(this);
  }

  unMount() {
    BkScrollbarCore.prototype.unMount.call(this);
    BkScrollBar.instances.delete(this.el);
  }

  scrollTo({ left = 0, top = 0 }) {
    this.scrollToAxisPosition(left, 'x');
    this.scrollToAxisPosition(top, 'y');
  }

  setOptions(options: Partial<Options>) {
    Object.assign(this.options, options);
  }

  private createScrollElement(className: string): HTMLElement {
    const createEl = () => {
      const el = document.createElement('div');
      addClasses(el, className);
      return el;
    };

    const origin = this.el.querySelector(classNamesToQuery(className));

    return (origin ?? createEl()) as HTMLElement;
  }
}
