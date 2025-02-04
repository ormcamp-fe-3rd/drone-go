export default function LoadingMessage({className}: {className?:string}){
  return (
    <div className={`fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center ${className}`}>
      <div className="pointer-events-none flex h-20 w-56 items-center justify-center gap-5 rounded-2xl bg-white bg-opacity-90 drop-shadow-md">
        <img src="/icons/loading.svg" alt="" className="h-6 w-6 animate-spin" />
        <p className="text-center">Loading...</p>
      </div>
    </div>
  );
}