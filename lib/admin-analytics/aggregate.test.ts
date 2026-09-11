import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { analyticsMonths, brandAnalytics, inPeriod, productAnalytics } from './aggregate.ts';

const counts = ([viewCount, tryonCount, purchaseClickCount]: [number, number, number]) => ({
  viewCount,
  tryonCount,
  purchaseClickCount,
});

const stores = [
  { id: 's1', name: 'Brand One', logoPath: 'logos/s1.png' },
  { id: 's2', name: 'Brand Two', logoPath: null },
  { id: 's3', name: null, logoPath: null },
];

const storeMonths = [
  { storeId: 's1', year: 2026, month: 9, ...counts([100, 20, 5]) },
  { storeId: 's1', year: 2026, month: 8, ...counts([50, 10, 1]) },
  { storeId: 's2', year: 2026, month: 9, ...counts([300, 30, 9]) },
];

const scanMonths = [
  { storeId: 's1', year: 2026, month: 9, scanCount: 2 },
  { storeId: 's1', year: 2026, month: 8, scanCount: 1 },
];

const SEP = { kind: 'month', year: 2026, month: 9 } as const;
const ALL = { kind: 'all' } as const;

describe('inPeriod', () => {
  it('matches the month or everything', () => {
    assert.equal(inPeriod({ year: 2026, month: 9 }, SEP), true);
    assert.equal(inPeriod({ year: 2026, month: 8 }, SEP), false);
    assert.equal(inPeriod({ year: 2020, month: 1 }, ALL), true);
  });
});

describe('brandAnalytics', () => {
  it('sums the period per store, lists zero-traffic stores, sorts by views', () => {
    const rows = brandAnalytics(stores, storeMonths, scanMonths, SEP);
    assert.deepEqual(rows.map((row) => row.storeId), ['s2', 's1', 's3']);
    assert.deepEqual(rows[1], {
      storeId: 's1',
      storeName: 'Brand One',
      logoUrl: 'https://images.tryzeon.com/logos/s1.png',
      scanCount: 2,
      viewCount: 100,
      tryonCount: 20,
      purchaseClickCount: 5,
    });
    assert.equal(rows[2].scanCount, 0);
    assert.equal(rows[2].storeName, '店家');
  });

  it('all-time adds every month', () => {
    const s1 = brandAnalytics(stores, storeMonths, scanMonths, ALL).find((row) => row.storeId === 's1');
    assert.deepEqual(s1 && [s1.scanCount, s1.viewCount, s1.tryonCount, s1.purchaseClickCount], [3, 150, 30, 6]);
  });

  it('breaks view ties by name', () => {
    const tied = [
      { storeId: 's2', year: 2026, month: 9, ...counts([300, 0, 0]) },
      { storeId: 's1', year: 2026, month: 9, ...counts([300, 0, 0]) },
    ];
    assert.deepEqual(
      brandAnalytics(stores, tied, [], SEP).map((row) => row.storeName),
      ['Brand One', 'Brand Two', '店家'],
    );
  });
});

describe('productAnalytics', () => {
  const productMonths = [
    { productId: 'p1', year: 2026, month: 9, ...counts([100, 20, 5]) },
    { productId: 'p1', year: 2026, month: 8, ...counts([50, 10, 1]) },
    { productId: 'gone', year: 2026, month: 9, ...counts([7, 1, 0]) },
  ];
  const products = [{ id: 'p1', name: 'Tee', imagePath: 's1/p1.webp' }];

  it('sums the period per product and keeps a deleted product with a null name', () => {
    assert.deepEqual(productAnalytics(productMonths, products, ALL), [
      {
        productId: 'p1',
        productName: 'Tee',
        imageUrl: 'https://images.tryzeon.com/s1/p1.webp',
        viewCount: 150,
        tryonCount: 30,
        purchaseClickCount: 6,
      },
      { productId: 'gone', productName: null, imageUrl: null, viewCount: 7, tryonCount: 1, purchaseClickCount: 0 },
    ]);
    assert.equal(productAnalytics(productMonths, products, SEP)[0].viewCount, 100);
  });

  it('is empty without events and sorts deleted products last on ties', () => {
    assert.deepEqual(productAnalytics([], products, ALL), []);
    const tied = productAnalytics(
      [
        { productId: 'gone', year: 2026, month: 9, ...counts([5, 0, 0]) },
        { productId: 'p1', year: 2026, month: 9, ...counts([5, 0, 0]) },
      ],
      products,
      ALL,
    );
    assert.deepEqual(tied.map((row) => row.productName), ['Tee', null]);
  });
});

describe('analyticsMonths', () => {
  it('deduplicates and sorts newest first', () => {
    assert.deepEqual(analyticsMonths([...storeMonths, ...scanMonths]), [
      { kind: 'month', year: 2026, month: 9 },
      { kind: 'month', year: 2026, month: 8 },
    ]);
    assert.deepEqual(analyticsMonths([]), []);
  });
});
