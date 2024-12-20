## cls-variant

Lightweight alternative to `clsx`, treeshakable alterantive to `cva`

## Install

```shell
npm i cls-variant
```
```shell
yarn add cls-variant
```
```shell
pnpm add cls-variant
```

## Usage

```ts
import { cls, clsv, clsvDefault } from 'cls-variant'

cls('btn', ['rounded', ['bg-black']], true && 'b-2', null, 0, false && ['text-red'])
// 'btn rounded bg-black b-2'

const button = clsv('btn', {
  size: {
    sm: 'text-sm px-2',
    md: 'text-base px-4',
    lg: 'text-lg px-6'
  },
  color: {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500'
  }
})

button({ size: 'sm', color: 'primary' })
// 'btn text-sm px-2 bg-blue-500'

const defaultButton = clsvDefault(button, {
  size: 'sm',
  color: 'primary'
})

defaultButton()
// 'btn text-sm px-2 bg-blue-500'

defaultButton({ size: 'lg' })
// 'btn text-lg px-6 bg-blue-500'

const compoundButton = clsvCompound(button, [
  ['shadow', { size: 'md', color: 'primary' }],
  ['rounded', { size: 'lg', color: ['primary', 'secondary'] }],
])

compoundButton({ size: 'lg', color: 'primary' })
// 'btn text-sm px-2 bg-blue-500 rounded'
```

### Util Type

```ts
import type { VariantProps } from 'cls-variant'

type ButtonVariant = VariantProps<typeof button>
```

## Size

```shell
> npx export-size .
export-size    v0.7.0
esbuild        v0.19.5

cls-variant v0.2.0

┌──────────────┬────────────┐
│ export       │ min+brotli │
│              │            │
│ clsvCompound │      169 B │
│ cls          │      115 B │
│ clsv         │      110 B │
│ clsvDefault  │       61 B │
└──────────────┴────────────┘
```

## Benchmark

```
 ✓ tests/class.bench.ts (2) 1614ms
     name            hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · cls   1,199,726.38  0.0006  0.9709  0.0008  0.0008  0.0018  0.0019  0.0046  ±0.76%   599864   fastest
   · clsx  1,169,272.88  0.0006  0.5994  0.0009  0.0008  0.0017  0.0018  0.0055  ±0.86%   584637

 BENCH  Summary

  cls - tests/class.bench.ts
    1.03x faster than clsx
```
