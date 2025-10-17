export function isObject(o: unknown): o is object {
  return Object.prototype.toString.call(o) === '[object Object]'
}
