
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
import { GroupColumn } from '../props';

export default (colgroups: GroupColumn[], immediate = true) => {
  const pluginName = 'HeadColumnResize';
  const enum EVENTS {
    MOUSE_MOVE = 'onMousemove',
    MOUSE_OUT = 'onMouseout',
    MOUSE_DOWN ='onMousedown'
  };
  const handler = {
    [EVENTS.MOUSE_DOWN]: (_e: MouseEvent, _column: GroupColumn) => {
      console.log('onMousedown');
    },
    [EVENTS.MOUSE_MOVE]: (_e: MouseEvent, _column: GroupColumn) => {
      console.log('onMousemove');
    },
    [EVENTS.MOUSE_OUT]: (_e: MouseEvent, _column: GroupColumn) => {
      console.log('onMouseout');
    },
  };

  const getEventName = (event: string) => `${pluginName}_${event}`;

  const registerResizeEvent = () => {
    colgroups.forEach((col) => {
      Object.keys(handler).forEach((event: string) => {
        const name = getEventName(event);
        if (!col.listeners.has(name)) {
          col.listeners.set(name, []);
        }

        col.listeners.get(name).push(handler[event]);
      });
    });
  };

  const resetResizeEvents = () => {
    colgroups.forEach((col) => {
      Object.keys(handler).forEach((event: string) => {
        const name = getEventName(event);
        if (col.listeners.has(name)) {
          const listeners = col.listeners.get(name);
          listeners.splice(0, listeners.length);
        }
      });
    });
  };

  if (immediate) {
    registerResizeEvent();
  }

  return {
    registerResizeEvent,
    resetResizeEvents,
  };
};
