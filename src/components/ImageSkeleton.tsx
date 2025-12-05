export function ImageSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#F2F0EA] animate-pulse ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-black/10 rounded-full" />
      </div>
    </div>
  )
}

