export const securityMiddleware = async (ctx, next) => {
  // X-Frame-Options: 防止点击劫持攻击（Clickjacking）
  // DENY: 完全禁止在 iframe 中加载
  // SAMEORIGIN: 只允许同源页面嵌入
  ctx.set('X-Frame-Options', 'SAMEORIGIN');

  // Content-Security-Policy: 现代浏览器使用 CSP 替代 X-Frame-Options
  // frame-ancestors 'self': 只允许同源页面嵌入
  ctx.set('Content-Security-Policy', "frame-ancestors 'self'");

  // X-Content-Type-Options: 防止 MIME 类型嗅探
  ctx.set('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection: 启用浏览器的 XSS 过滤器（旧版浏览器支持）
  ctx.set('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy: 控制 Referrer 信息泄露
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Strict-Transport-Security: 强制使用 HTTPS（如果部署在 HTTPS 环境下）
  if (ctx.secure || ctx.protocol === 'https') {
    ctx.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Permissions-Policy: 控制浏览器特性权限
  ctx.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  await next();
};
