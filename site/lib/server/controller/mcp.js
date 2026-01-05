import { Controller, Post, Get, Delete, Ctx, OutputMcp, OutputJson } from '../decorator';
import { createServer, createTransport, getTransport, isInitializeRequest } from '../service/mcp';
import { throwError, throwMcpError } from '../util';

@Controller('/api')
export default class McpController {
  @Get('/mcp', { userControl: true })
  async getMcp(ctx) {
    // 告诉 Koa 不要自动处理响应
    ctx.respond = false;

    // 根据 sessionId 获取 transport
    const sessionId = ctx.query.sessionId || ctx.headers['mcp-session-id'];
    let transport = getTransport(sessionId);

    // 如果 transport 不存在，则返回错误
    if (!transport) {
      throwMcpError(ctx, new BusinessError('Invalid or missing session ID', 400, 400));
      return;
    }

    try {
      await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
    } catch (error) {
      throwMcpError(ctx, error);
    }
  }

  @Post('/mcp', { userControl: true })
  async postMcp(ctx) {
    try {
      // 告诉 Koa 不要自动处理响应
      ctx.respond = false;

      // 根据 sessionId 获取或创建 transport
      const sessionId = ctx.query.sessionId || ctx.headers['mcp-session-id'];
      let transport;

      // 如果是新连接或没有找到 transport，创建新的
      if (sessionId && getTransport(sessionId)) {
        transport = getTransport(sessionId);
      } else if (!sessionId && isInitializeRequest(ctx.request.body)) {
        transport = createTransport();

        // 连接 MCP server
        await createServer().connect(transport);
      } else {
        throwMcpError(ctx, new BusinessError('Bad Request: No valid session ID provided', -32000, 400));
        return;
      }
      // 处理请求
      await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
    } catch (error) {
      throwMcpError(ctx, error);
    }
  }

  @Delete('/mcp', { userControl: true })
  async deleteMcp(ctx) {
    // 告诉 Koa 不要自动处理响应
    ctx.respond = false;

    // 根据 sessionId 获取 transport
    const sessionId = ctx.query.sessionId || ctx.headers['mcp-session-id'];
    let transport = getTransport(sessionId);

    // 如果 transport 不存在，则返回错误
    if (!transport) {
      throwMcpError(ctx, new BusinessError('Invalid or missing session ID', 400, 400));
      return;
    }

    try {
      await transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
    } catch (error) {
      throwMcpError(ctx, error);
    }
  }
}
