/**
 * 站內連結點到「目前這一頁」時要就地平滑捲動，而不是交給 router：
 * 同一個網址的軟導覽不會捲動，Lenis 下原生錨點也不會動。
 * - "/#id" 在首頁 → { id }，捲到該段
 * - 與目前頁面同路徑、沒有 hash → 'top'，捲回頂端
 * - 其他（別頁、外部、mailto）→ null，照常導覽
 */
export function samePageTarget(href: string, pathname: string): { id: string } | 'top' | null {
  const hashAt = href.indexOf('#');
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  if (path !== pathname) return null;
  if (hashAt === -1) return 'top';
  const id = href.slice(hashAt + 1);
  return id.length > 0 ? { id } : null;
}
