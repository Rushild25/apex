import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});
