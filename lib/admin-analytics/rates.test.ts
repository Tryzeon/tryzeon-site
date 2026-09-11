import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatCount, formatRate, funnelRates, sumFunnel } from './rates.ts';

describe('funnelRates', () => {
  it('divides along the funnel', () => {
    assert.deepEqual(funnelRates({ viewCount: 200, tryonCount: 50, purchaseClickCount: 10 }), {
      tryonRate: 0.25,
      clickRate: 0.2,
      conversionRate: 0.05,
    });
  });

  it('returns null for zero denominators', () => {
    assert.deepEqual(funnelRates({ viewCount: 0, tryonCount: 0, purchaseClickCount: 0 }), {
      tryonRate: null,
      clickRate: null,
      conversionRate: null,
    });
    assert.equal(funnelRates({ viewCount: 10, tryonCount: 0, purchaseClickCount: 0 }).clickRate, null);
  });
});

describe('sumFunnel', () => {
  it('adds every counter', () => {
    assert.deepEqual(
      sumFunnel([
        { viewCount: 1, tryonCount: 2, purchaseClickCount: 3 },
        { viewCount: 10, tryonCount: 20, purchaseClickCount: 30 },
      ]),
      { viewCount: 11, tryonCount: 22, purchaseClickCount: 33 },
    );
    assert.deepEqual(sumFunnel([]), { viewCount: 0, tryonCount: 0, purchaseClickCount: 0 });
  });
});

describe('formatting', () => {
  it('formats rates to one decimal and null as a dash', () => {
    assert.equal(formatRate(0.25), '25.0%');
    assert.equal(formatRate(0.00456), '0.5%');
    assert.equal(formatRate(null), '—');
  });

  it('formats counts with thousands separators', () => {
    assert.equal(formatCount(0), '0');
    assert.equal(formatCount(12345), '12,345');
  });
});
