import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatPeriodParam, parsePeriod, periodLabel, periodOptions, resolvePeriod } from './period.ts';

describe('parsePeriod', () => {
  it('returns all-time for undefined, "all" and garbage', () => {
    assert.deepEqual(parsePeriod(undefined), { kind: 'all' });
    assert.deepEqual(parsePeriod('all'), { kind: 'all' });
    assert.deepEqual(parsePeriod('2026-13'), { kind: 'all' });
    assert.deepEqual(parsePeriod('2026-9'), { kind: 'all' });
    assert.deepEqual(parsePeriod('abc'), { kind: 'all' });
  });

  it('parses YYYY-MM', () => {
    assert.deepEqual(parsePeriod('2026-09'), { kind: 'month', year: 2026, month: 9 });
  });
});

describe('formatPeriodParam', () => {
  it('round-trips', () => {
    assert.equal(formatPeriodParam({ kind: 'all' }), 'all');
    assert.equal(formatPeriodParam({ kind: 'month', year: 2026, month: 9 }), '2026-09');
    assert.deepEqual(parsePeriod(formatPeriodParam({ kind: 'month', year: 2025, month: 12 })), {
      kind: 'month',
      year: 2025,
      month: 12,
    });
  });
});

describe('periodLabel', () => {
  it('labels in Traditional Chinese', () => {
    assert.equal(periodLabel({ kind: 'all' }), '全期累計');
    assert.equal(periodLabel({ kind: 'month', year: 2026, month: 9 }), '2026 年 9 月');
  });
});

describe('periodOptions', () => {
  it('lists all-time first, then the months', () => {
    assert.deepEqual(periodOptions([{ kind: 'month', year: 2026, month: 9 }]), [
      { value: 'all', label: '全期累計' },
      { value: '2026-09', label: '2026 年 9 月' },
    ]);
  });
});

describe('resolvePeriod', () => {
  const months = [
    { kind: 'month', year: 2026, month: 9 },
    { kind: 'month', year: 2026, month: 8 },
  ] as const;

  it('defaults to the newest month, or all-time when there is no data', () => {
    assert.deepEqual(resolvePeriod(undefined, months), { kind: 'month', year: 2026, month: 9 });
    assert.deepEqual(resolvePeriod(undefined, []), { kind: 'all' });
    assert.deepEqual(resolvePeriod('all', months), { kind: 'all' });
  });

  it('honours a month with data and falls back for one without', () => {
    assert.deepEqual(resolvePeriod('2026-08', months), { kind: 'month', year: 2026, month: 8 });
    assert.deepEqual(resolvePeriod('2020-01', months), { kind: 'month', year: 2026, month: 9 });
    assert.deepEqual(resolvePeriod('garbage', months), { kind: 'all' });
  });
});
