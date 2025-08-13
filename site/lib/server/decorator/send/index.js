import {
  send,
  throwError,
} from '../../util';

/**
 * 输出 json
 */
export const OutputJson = (options = { decorator: true }) => (target, propertyKey, descriptor) => {
  const originValue = descriptor.value;
  descriptor.value = async (ctx) => {
    try {
      const data = await originValue.apply(this, [ctx]);
      let outputData = data;
      if (options.decorator) {
        outputData = { code: 0, message: 'success', data };
      }
      send(ctx, outputData);
    } catch (error) {
      throwError(ctx, error);
    }
  };
};

/**
 * 输出 javascript
 */
export const OutputJavascript = () => (target, propertyKey, descriptor) => {
  const originValue = descriptor.value;
  descriptor.value = async (ctx) => {
    try {
      const data = await originValue.apply(this, [ctx]);
      ctx.set('Content-Type', 'application/javascript');
      ctx.body = data;
    } catch (error) {
      throwError(ctx, error);
    }
  };
};

