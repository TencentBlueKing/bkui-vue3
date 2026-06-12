import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

// import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getComponentInfo, getLatestVersion, getNavGroups, getReleaseDistPath, getReleaseZipPath } from './component';

// 存储 transport 实例，用于多会话管理
const transports = new Map();

// 创建 MCP Server 实例
export const createServer = () => {
  // 创建 MCP Server 实例
  const mcpServer = new McpServer(
    {
      name: 'bkui-vue-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  mcpServer.registerTool(
    'get-component',
    {
      title: 'Get bkui-vue Component Information',
      description:
        'Retrieves comprehensive information about a bkui-vue UI component, including its API documentation, properties, events, methods, slots, and usage examples. Use this tool when you need to understand how to use a specific bkui-vue component (e.g., Button, Table, Dialog, Form, etc.) in a Vue3 application. The component information includes TypeScript definitions, prop specifications with types and default values, event handlers, and practical code examples.',
      inputSchema: {
        name: z.string().describe('The component name (e.g., \'button\', \'table\', \'dialog\', \'form\')'),
        version: z
          .string()
          .optional()
          .describe('Optional version of the component library. If not specified, uses the latest version.'),
      },
    },
    async ({ name, version }) => {
      const releaseDistPath = await getReleaseDistPath(version || (await getLatestVersion()));
      const componentInfo = await getComponentInfo(releaseDistPath, name);
      return {
        content: [{ type: 'text', text: JSON.stringify(componentInfo) }],
        structuredContent: componentInfo,
      };
    },
  );

  mcpServer.registerTool(
    'get-component-list',
    {
      title: 'Get bkui-vue Component List',
      description: 'Retrieves a list of all bkui-vue UI components, including their names, titles, descriptions. Use this tool when you need to understand the available components in the bkui-vue library.',
      inputSchema: {
        version: z.string().optional()
          .describe('Optional version of the component library. If not specified, uses the latest version.'),
      },
    },
    async ({ version }) => {
      const releaseZipPath = await getReleaseZipPath(version || (await getLatestVersion()));
      const navGroups = await getNavGroups(releaseZipPath);
      const components = Object
        .values(navGroups.componentGroupMap)
        .flat()
        .map(item => ({
          name: item.name,
          title: item.title,
          description: item.description,
        }));
      const directives = navGroups.directiveList.map(item => ({
        name: item.name,
        title: item.title,
        description: item.description,
      }));
      return {
        content: [{ type: 'text', text: JSON.stringify({ components, directives }) }],
        structuredContent: { components, directives },
      };
    },
  );

  mcpServer.registerTool(
    'get-components-batch',
    {
      title: 'Get Multiple bkui-vue Components Information',
      description:
        'Retrieves comprehensive information for multiple bkui-vue UI components in a single request. This is more efficient than calling get-component multiple times. Returns detailed API documentation, properties, events, methods, slots, and usage examples for each requested component.',
      inputSchema: {
        names: z
          .array(z.string())
          .describe('Array of component names to retrieve (e.g., [\'button\', \'table\', \'dialog\'])'),
        version: z
          .string()
          .optional()
          .describe('Optional version of the component library. If not specified, uses the latest version.'),
      },
    },
    async ({ names, version }) => {
      const releaseDistPath = await getReleaseDistPath(version || (await getLatestVersion()));

      // 并行获取所有组件信息
      const componentInfoPromises = names.map(async (name) => {
        try {
          const info = await getComponentInfo(releaseDistPath, name);
          return { name, info, error: null };
        } catch (error) {
          return { name, info: null, error: error.message || '组件不存在' };
        }
      });

      const results = await Promise.all(componentInfoPromises);

      // 分离成功和失败的结果
      const successResults = results.filter(r => r.error === null);
      const failedResults = results.filter(r => r.error !== null);

      const responseData = {
        success: successResults.map(r => ({ name: r.name, ...r.info })),
        failed: failedResults.map(r => ({ name: r.name, error: r.error })),
        summary: {
          total: names.length,
          success: successResults.length,
          failed: failedResults.length,
        },
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(responseData, null, 2) }],
        structuredContent: responseData,
      };
    },
  );

  return mcpServer;
};

// 创建 transport 实例
export const createTransport = () => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId) => {
      transports.set(sessionId, transport);
    },
    onsessionclosed: (sessionId) => {
      transports.delete(sessionId);
    },
  });

  transport.onclose = () => {
    if (transport.sessionId) {
      transports.delete(transport.sessionId);
    }
  };

  transport.onerror = (error) => {
    console.error('[MCP Controller] Transport error:', error);
  };

  return transport;
};

// 获取 transport 实例
export const getTransport = (sessionId) => {
  return transports.get(sessionId);
};

// 判断请求是否是初始化请求
export const isInitializeRequest = (body) => {
  return body.jsonrpc === '2.0' && body.method === 'initialize';
};
