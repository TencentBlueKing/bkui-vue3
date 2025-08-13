import type { INavGroups } from '@/types/component';

import fetch from './fetch';

const apiPrefix = '/api';

// 获取版本列表
export const getVersions = () => fetch
  .get<string[]>(`${apiPrefix}/component/versions`);

// 获取文件作者列表
export const getFileAuthors = (filePath: string) => fetch
  .get<string[]>(`${apiPrefix}/component/authors`, { filePath });

// 获取组件wiki
export const getComponent = (
  component: string,
  version: string,
) => {
  const url = `${apiPrefix}/component?component=${component}&version=${version}`;
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  document.body.appendChild(script);
  return new Promise<void>((resolve, reject) => {
    script.onload = () => {
      resolve();
    };
    script.onerror = (error) => {
      reject(error);
    };
  }).finally(() => {
    // 清理脚本元素
    document.body.removeChild(script);
  });
};

// 获取组件css
export const getCss = (
  component: string,
  version: string,
) => {
  const url = `${apiPrefix}/css?component=${component}&version=${version}`;
  return fetch
    .get<string>(url)
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
};

// 获取组件列表
export const getNavGroups = (version: string) => fetch
  .get<INavGroups>(`${apiPrefix}/nav/groups`, { version });

// 删除版本缓存
export const deleteReleaseCache = (version: string) => fetch
  .get(`${apiPrefix}/release/delete`, { version });
