/* eslint-disable one-var */
export type VariantProps<T extends (variant: Record<string, string>) => string> = Parameters<T>[0]

/**
 * Concatenate class and variants
 *
 * @param base basic classes
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
  base: string,
  config: T,
): (variant: { [K in keyof T]: keyof T[K] }) => string {
  return (variant) => {
    let i = 0, k: keyof T, keys = Object.keys(variant) as (keyof T)[], len = keys.length
    for (k = keys[i] as keyof T; i < len; i++) {
      base += ` ${config[k][variant[k]]}`
    }
    return base
  }
}

/**
 * Add default value for {@link clsv}
 * @param variant variant function
 * @param dflt default config
 * @example
 * ```ts
 * const defaultButton = variantDefault(buttonVariant, {
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
export function variantDefault<T extends Record<string, string>>(
  variant: (variant: T) => string,
  dflt: T,
): (config?: Partial<T>) => string {
  return config => variant({ ...dflt, ...config })
}
