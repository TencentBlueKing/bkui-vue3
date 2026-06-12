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
import http from '../../util/http';

const COMMITS_API = 'https://api.github.com/repos/TencentBlueKing/bkui-vue3/commits';

// 获取指定文件的提交作者列表（去重、去空）
export const getFileAuthors = async (filePath) => {
  try {
    const headers = {};
    if (process.env.BK_GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.BK_GITHUB_TOKEN}`;
    } else {
      console.warn('⚠️  未配置 GITHUB_TOKEN，使用未认证请求（速率限制：60次/小时）');
    }

    const commits = await http.get(COMMITS_API, {
      params: { path: filePath },
      headers,
    });

    if (!Array.isArray(commits)) {
      console.error('GitHub API 返回数据格式异常');
      return [];
    }

    return commits.reduce((acc, cur) => {
      if (cur.author?.login && acc.findIndex(item => item.login === cur.author.login) < 0) {
        acc.push({
          login: cur.author.login,
          avatar: cur.author.avatar_url,
        });
      }
      return acc;
    }, []);
  } catch (error) {
    console.error('获取文件作者失败:', error.message);
    if (error.response?.status === 403) {
      console.error('❌ GitHub API 速率限制！请配置 GITHUB_TOKEN 或等待限制重置');
    }
    return [];
  }
};
