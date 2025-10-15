/**
 * @description 本地存储 hook
 * @returns {Object} Storage methods
 */
export default function useStorage() {
  const setStorage = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

   const getStorage = (key: string) => {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const removeStorage = (key: string) => {
    localStorage.removeItem(key);
  };

  return {
    setStorage,
    getStorage,
    removeStorage,
  };
}
