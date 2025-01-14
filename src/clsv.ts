/* eslint-disable prefer-template */
/* eslint-disable one-var */

import { mergeObjects } from './utils'

/**
 * Util type for getting variant props
 */
export type VariantProps<T extends (variant: Record<string, string>) => string> = Parameters<T>[0]

type VariantOptions<P> = {
  [K in keyof P]: keyof P[K]
}

export type VariantGenerator<T> = <P extends T = T>(variant: VariantOptions<P>) => string

/**
 * Concatenate class and variants
 *
 * @param cls basic classes
 * @param config variant config
 *
 * @example
 * ```ts
 * const button = clsv('btn', {
 *   size: {
 *     sm: 'text-sm px-2',
 *     md: 'text-base px-4',
 *     lg: 'text-lg px-6'
 *   },
 *   color: {
 *     primary: 'bg-blue-500',
 *     secondary: 'bg-gray-500'
 *   }
 * })
 *
 * button({ size: 'sm', color: 'primary'})
 * // 'btn text-sm px-2 bg-blue-500'
 * ```
 */
export function clsv<T extends Record<string, Record<string, string>>>(
  cls: string,
  config: T,
): VariantGenerator<T> {
  return (variant) => {
    let c = cls, i = 0, keys = Object.keys(variant) as (keyof T)[], k, len = keys.length
    for (; i < len; i++) {
      k = keys[i] as keyof T
      c += ' ' + (config[k][variant[k] as any] || '')
    }
    return c
  }
}

/**
 * Add default value for {@link clsv}
 *
 * @param variant variant function
 * @param dflt default config
 *
 * @example
 * ```ts
 * const defaultButton = clsvDefault(button, {
 *   size: 'text-base',
 *   color: 'bg-blue-500'
 * })
 *
 * defaultButton()
 * // 'btn text-base bg-blue-500'
 *
 * defaultButton({ size: 'text-lg' })
 * // 'btn text-lg bg-blue-500'
 * ```
 */
export function clsvDefault<T extends Record<string, Record<string, string>>>(
  variant: VariantGenerator<T>,
  dflt: VariantOptions<T>,
): (config?: Partial<VariantOptions<T>>) => string {
  return config => variant(mergeObjects(dflt, config || {}))
}

type Arrayable<T> = T | T[]

type CompoundVariantOptions<T extends Record<string, Record<string, string>>> = Array<[
  cls: string,
  conditions: { [K in keyof T]: Arrayable<keyof T[K]> },
]>

/**
 * Add compound config for {@link clsv}
 *
 * @param variant variant function
 * @param compound compound variant config
 *
 * @example
 * ```ts
 * const compoundButton = clsvCompound(button, [
 *   ['shadow', { size: 'md', color: 'primary' }],
 *   ['rounded', { size: 'lg', color: ['primary', 'secondary'] }],
 * ])
 *
 * compoundButton({ size: 'lg', color: 'primary' })
 * // 'btn text-sm px-2 bg-blue-500 rounded'
 * ```
 */
export function clsvCompound<T extends Record<string, Record<string, string>>>(
  variant: VariantGenerator<T>,
  compound: CompoundVariantOptions<T>,
): VariantGenerator<T> {
  return (config) => {
    let result = variant(config), i = 0, len = compound.length
    for (; i < len; i++) {
      let [cls, variantConfig] = compound[i], match = true, keys = Object.keys(variantConfig), j = 0, kLen = keys.length
      for (; j < kLen; j++) {
        let k = keys[j], val = config[k] as string, expected = variantConfig[k] as Arrayable<string>
        if (val !== expected && !expected.includes(val)) {
          match = false
          break
        }
      }
      match && (result += ' ' + cls)
    }
    return result
  }
}
