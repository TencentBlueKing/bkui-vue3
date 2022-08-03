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

import ejs from 'ejs';
import { appendFile, existsSync, lstatSync, mkdirSync, readdir, readFileSync, unlinkSync } from 'fs';
import { join, parse, resolve } from 'path';
import Svgo from 'svgo';
// @ts-ignore
import svgpath from 'svgpath';
import { promisify } from 'util';
import * as xml2Js from 'xml-js';

import shape2path from './shape2path';
const license = `/*
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
*/`;
const renderTemplate = `
<%=license%>
import { FunctionalComponent } from 'vue';

import BkIcon, { IIconBaseProps } from './icon';
const data = JSON.parse('<%=svgInfo%>');
const <%=iconName%>: FunctionalComponent<IIconBaseProps> = (props, context) => {
  const p = { ...props, ...context.attrs };
  return <BkIcon {...p}  data={data} name="<%=iconName%>"></BkIcon>;
};

<%=iconName%>.displayName = '<%=iconName%>';
<%=iconName%>.inheritAttrs = false;

export default <%=iconName%>;
`.toString();

const indexTemplate = 'export { default as <%=iconName%> } from \'../icons/<%=fileName%>\';\n';
const compileDirUrl = resolve(__dirname, '../src/svg');

const cleaner = new Svgo({
  multipass: true,
  plugins: [
    {
      inlineStyles: {
        onlyMatchedOnce: false,
      },
    },
    {
      cleanupAttrs: true,
    },
    {
      removeDoctype: true,
    },
    {
      removeXMLProcInst: true,
    },
    {
      removeComments: true,
    },
    {
      removeMetadata: true,
    },
    {
      removeTitle: true,
    },
    {
      removeDesc: true,
    },
    {
      removeUselessDefs: true,
    },
    {
      removeEditorsNSData: true,
    },
    {
      removeEmptyAttrs: true,
    },
    {
      removeHiddenElems: true,
    },
    {
      removeEmptyText: true,
    },
    {
      removeEmptyContainers: true,
    },
    {
      removeViewBox: false,
    },
    {
      cleanupEnableBackground: true,
    },
    {
      convertStyleToAttrs: true,
    },
    {
      convertColors: true,
    },
    {
      convertPathData: false,
    },
    {
      convertTransform: true,
    },
    {
      removeUnknownsAndDefaults: true,
    },
    {
      removeNonInheritableGroupAttrs: true,
    },
    {
      removeUselessStrokeAndFill: true,
    },
    {
      removeUnusedNS: true,
    },
    {
      cleanupIDs: true,
    },
    {
      cleanupNumericValues: true,
    },
    {
      moveElemsAttrsToGroup: true,
    },
    {
      moveGroupAttrsToElems: true,
    },
    {
      removeRasterImages: false,
    },
    {
      mergePaths: false,
    },
    {
      convertShapeToPath: {
        convertArcs: true,
      },
    },
    {
      convertEllipseToCircle: true,
    },
    {
      sortAttrs: true,
    },
    {
      collapseGroups: true,
    },
    {
      removeDimensions: true,
    },
    {
      removeStyleElement: true,
    },
    {
      sortDefsChildren: true,
    },
    {
      reusePaths: false,
    },
    {
      removeAttrs: { attrs: '(stroke|fill|data-name)' },
    },
  ],
});

// 将特殊图形转换为path路径
const elemToPath = (node: any) => {
  const o = Object.assign({}, node);
  if (/(rect|circle|ellipse|polygon|polyline|line|path)/.test(o.name)) {
    o.attributes = Object.assign({}, o.attributes, {
      d: shape2path(o),
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const attr in o.attributes) {
      // Remove geometry properties not used
      if (/^(x|y|x1|y1|x2|y2|points|width|height|cx|cy|rx|ry|r)$/.test(attr)) {
        delete o.attributes[attr];
      }
    }
    o.name = 'path';
  } else if (o.elements && Array.isArray(o.elements)) {
    o.elements = o.elements.map(elemToPath);
  }
  return o;
};

// 将svg代码转换为vnode类格式
const transformSvg = async (url: string) => {
  try {
    const text = readFileSync(url, 'utf-8');
    let xmlJson = xml2Js.xml2json(text, {
      ignoreComment: true,
      ignoreDoctype: true,
      ignoreText: false,
    });
    let xmlDom = JSON.parse(xmlJson);
    if (text.includes('linearGradient')) {
      xmlDom.elements[0].attributes.style = ''
      + 'width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;';
      const str = JSON.stringify(xmlDom).split('\\n\\t')
        .join('');
      return JSON.parse(str);
    }
    // 转换图形
    xmlDom.elements[0] = elemToPath(xmlDom.elements[0]);
    const svgText = xml2Js.json2xml(JSON.stringify(xmlDom)).replace(/&/gm, '');
    const info = await cleaner.optimize(svgText || '').catch(() => ({ data: '' }));
    xmlJson = xml2Js.xml2json(info.data, {
      ignoreComment: true,
      ignoreDoctype: true,
      ignoreText: true,
    });
    xmlDom = JSON.parse(xmlJson);
    const [svgDom] = xmlDom.elements;
    const viewBoxList = svgDom.attributes.viewBox.split(' ');
    if (!(viewBoxList && viewBoxList.length === 4)) {
      return xmlDom;
    }
    const [,, x, y] = viewBoxList;
    const svgViewBox = {
      xScale: 1024 / (Math.min(x, y) || 1024),
      yScale: 1024 / (Math.min(x, y) || 1024),
    };
    xmlDom.elements[0].attributes.viewBox = `0 0 ${svgViewBox.xScale * x} ${svgViewBox.yScale * y}`;
    xmlDom.elements[0].attributes.style = ''
      + 'width: 1em; height: 1em; vertical-align: middle;fill: currentColor;overflow: hidden;';
    const tranformPath = (elements: any[]) => {
      elements.forEach((item) => {
        if (item.name === 'path') {
          const itemTransform = item.attributes.transform;
          if (itemTransform) {
            // eslint-disable-next-line no-param-reassign
            item.attributes.d = svgpath(item.attributes.d).transform(itemTransform)
              .toString();
            // eslint-disable-next-line no-param-reassign
            delete item.attributes.transform;
          }
          // eslint-disable-next-line no-param-reassign
          item.attributes.d = svgpath(item.attributes.d).scale(svgViewBox.xScale, svgViewBox.yScale)
            .toString();
          // 去除全背景
          if (item.attributes.d === 'M0 0L0 1024 1024 1024 1024 0z') {
            // eslint-disable-next-line no-param-reassign
            item.attributes.style = 'display: none';
          }
        }
        if (item.elements?.length) {
          tranformPath(item.elements);
        }
      });
    };
    tranformPath(svgDom.elements);
    return xmlDom;
  } catch (err) {
    process.exit(1);
  }
};

// 安全写入对应路径文件
const writeFileRecursive = async (url: string, content: string) => {
  let filepath = url.replace(/\\/g, '/');
  let root = '';
  if (filepath[0] === '/') {
    root = '/';
    filepath = filepath.slice(1);
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3);   // c:\
    filepath = filepath.slice(3);
  }

  const folders = filepath.split('/').slice(0, -1);  // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = `${acc + folder}/`;
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath);
      }
      return folderPath;
    },
    root,
  );
  if (existsSync(url)) unlinkSync(url);
  await promisify(appendFile)(url, content, 'utf-8');
};
// 编译指定目录
const compilerDir = async (dir: string): Promise<any> => {
  const files = await promisify(readdir)(dir);
  return await Promise.all(files.map((file: string) => {
    const url = join(dir, file);
    if (!/\.svg$/.test(url)) {
      return '';
    }
    if (lstatSync(url).isDirectory()) {
      return compilerDir(url);
    }
    return compileFile(url);
  }));
};
// 将ejs转换后的charcode转换为utf-8
const decodeHtmlEntity = function (x: string) {
  return x.replace(/&#(\d+);/gm, (_, dec) => String.fromCharCode(dec));
};
// 转换svg文件名称 aa-bb-cc => AaBbCc
const decodeSvgName = function (x: string) {
  return x.replace(/(-[a-zA-Z]{1})/g, (_, dec) => dec.replace('-', '').toUpperCase());
};

const compileFile = async (url: string) => {
  const urlInfo = parse(url);
  const { elements: [svgInfo] } = await transformSvg(url);
  const iconName = decodeSvgName(urlInfo.name).replace(/^([A-Z]{1})/, (_, dec) => dec.toLowerCase());
  const str = ejs.render(renderTemplate, { iconName, svgInfo: JSON.stringify(svgInfo), license }, {});
  await writeFileRecursive(resolve(__dirname, `../icons/${urlInfo.name}.tsx`), decodeHtmlEntity(str as string));
  return {
    iconName: iconName.replace(/^([a-z]{1})/, (_, dec) => dec.toUpperCase()),
    fileName: urlInfo.name,
  };
};

type SvgObj = ({iconName: string; fileName: string} | string)[];

const compileSvg = async () => {
  const bkIconStr = readFileSync(resolve(__dirname, '../src/components/icon.tsx'), 'utf-8');
  await writeFileRecursive(resolve(__dirname, '../icons/icon.tsx'), bkIconStr);
  const data: SvgObj =  await compilerDir(compileDirUrl);
  let indexStr = data.filter(data => data !== '').map(item => ejs.render(indexTemplate, item, {}))
    .join('');
  indexStr = `${license}\n${indexStr}`;
  await writeFileRecursive(resolve(__dirname, '../src/index.tsx'), indexStr);
  // todo build
};
compileSvg();
