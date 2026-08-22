import { Link, useRouteError } from "react-router-dom";

export default function RouteError() {
  const error = useRouteError();
  const message = error?.status === 404 ? "This page could not be found." : "We couldn't load this page. Please try again.";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4 text-center">
      <section className="w-full rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <Link to="/home" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">Return home</Link>
      </section>
    </main>
  );
}
