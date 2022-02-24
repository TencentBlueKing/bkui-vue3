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

interface IRectAttrs {
  width: number | string;
  height: number | string;
  x: number | string;
  y: number | string;
  rx: number | string;
  ry: number | string;
}
interface ICircleAttrs {
  cx: number | string;
  cy: number | string;
  rx: number | string;
  ry: number | string;
  r:  number | string;
}
interface ILineAttrs {
  x1: number | string;
  y1: number | string;
  x2: number | string;
  y2: number | string;
}
interface IPolyAttrs {
  points: string;
}
const chunkArray = (arr: string[], size = 2) => {
  const results = [];
  while (arr.length) {
    results.push(arr.splice(0, size));
  }
  return results;
};

const calcValue = (val: string, base: number) => (/%$/.test(val) ? (Number(val.replace('%', '')) * 100) / base : +val);

const rect = (attrs: IRectAttrs) => {
  const w = +attrs.width;
  const h = +attrs.height;
  const x = attrs.x ? +attrs.x : 0;
  const y = attrs.y ? +attrs.y : 0;
  let rx = attrs.rx || 'auto';
  let ry = attrs.ry || 'auto';
  if (rx === 'auto' && ry === 'auto') {
    rx = 0;
    ry = 0;
  } else if (rx !== 'auto' && ry === 'auto') {
    rx = calcValue(rx.toString(), w);
    ry = rx;
  } else if (ry !== 'auto' && rx === 'auto') {
    ry = calcValue(ry.toString(), h);
    rx = ry;
  } else {
    rx = calcValue(rx.toString(), w);
    ry = calcValue(ry.toString(), h);
  }
  if (rx > w / 2) {
    rx = w / 2;
  }
  if (ry > h / 2) {
    ry = h / 2;
  }
  const hasCurves = rx > 0 && ry > 0;
  return [
    `M${x + rx} ${y}`,
    `H${x + w - rx}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}`] : []),
    `V${y + h - ry}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}`] : []),
    `H${x + rx}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}`] : []),
    `V${y + ry}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + rx} ${y}`] : []),
    'z',
  ];
};

const ellipse = (attrs: ICircleAttrs) => {
  const cx = +attrs.cx;
  const cy = +attrs.cy;
  const rx = attrs.rx ? +attrs.rx : +attrs.r;
  const ry = attrs.ry ? +attrs.ry : +attrs.r;
  return [
    `M${cx + rx} ${cy}`,
    `A${rx} ${ry} 0 0 1 ${cx} ${cy + ry}`,
    `A${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`,
    `A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
    'z',
  ];
};

const line = ({ x1, y1, x2, y2 }: ILineAttrs) => [`M${+x1} ${+y1}`, `L${+x2} ${+y2}`];

const poly = (attrs: IPolyAttrs) => {
  const { points } = attrs;
  const pointsArray = points
    .trim()
    .split(' ')
    .reduce((arr: string[], point: string) => [...arr, ...(point.includes(',') ? point.split(',') : [point])], []);

  const pairs = chunkArray(pointsArray, 2);
  return pairs.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`);
};

const toPathString = (d: string[] | string) => (Array.isArray(d) ? d.join(' ') : '');

const convertShapeToPath = (
  node: Record<string, any>,
  {
    nodeName = 'name',
    nodeAttrs = 'attributes',
  } = {},
) => {
  const name = node[nodeName];
  const attributes = node[nodeAttrs];
  let d;
  if (name === 'rect') {
    d = rect(attributes);
  }

  if (name === 'circle' || name === 'ellipse') {
    d = ellipse(attributes);
  }

  if (name === 'line') {
    d = line(attributes);
  }

  if (name === 'polyline') {
    d = poly(attributes);
  }

  if (name === 'polygon') {
    d = [...poly(attributes), 'Z'];
  }

  if (name === 'path') {
    return attributes.d;
  }

  return toPathString(d || '');
};

export default convertShapeToPath;
