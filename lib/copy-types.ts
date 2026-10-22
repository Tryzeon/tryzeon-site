// 把 `as const` 文案的字面量型別放寬成 string / number，但保留結構：物件的每個 key、
// tuple 的長度與順序都還在。其他語言的文案宣告成 DeepWiden<typeof 中文版>，
// 少一個 key 或陣列少一項，type-check 就會報錯。
export type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends object
        ? { readonly [K in keyof T]: DeepWiden<T[K]> }
        : T;
