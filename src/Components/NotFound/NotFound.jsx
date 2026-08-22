

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 text-center">
            <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Error 404</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
                <p className="mt-3 text-sm text-slate-500">The page you are looking for is unavailable.</p>
            </div>
        </div>
    )
}
