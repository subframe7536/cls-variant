/* eslint-disable no-constant-binary-expression */
import { describe, expect, it } from 'vitest'
import { cls, clsv, clsvCompound, clsvDefault } from '../src'

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

describe('clsv', () => {
  const button = clsv('btn', {
    size: {
      sm: 'text-sm px-2',
      md: 'text-base px-4',
      lg: 'text-lg px-6',
    },
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
  })

  it('should return the base classes with no variants', () => {
    expect(button({} as any)).toBe('btn')
  })

  it('should return the base classes with one variant', () => {
    expect(button({ size: 'sm' } as any)).toBe('btn text-sm px-2')
  })

  it('should return the base classes with multiple variants', () => {
    expect(button({ size: 'md', color: 'primary' })).toBe('btn text-base px-4 bg-blue-500')
  })

  it('should handle unknown variants gracefully', () => {
    expect(button({ size: 'unknown' as any, color: 'primary' })).toBe('btn  bg-blue-500')
  })
})

describe('clsvDefault', () => {
  const button = clsv('btn', {
    size: {
      sm: 'text-sm px-2',
      md: 'text-base px-4',
      lg: 'text-lg px-6',
    },
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
  })

  const defaultButton = clsvDefault(button, {
    size: 'md',
    color: 'primary',
  })

  it('should return the default classes when no config is provided', () => {
    expect(defaultButton()).toBe('btn text-base px-4 bg-blue-500')
  })
  it('should return the default classes when undefined config is provided', () => {
    expect(defaultButton({ size: undefined })).toBe('btn text-base px-4 bg-blue-500')
  })

  it('should override default classes with provided config', () => {
    expect(defaultButton({ size: 'sm' })).toBe('btn text-sm px-2 bg-blue-500')
  })

  it('should handle partial overrides', () => {
    expect(defaultButton({ color: 'secondary' })).toBe('btn text-base px-4 bg-gray-500')
  })

  it('should handle unknown variants gracefully', () => {
    expect(defaultButton({ size: 'unknown' as any })).toBe('btn  bg-blue-500')
  })
})

describe('clsvCompound', () => {
  const button = clsv('btn', {
    size: {
      sm: 'text-sm px-2',
      md: 'text-base px-4',
      lg: 'text-lg px-6',
    },
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
    },
  })

  const compoundButton = clsvCompound(button, [
    ['shadow', { size: 'md', color: 'primary' }],
    ['rounded', { size: 'lg', color: ['primary', 'secondary'] }],
  ])

  it('should return the base classes when no compound conditions match', () => {
    expect(compoundButton({ size: 'sm', color: 'primary' })).toBe('btn text-sm px-2 bg-blue-500')
  })

  it('should add the compound class when all conditions match', () => {
    expect(compoundButton({ size: 'md', color: 'primary' })).toBe('btn text-base px-4 bg-blue-500 shadow')
  })

  it('should add the compound class when all conditions match with array values', () => {
    expect(compoundButton({ size: 'lg', color: 'secondary' })).toBe('btn text-lg px-6 bg-gray-500 rounded')
  })

  it('should not add the compound class when some conditions do not match', () => {
    expect(compoundButton({ size: 'sm', color: 'secondary' })).toBe('btn text-sm px-2 bg-gray-500')
  })
})
