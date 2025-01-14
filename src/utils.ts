/* eslint-disable one-var */
export function mergeObjects<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  let result = { ...obj1 }, k, v
  for (k in obj2) {
    v = obj2[k as keyof U]
    if (v !== undefined && v !== null) {
      (result as any)[k] = v
    }
  }
  return result as T & U
}
