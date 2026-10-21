import type { ReactNode } from 'react';

// 字串切在中文子句與句子結尾（，；：。）之後、每段 inline-block；不切「、」，
// 否則列舉會被拆成單獨一行。窄螢幕只會在「，」處換行，不會出現
// 「…同／步。」這種孤字。用 split 而不是 match，任何字元都不會被吃掉。
// 純函式、沒有 'use client'，server 與 client 元件都能呼叫。非字串原樣輸出。
// lastClassName：只套在最後一個子句上（例如首頁願景的藍青漸層收尾）。
export function clauseWrap(text: ReactNode, lastClassName = ''): ReactNode {
  if (typeof text !== 'string') return text;
  const parts = splitClauses(text);
  if (parts.length < 2 && !lastClassName) return text;
  return parts.map((part, i) => (
    <span key={i} className={i === parts.length - 1 && lastClassName ? `inline-block ${lastClassName}` : 'inline-block'}>
      {keepRanges(part)}
    </span>
  ));
}

// clauseWrap 的切法，給需要自己包每個子句的地方（逐子句進場的標題）
export function splitClauses(text: string): string[] {
  return text.split(/(?<=[，；：。])/).filter(Boolean);
}

// 不可拆開的詞包成 nowrap：
// - 數字範圍（15–20）：en dash 後面是換行點，窄欄會把「15–」與「20 秒」拆到兩行
// - 「LINE 官方帳號」：中文每個字之間都能換行，手機上會斷成「LINE 官方／帳號」
const KEEP_TOGETHER = /(\d+–\d+|LINE 官方帳號)/;

export function keepRanges(text: string): ReactNode {
  const parts = text.split(KEEP_TOGETHER);
  if (parts.length < 2) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// 只在句號「。」之後換行的版本，給較長的 lede 用；規則同上，用 index 當 key。
export function sentenceWrap(text: string): ReactNode {
  return text.split(/(?<=。)/).map((sentence, i) => (
    <span key={i} className="inline-block">
      {keepRanges(sentence)}
    </span>
  ));
}
