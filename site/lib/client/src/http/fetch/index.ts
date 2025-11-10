/* eslint-disable no-param-reassign */

import {
  deepMerge,
  isObject,
} from '@/common/util';

import errorInterceptor from './error-interceptor';
import RequestError from './request-error';
import successInterceptor from './success-interceptor';

export interface IFetchConfig extends RequestInit {
  requestType?: 'json' | 'formData',
  responseType?: 'json' | 'text' | 'formData' | 'file' | 'blob' | 'javascript',
  globalError?: boolean,
  signal?: AbortSignal,
  withoutSpace?: boolean,
  noCheckPermission?: boolean,
  cancelPrevious?: boolean,
  requestKey?: string,
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
const pendingRequests = new Map<string, AbortController>();

// 拼装发送请求配置
const getFetchConfig = (method: string, payload: any, config: IFetchConfig) => {
  const {
    cancelPrevious: _cancelPrevious,
    requestKey: _requestKey,
    ...restConfig
  } = config;

  const requestSignal = restConfig.signal;

  const headers: Record<string, string> = {
    'X-Requested-With': 'fetch',
  };

  if (restConfig.requestType !== 'formData') {
    headers['Content-Type'] = contentTypeMap[restConfig.requestType] || 'application/json';
  }

  // 合并配置
  const defaultConfig: Record<string, unknown> = {
    method: method.toLocaleUpperCase(),
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer-when-downgrade',
    responseType: 'json',
    globalError: true,
  };

  let fetchConfig = deepMerge<Record<string, unknown>>(
    defaultConfig,
    restConfig as unknown as Record<string, unknown>,
  ) as IFetchConfig;

  // merge payload
  if (methodsWithData.includes(method)) {
    fetchConfig.body = restConfig.requestType === 'formData' ? payload : JSON.stringify(payload);
  } else if (isObject(payload)) {
    fetchConfig = deepMerge<Record<string, unknown>>(
      fetchConfig as unknown as Record<string, unknown>,
      payload as Record<string, unknown>,
    ) as IFetchConfig;
  }

  if (requestSignal) {
    fetchConfig.signal = requestSignal;
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
        const fetchUrl = getFetchUrl(url, method, payload);
        const finalConfig: IFetchConfig = { ...config };
        let requestKey: string | undefined;
        let controller: AbortController | undefined;

        if (finalConfig.cancelPrevious) {
          requestKey = finalConfig.requestKey || `${method.toLocaleUpperCase()}::${fetchUrl}`;
          const pendingController = pendingRequests.get(requestKey);
          if (pendingController) {
            pendingController.abort();
          }
          controller = new AbortController();
          pendingRequests.set(requestKey, controller);
          if (!finalConfig.signal) {
            finalConfig.signal = controller.signal;
          }
        }

        const fetchConfig: IFetchConfig = getFetchConfig(method, payload, finalConfig);
        try {
          const response = await fetch(fetchUrl, fetchConfig);
          return await successInterceptor(response, fetchConfig);
        } catch (err) {
          return errorInterceptor(err, fetchConfig);
        } finally {
          if (requestKey) {
            const current = pendingRequests.get(requestKey);
            if (current === controller) {
              pendingRequests.delete(requestKey);
            }
          }
        }
      };
    },
  });
});

export default http;
