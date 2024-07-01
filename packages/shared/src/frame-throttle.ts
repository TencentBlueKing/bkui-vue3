export type Cancellable<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  /**
   * Cancel the next scheduled invocation of the callback.
   */
  cancel(): void;
};

type WindowWithoutRAF = Omit<Window, 'requestAnimationFrame'>;

type WrapperState = {
  cancelToken: number;
  callbackThis?: any;
  args?: any[];
};

const wrapperFactory = function () {
  const state: WrapperState = {
    cancelToken: 0,
  };

  const resetCancelToken = () => {
    state.cancelToken = 0;
  };

  const wrapper = <T extends Function>(cbThis: any, cb: T, ...args: any[]) => {
    state.callbackThis = cbThis;
    state.args = args;

    if (state.cancelToken) {
      return;
    }

    if ('requestAnimationFrame' in window) {
      state.cancelToken = window.requestAnimationFrame(() => {
        cb.apply(state.callbackThis, state.args);
        resetCancelToken();
      });
    } else {
      cb.apply(state.callbackThis, state.args);
      state.cancelToken = (window as WindowWithoutRAF).setTimeout(resetCancelToken, 1000 / 60); // 60 fps
    }
  };

  wrapper.cancel = () => {
    if ('requestAnimationFrame' in window) {
      window.cancelAnimationFrame(state.cancelToken);
    }
    window.clearTimeout(state.cancelToken);
    resetCancelToken();
  };

  return wrapper as Cancellable<typeof wrapper>;
};

const throttleFactory = function <T extends (...args: any[]) => void>(
  callback: T,
  thisArg?: any,
  ...argArray: any[]
): Cancellable<T> {
  const wrapper = wrapperFactory();
  const argCount = arguments.length;
  const throttledCallback = function (...args: Parameters<T>) {
    // @ts-ignore
    wrapper(argCount > 1 ? thisArg : this, callback, ...argArray, ...args);
  };
  throttledCallback.cancel = () => wrapper.cancel();
  return throttledCallback;
};

/**
 * Returns a throttled function which runs once per rendered frame using
 * requestAnimationFrame. If window.requestAnimationFrame does not exist,
 * the behavior will be approximated using setTimeout.
 *
 * @param callback the function to be throttled
 */
export const throttle = <T extends (...args: any[]) => void>(callback: T): Cancellable<T> => {
  const throttledCallback = throttleFactory(callback);

  // Override `bind()` to create a new throttled callback, otherwise both
  // the unbound and bound callbacks will have the same scope.
  throttledCallback.bind = throttleFactory.bind(null, callback);

  return throttledCallback;
};
