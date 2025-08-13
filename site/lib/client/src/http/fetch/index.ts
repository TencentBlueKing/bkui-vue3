/* eslint-disable no-param-reassign */

import errorInterceptor from './error-interceptor';
import RequestError from './request-error';
import successInterceptor from './success-interceptor';

import {
  deepMerge,
} from '@/common/util';

export interface IFetchConfig extends RequestInit {
  requestType?: 'json' | 'formData',
  responseType?: 'json' | 'text' | 'formData' | 'file' | 'blob' | 'javascript',
  globalError?: Boolean,
  signal?: AbortSignal,
  withoutSpace?: boolean,
  noCheckPermission?: boolean,
}

type HttpMethod = <T>(url: string, payload?: any, config?: IFetchConfig) => Promise<T>;

interface IHttp {
  get?: HttpMethod;
  post?: HttpMethod;
  put?: HttpMethod;
  delete?: HttpMethod;
  head?: HttpMethod;
  options?: HttpMethod;
  patch?: HttpMethod;
}

// Content-Type
const contentTypeMap = {
  json: 'application/json',
  text: 'text/plain',
  formData: 'multipart/form-data',
  javascript: 'application/javascript',
};
const methodsWithoutData = ['delete', 'get', 'head', 'options'];
const methodsWithData = ['post', 'put', 'patch'];
const allMethods = [...methodsWithoutData, ...methodsWithData];

// 拼装发送请求配置
const getFetchConfig = (method: string, payload: any, config: IFetchConfig) => {
  const headers: Record<string, string> = {
    'X-Requested-With': 'fetch',
  };

  if (config.requestType !== 'formData') {
    headers['Content-Type'] = contentTypeMap[config.requestType] || 'application/json';
  }

  // 合并配置
  let fetchConfig: IFetchConfig = deepMerge(
    {
      method: method.toLocaleUpperCase(),
      mode: 'cors',
      cache: 'default',
      credentials: 'include',
      headers,
      redirect: 'follow',
      referrerPolicy: 'no-referrer-when-downgrade',
      responseType: 'json',
      globalError: true,
    },
    config,
  );
  // merge payload
  if (methodsWithData.includes(method)) {
    fetchConfig = deepMerge(fetchConfig, { body: config.requestType === 'formData' ?  payload : JSON.stringify(payload) });
  } else {
    fetchConfig = deepMerge(fetchConfig, payload);
  }
  return fetchConfig;
};

// 拼装发送请求 url
const getFetchUrl = (url: string, method: string, payload: any = {}) => {
  try {
    // 基础 url
    const baseUrl = location.origin;
    // 构造 url 对象
    const urlObject: URL = new URL(url, baseUrl);
    // add path
    const configPath = window.SITE_URL + process.env.BK_AJAX_URL_PREFIX;
    const subPath = configPath.endsWith('/') ? configPath.slice(0, -1) : configPath;
    urlObject.pathname = subPath + urlObject.pathname;
    if (methodsWithoutData.includes(method)) {
      const appendSearchParams = (key: string, value: string) => {
        if (!['', undefined, null].includes(value)) {
          urlObject.searchParams.append(key, value);
        }
      };
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        appendSearchParams(key, value);
      });
    }

    return urlObject.href;
  } catch (error: any) {
    throw new RequestError(-1, error.message);
  }
};

// 在自定义对象 http 上添加各请求方法
const http: IHttp = {};
allMethods.forEach((method) => {
  Object.defineProperty(http, method, {
    get() {
      return async (url: string, payload: any, config: IFetchConfig = {}) => {
        const fetchConfig: IFetchConfig = getFetchConfig(method, payload, config);
        try {
          const fetchUrl = getFetchUrl(url, method, payload);
          const response = await fetch(fetchUrl, fetchConfig);
          return await successInterceptor(response, fetchConfig);
        } catch (err) {
          return errorInterceptor(err, fetchConfig);
        }
      };
    },
  });
});

export default http;
