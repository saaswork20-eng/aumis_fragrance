export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-accent/20"></div>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
      </div>
      <p className="mt-6 font-heading text-sm font-semibold tracking-widest uppercase text-accent">
        Loading AUMIS Experience...
      </p>
    </div>
  );
}
