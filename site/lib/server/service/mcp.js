import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';
import { z } from "zod";
import { getReleaseDistPath, getLatestVersion, getComponentInfo } from './component.js';

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
  }
);

mcpServer.registerTool(
  "get-component",
  {
    title: "Get bkui-vue Component Information",
    description: "Retrieves comprehensive information about a bkui-vue UI component, including its API documentation, properties, events, methods, slots, and usage examples. Use this tool when you need to understand how to use a specific bkui-vue component (e.g., Button, Table, Dialog, Form, etc.) in a Vue3 application. The component information includes TypeScript definitions, prop specifications with types and default values, event handlers, and practical code examples.",
    inputSchema: { 
      name: z.string().describe("The component name (e.g., 'button', 'table', 'dialog', 'form')"), 
      version: z.string().optional().describe("Optional version of the component library. If not specified, uses the latest version.") 
    },
  },
  async ({ name, version }) => {
    const releaseDistPath = await getReleaseDistPath(version || await getLatestVersion());
    const componentInfo = await getComponentInfo(releaseDistPath, name, version);
    return {
      content: [{ type: 'text', text: JSON.stringify(componentInfo) }],
      structuredContent: componentInfo,
    };
  }
);

export { mcpServer, StreamableHTTPServerTransport, randomUUID };
