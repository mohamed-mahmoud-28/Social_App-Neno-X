import { SyncLoader } from "react-spinners"


export default function Spinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="rounded-2xl bg-white px-7 py-5 shadow-sm ring-1 ring-slate-200">
        <SyncLoader color="#4f46e5" size={12}/>
      </div>
    </div>
  )
}
