import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { compareSortValues, sortValue } from './table.ts';
import type { FunnelRow } from './table.ts';

describe('compareSortValues', () => {
  it('puts the larger value first in desc order', () => {
    assert.equal(compareSortValues(1, 2, 'desc') > 0, true);
    assert.equal(compareSortValues(2, 1, 'desc') < 0, true);
  });

  it('puts the smaller value first in asc order', () => {
    assert.equal(compareSortValues(1, 2, 'asc') < 0, true);
    assert.equal(compareSortValues(2, 1, 'asc') > 0, true);
  });

  it('sorts null last regardless of direction', () => {
    assert.equal(compareSortValues(null, 5, 'desc'), 1);
    assert.equal(compareSortValues(5, null, 'desc'), -1);
    assert.equal(compareSortValues(null, 5, 'asc'), 1);
    assert.equal(compareSortValues(5, null, 'asc'), -1);
    assert.equal(compareSortValues(null, null, 'desc'), 0);
  });
});

describe('sortValue', () => {
  const row: FunnelRow = {
    id: 'row-1',
    lead: { label: 'Row', href: null, imageUrl: null, icon: 'store', muted: false },
    counts: { viewCount: 42 },
    rates: { tryonRate: 0.5, clickRate: null, conversionRate: 0.25 },
  };

  it('reads a rate key from rates', () => {
    assert.equal(sortValue(row, 'tryonRate'), 0.5);
    assert.equal(sortValue(row, 'clickRate'), null);
  });

  it('reads a count key from counts', () => {
    assert.equal(sortValue(row, 'viewCount'), 42);
    assert.equal(sortValue(row, 'missingCount'), 0);
  });
});
