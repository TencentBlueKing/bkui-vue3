import type { IFileAuthor, INavGroups } from '@/types/component';

import fetch from './fetch';

const apiPrefix = '/api';

interface IRequestOptions {
  requestKey?: string;
}

// 获取版本列表
export const getVersions = () => fetch
  .get<string[]>(`${apiPrefix}/versions`);

// 获取文件作者列表
export const getFileAuthors = (name: string, type: string) => fetch
  .get<IFileAuthor[]>(`${apiPrefix}/authors`, { name, type });

// 获取组件wiki
export const getComponent = (
  component: string,
  version: string,
  type: string,
  options: IRequestOptions = {},
) => fetch
  .get<string>(
    `${apiPrefix}/component`,
    { component, version, type },
    {
      responseType: 'javascript',
      cancelPrevious: true,
      requestKey: options.requestKey || `component:${type}`,
    },
  )
  .then((scriptText) => {
    const Fn = Function;
    const run = new Fn(scriptText);
    run();
  });

// 获取组件css
export const getCss = (
  component: string,
  version: string,
  type: string,
  options: IRequestOptions = {},
) => fetch
  .get<string>(
    `${apiPrefix}/css`,
    { component, version, type },
    {
      cancelPrevious: true,
      requestKey: options.requestKey || `css:${type}`,
    },
  )
  .then((css) => {
    const style = document.createElement('style');
    style.textContent = css;
    style.type = 'text/css';
    style.id = `bkui-vue3-${component}-${version}`;
    // 如果已经存在，则先移除
    const existingStyle = document.getElementById(style.id);
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    document.head.appendChild(style);
  });

// 获取设计规范
export const getDesign = (name: string) => fetch
  .get<string>(`${apiPrefix}/design`, { name });

// 获取 markdown 内容
export const getNpmMarkdown = (name: string) => fetch
  .get<string>(`${apiPrefix}/npm/markdown`, { name });

// 获取组件列表
export const getNavGroups = (version: string) => fetch
  .get<INavGroups>(`${apiPrefix}/nav/groups`, { version });

