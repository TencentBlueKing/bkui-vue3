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
import {
  throwError,
} from '../util';

@Controller('/api')
export default class McpController {
  @All('/mcp', { userControl: true })
  async mcp(ctx) {
    try {
      // 告诉 Koa 不要自动处理响应
      ctx.respond = false;
      // 创建 transport
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });
      ctx.res.on('close', () => {
        transport.close();
      });
      ctx.res.on('error', (error) => {
        transport.close();
        throwError(ctx, error);
      });
      // 连接 MCP server
      await mcpServer.connect(transport);
      // 处理请求
      await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
    } catch (error) {
      throwError(ctx, error);
    }
  }
}
