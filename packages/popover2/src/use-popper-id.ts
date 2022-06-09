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
import { v4 as uuidv4 } from 'uuid';

let popContainerId = null;
let fullscreenReferId = null;
export default (prefix = '#') => {
  const getPrefixId = () => {
    if (document.fullscreenElement !== null) {
      fullscreenReferId = `id_${uuidv4()}`;
      document.fullscreenElement.setAttribute('data-fllsrn-id', fullscreenReferId);
      return `[data-fllsrn-id=${fullscreenReferId}]`;
    }

    return `${prefix}${popContainerId}`;
  };

  const isAvaiableId = () => {
    const container = document.querySelector(getPrefixId());
    return container instanceof HTMLElement;
  };

  if (popContainerId === null || !isAvaiableId()) {
    popContainerId = `id_${uuidv4()}`;
    const popContainer = document.createElement('div');
    popContainer.setAttribute('id', popContainerId);
    popContainer.setAttribute('data-popper-id', popContainerId);
    document.body.append(popContainer);
  }

  const resetFullscreenElementTag = () => {
    if (document.fullscreenElement === null) {
      const query = `[data-fllsrn-id=${fullscreenReferId}]`;
      (document.querySelectorAll(query) ?? [])
        .forEach((element: { removeAttribute: (arg0: string) => void; }) => {
          element.removeAttribute('data-fllsrn-id');
        });
    }
  };

  return {
    popContainerId,
    prefixId: getPrefixId(),
    getPrefixId,
    resetFullscreenElementTag,
  };
};
