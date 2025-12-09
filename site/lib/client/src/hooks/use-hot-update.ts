if (window.WebSocket && process.env.NODE_ENV === 'development') {
  // 查找 dev server 注入的 socket
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const address = `${protocol}://${window.location.host}/ws`;
  const ws = new window.WebSocket(address);

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'content-changed') {
        hotUpdateFunctions.forEach(async (fn) => {
          if (typeof fn === 'function') {
            await fn();
          }
        });
      }
    } catch (error) {
      console.error('Error hot update:', error);
    }
  });
}

const hotUpdateFunctions: (() => void)[] = [];

export const useHotUpdate = () => {
  const addHotUpdateFunction = (fn: () => void) => {
    hotUpdateFunctions.push(fn);
  };

  const removeHotUpdateFunction = (fn: () => void) => {
    const index = hotUpdateFunctions.indexOf(fn);
    hotUpdateFunctions.splice(index, 1);
  };

  return {
    addHotUpdateFunction,
    removeHotUpdateFunction,
  };
};
