export const errorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { status } = err;
    const message = err.message || '服务器内部出错';

    // 程序出错异常
    if (CODE.HTTP.indexOf(status)) {
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.status,
        message,
      };
    } else {
      const code = err.code || CODE.BIZ.NOT_DEFINED;
      ctx.body = {
        code,
        message,
      };
    }

    ctx.app.emit('error', err, ctx);
  }
};
