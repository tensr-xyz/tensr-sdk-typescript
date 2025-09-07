import { describe, it, expect } from 'vitest';
import { cn } from '../../src/utils/cn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'hidden');
    expect(result).toBe('base conditional');
  });

  it('should handle undefined and null values', () => {
    const result = cn('base', undefined, null, 'valid');
    expect(result).toBe('base valid');
  });

  it('should handle empty strings', () => {
    const result = cn('base', '', 'valid');
    expect(result).toBe('base valid');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'base': true,
      'active': true,
      'disabled': false
    });
    expect(result).toBe('base active');
  });

  it('should handle mixed input types', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      { 'object': true, 'hidden': false },
      'string',
      true && 'conditional'
    );
    expect(result).toBe('base array1 array2 object string conditional');
  });
});
