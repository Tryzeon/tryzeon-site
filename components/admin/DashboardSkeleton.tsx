
interface BoneProps {
  className: string;
}

function Bone({ className }: BoneProps) {
  return (
    <span
      className={`block rounded-lg bg-gradient-to-r from-neo-smoke/70 via-white to-neo-smoke/70 bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}

export function HeadingBones() {
  return (
    <div className="space-y-3">
      <Bone className="h-3 w-20" />
      <Bone className="h-9 w-56 md:h-10 md:w-72" />
      <Bone className="h-4 w-64" />
    </div>
  );
}

export function SelectorBone() {
  return <Bone className="h-9 w-44 rounded-full" />;
}

/** KPI 卡加表格卡：換期間時只有這一段會變成骨架，標題與選單留在原位。 */
export function DashboardBodySkeleton() {
  return (
    <div role="status" aria-label="載入中" aria-live="polite" className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/60 bg-white/70 px-4 py-4 shadow-neo backdrop-blur-xl"
          >
            <Bone className="h-3 w-12" />
            <Bone className="mt-3 h-7 w-16" />
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <Bone className="h-3 w-24" />
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-neo backdrop-blur-xl">
          <div className="flex items-center gap-4 border-b border-neo-smoke/70 pb-4">
            <Bone className="h-3 w-16" />
            <Bone className="ml-auto h-3 w-10" />
            <Bone className="h-3 w-10" />
            <Bone className="h-3 w-10" />
            <Bone className="h-3 w-10" />
          </div>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 border-b border-neo-smoke/40 py-3 last:border-b-0">
              <Bone className="h-8 w-8 rounded-full" />
              <Bone className="h-4 w-32" />
              <Bone className="ml-auto h-4 w-12" />
              <Bone className="h-4 w-12" />
              <Bone className="h-4 w-12" />
              <Bone className="h-4 w-12" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** 進入路由時的整頁骨架（loading.tsx）。 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <HeadingBones />
        <SelectorBone />
      </div>
      <DashboardBodySkeleton />
    </div>
  );
}
