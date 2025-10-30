import {
  Controller,
  All,
  Ctx,
  OutputMcp,
  OutputJson,
} from '../decorator';
import {
  mcpServer,
  StreamableHTTPServerTransport,
  randomUUID,
} from '../service/mcp';

// 存储 transport 实例，用于多会话管理
const transports = new Map();

@Controller('/api')
export default class McpController {
  @All('/mcp', { userControl: true })
  async mcp(ctx) {
    // 告诉 Koa 不要自动处理响应
    ctx.respond = false;

    // 根据 sessionId 获取或创建 transport
    const sessionId = ctx.query.sessionId || ctx.headers['mcp-session-id'];
    let transport = sessionId ? transports.get(sessionId) : null;

    // 如果是新连接或没有找到 transport，创建新的
    if (!transport) {
      transport = new StreamableHTTPServerTransport({
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

      // 连接 MCP server
      await mcpServer.connect(transport);
    }

    await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
  }
}
