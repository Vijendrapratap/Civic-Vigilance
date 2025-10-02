import { formatCount } from '../lib/format';

describe('formatCount', () => {
  it('returns small numbers as-is', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(12)).toBe('12');
    expect(formatCount(999)).toBe('999');
  });
  it('formats thousands with K', () => {
    expect(formatCount(1000)).toBe('1K');
    expect(formatCount(1900)).toBe('1.9K');
    expect(formatCount(10500)).toBe('11K');
  });
  it('formats millions with M', () => {
    expect(formatCount(1000000)).toBe('1M');
    expect(formatCount(2500000)).toBe('2.5M');
  });
});

