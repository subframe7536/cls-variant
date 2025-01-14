/* eslint-disable no-constant-binary-expression */
import { clsx } from 'clsx'
import { bench } from 'vitest'
import { cls } from '../dist/index'

const clsList: any[] = []
const clsxList: any[] = []

function cases(_: string, ...args: any[]) {
  clsList.push(...args)
  clsxList.push(...args)
}

cases(
  'Strings',
  'foo',
  '',
  'bar',
  'baz',
  'bax',
  'bux',
)

cases(
  'Arrays',
  ['foo', 'bar'],
  ['baz', 'bax', 'bux'],
)

cases(
  'Nested Arrays',
  ['foo', ['bar']],
  ['baz', ['bax', ['bux']]],
)

cases(
  'Nested Arrays w/ condition',
  ['foo', true && 'asd'],
  ['bax', false && ['asd', 'foo']],
)

cases(
  'Mixed',
  'foo',
  'bar',
  ['foo', true && 'asd'],
  ['bax', false && ['asd', 'foo']],
)

cases(
  'Mixed (Bad Data)',
  'foo',
  'bar',
  undefined,
  null,
  1,
  Number.NaN,
  () => { },
  { bax: true, bux: false, 123: true },
  ['baz', { bax: false, bux: true, abc: null }, {}],
)

bench('cls', () => {
  cls(clsList)
})

bench('clsx', () => {
  clsx(clsList)
})
