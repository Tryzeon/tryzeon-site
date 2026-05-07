export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] animate-pulse">
      <div className="h-20 bg-white/50" />
      <div className="h-[60vh] bg-gradient-to-b from-white/30 to-[#F5F5F7]" />
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-8">
        <div className="h-12 bg-white/50 rounded-2xl w-1/3 mx-auto" />
        <div className="h-6 bg-white/50 rounded-xl w-2/3 mx-auto" />
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 bg-white/50 rounded-[32px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
