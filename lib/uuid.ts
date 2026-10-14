/** PostgREST 對非 UUID 的 `id=eq.` 回 400；先擋掉省一次往返與一則假錯誤。 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID.test(value);
}
