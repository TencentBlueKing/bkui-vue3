export const camelKey = (key: string) => key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export const camelToSnakeCase = (camelStr: string)  => {
  return camelStr
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()              
}