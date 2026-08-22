import { useQuery } from "@tanstack/react-query";
import { FaExclamationTriangle, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import FollowUser from "../FollowUser/FollowUser";
import { fetchFollowSuggestions, selectSuggestionUsers } from "../../Hooks/followSuggestions";
import { queryKeys } from "../../Hooks/queryKeys";

function SuggestionSkeleton() {
  return <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-14 w-14 rounded-full bg-slate-200" /><div className="mt-4 h-4 w-2/3 rounded bg-slate-200" /><div className="mt-2 h-3 w-1/2 rounded bg-slate-100" /><div className="mt-6 h-10 rounded-xl bg-slate-200" /></div>;
}

export default function DiscoverPeople() {
  const suggestionsQuery = useQuery({ queryKey: queryKeys.followSuggestions, queryFn: () => fetchFollowSuggestions(), staleTime: 60_000 });
  const users = selectSuggestionUsers(suggestionsQuery.data);

  return <section className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 lg:px-8"><header className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><FaUsers /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">Community</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Discover people</h1><p className="mt-2 text-sm leading-6 text-slate-500">Find people you may enjoy following.</p></div></div></header>{suggestionsQuery.isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3,4,5,6].map((item) => <SuggestionSkeleton key={item} />)}</div> : suggestionsQuery.isError ? <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center"><FaExclamationTriangle className="mx-auto text-2xl text-red-500" /><h2 className="mt-4 text-lg font-bold text-slate-900">Couldn't load suggestions</h2><button type="button" onClick={() => suggestionsQuery.refetch()} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">Try again</button></div> : users.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><FaUsers className="mx-auto text-3xl text-slate-300" /><h2 className="mt-4 text-lg font-bold text-slate-900">You're all caught up</h2><p className="mt-2 text-sm text-slate-500">There are no new people to suggest right now.</p></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{users.map((user) => <PersonCard key={user?._id || user?.id} user={user} />)}</div>}</section>;
}

function PersonCard({ user }) {
  const userId = user?._id || user?.id;
  if (!userId) return null;
  return <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"><Link to={`/users/${userId}`} className="flex min-w-0 items-center gap-3"><span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-lg font-semibold text-indigo-600">{user?.photo ? <img src={user.photo} alt={user?.name || "User"} className="h-full w-full object-cover" /> : user?.name?.charAt(0) || "U"}</span><span className="min-w-0"><span className="block truncate text-base font-bold text-slate-900">{user?.name || "Unknown user"}</span><span className="mt-0.5 block truncate text-sm text-slate-500">{user?.username ? `@${user.username}` : "@user"}</span></span></Link>{user?.bio && <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{user.bio}</p>}<div className="mt-5"><FollowUser userid={userId} queryKey={queryKeys.followSuggestions} /></div></article>;
}
