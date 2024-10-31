/* eslint-disable one-var */
export type ClassValue = ClassValueArray | string | number | bigint | null | boolean | undefined
export type ClassValueArray = ClassValue[]
/**
 * Concatenate classes
 * @param args classes
 * @example
 * ```ts
 * cls('btn', ['rounded', ['bg-black']], true && 'b-2', null. 0. false && ['text-red'])
 * // 'btn rounded bg-black b-2'
 * ```
 */
export function cls(...args: ClassValueArray): string {
  let i = 0, tmp, str = '', len = args.length
  for (; i < len; i++) {
    (tmp = args[i])
    && (tmp as string).at
    && (
      str += (str && ' ') + (
        Array.isArray(tmp)
          ? cls(...(tmp as ClassValueArray))
          : tmp
      )
    )
  }
  return str
}
