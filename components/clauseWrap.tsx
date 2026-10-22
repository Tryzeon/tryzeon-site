import { Fragment, type ReactNode } from 'react';

// 字串切在中文子句與句子結尾（，；：。）與英文句子之間、每段 inline-block；不切「、」，
// 否則列舉會被拆成單獨一行。窄螢幕只會在「，」處換行，不會出現
// 「…同／步。」這種孤字。中文用 split 而不是 match，任何字元都不會被吃掉；
// 英文句子之間的空白例外，見 EN_SENTENCE。
// 純函式、沒有 'use client'，server 與 client 元件都能呼叫。非字串原樣輸出。
// lastClassName：只套在最後一個子句上（例如首頁願景的藍青漸層收尾）。
export function clauseWrap(text: ReactNode, lastClassName = ''): ReactNode {
  if (typeof text !== 'string') return text;
  const parts = splitClauses(text);
  if (parts.length < 2 && !lastClassName) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {gapBefore(parts, i)}
      <span className={i === parts.length - 1 && lastClassName ? `inline-block ${lastClassName}` : 'inline-block'}>
        {keepRanges(part)}
      </span>
    </Fragment>
  ));
}

// 英文句子之間：句號＋空白，後面接大寫或開引號才算（「Ltd. is」這類縮寫不切）。
// 空白在切的時候吃掉、渲染時由 gapBefore 放回兩段之間——留在 inline-block 尾端會被裁掉，兩句會黏在一起
const EN_SENTENCE = /(?<=\.) (?=[A-Z“"])/;

// clauseWrap 的切法，給需要自己包每個子句的地方（逐子句進場的標題）；自己包的地方要用 gapBefore 補空白
export function splitClauses(text: string): string[] {
  return text.split(new RegExp(`(?<=[，；：。])|${EN_SENTENCE.source}`)).filter(Boolean);
}

/** 第 i 段之前要補的空白：英文句子之間是一個空白，中文子句之間沒有 */
export function gapBefore(parts: readonly string[], i: number): string {
  return i > 0 && parts[i - 1].endsWith('.') ? ' ' : '';
}

// 不可拆開的詞包成 nowrap：
// - 數字範圍（15–20）：en dash 後面是換行點，窄欄會把「15–」與「20 秒」拆到兩行
// - 「LINE 官方帳號」：中文每個字之間都能換行，手機上會斷成「LINE 官方／帳號」；英文版同理
const KEEP_TOGETHER = /(\d+–\d+|LINE 官方帳號|LINE Official Account)/;

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

// 只在句號（「。」或英文句子之間）之後換行的版本，給較長的 lede 用；規則同上，用 index 當 key。
export function sentenceWrap(text: string): ReactNode {
  const sentences = text.split(new RegExp(`(?<=。)|${EN_SENTENCE.source}`));
  return sentences.map((sentence, i) => (
    <Fragment key={i}>
      {gapBefore(sentences, i)}
      <span className="inline-block">{keepRanges(sentence)}</span>
    </Fragment>
  ));
}
