import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { PAGE_SIZE, readAll } from './data.ts';

function pagesOf(total: number) {
  const calls: [number, number][] = [];
  const page = (from: number, to: number) => {
    calls.push([from, to]);
    const data = Array.from({ length: Math.max(0, Math.min(total, to + 1) - from) }, (_, i) => ({ n: from + i }));
    return Promise.resolve({ data, error: null });
  };
  return { page, calls };
}

const parse = (row: Record<string, unknown>) => (typeof row.n === 'number' ? row.n : null);

describe('readAll', () => {
  it('stops after a short page', async () => {
    const { page, calls } = pagesOf(PAGE_SIZE + 1);
    const rows = await readAll(page, parse);
    assert.equal(rows.length, PAGE_SIZE + 1);
    assert.equal(rows[PAGE_SIZE], PAGE_SIZE);
    assert.deepEqual(calls, [[0, PAGE_SIZE - 1], [PAGE_SIZE, 2 * PAGE_SIZE - 1]]);
  });

  it('spends one extra empty request after a full last page', async () => {
    const { page, calls } = pagesOf(PAGE_SIZE);
    assert.equal((await readAll(page, parse)).length, PAGE_SIZE);
    assert.equal(calls.length, 2);
  });

  it('handles an empty table and drops unparseable rows', async () => {
    const { page, calls } = pagesOf(0);
    assert.deepEqual(await readAll(page, parse), []);
    assert.deepEqual(calls, [[0, PAGE_SIZE - 1]]);
    assert.deepEqual(await readAll(() => Promise.resolve({ data: [{ n: 1 }, { x: 2 }], error: null }), parse), [1]);
  });

  it('surfaces the page error', async () => {
    await assert.rejects(
      () => readAll(() => Promise.resolve({ data: null, error: { message: 'boom' } }), parse),
      /boom/,
    );
  });
});
