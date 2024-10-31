/* eslint-disable no-constant-binary-expression */
import { describe, expect, it } from 'vitest'
import { cls, clsv, variantDefault } from '../src'

describe('cls', () => {
  it('strings', () => {
    expect(cls('')).toBe('')
    expect(cls('foo')).toBe('foo')
    expect(cls(true && 'foo')).toBe('foo')
    expect(cls(false && 'foo')).toBe('')
  })

  it('strings (variadic)', () => {
    expect(cls('')).toBe('')
    expect(cls('foo', 'bar')).toBe('foo bar')
    expect(cls(true && 'foo', false && 'bar', 'baz')).toBe('foo baz')
    expect(cls(false && 'foo', 'bar', 'baz', '')).toBe('bar baz')
  })

  it('arrays', () => {
    expect(cls([''])).toBe('')
    expect(cls(true && ['foo'])).toBe('foo')
    expect(cls(['foo', 'bar'])).toBe('foo bar')
    expect(cls('foo', 'bar', ['baz', ['test']])).toBe('foo bar baz test')
    expect(cls('foo', 'bar', false && [true && 'baz'])).toBe('foo bar')
  })

  it('emptys', () => {
    expect(cls('')).toBe('')
    expect(cls(undefined)).toBe('')
    expect(cls(null)).toBe('')
    expect(cls(0)).toBe('')
  })

  // lite ignores all non-strings
  it('non-strings', () => {
    // number
    expect(cls(1)).toBe('')
    expect(cls(1, 2)).toBe('')
    expect(cls(Infinity)).toBe('')
    expect(cls(Number.NaN)).toBe('')
    expect(cls(0)).toBe('')
    expect(cls(null)).toBe('')
  })
})

describe('variant', () => {
  it('strings', () => {
    expect(clsv('base', {})({})).toBe('base')
    expect(clsv('base', { foo: { bar: 'bar' } })({ foo: 'bar' })).toBe('base bar')
    expect(clsv('base', { foo: { bar: 'bar', baz: 'baz' } })({ foo: 'baz' })).toBe('base baz')
  })
  it('default', () => {
    expect(
      variantDefault(
        clsv('base', {}),
        {},
      )(),
    ).toBe('base')
    expect(
      variantDefault(
        clsv('base', { foo: { bar: 'bar' } }),
        { foo: 'bar' },
      )(),
    ).toBe('base bar')
    expect(
      variantDefault(
        clsv('base', { foo: { bar: 'bar', baz: 'baz' } }),
        { foo: 'baz' },
      )({ foo: 'baz' }),
    ).toBe('base baz')
  })
})
