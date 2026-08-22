import { useQuery } from "@tanstack/react-query";
import { FaExclamationTriangle, FaUsers } from "react-icons/fa";
import Spinner from "../Spinner/Spinner";
import FollowUser from "../FollowUser/FollowUser";
import { queryKeys } from "../../Hooks/queryKeys";
import { Link } from "react-router-dom";
import { fetchFollowSuggestions, selectSuggestionUsers } from "../../Hooks/followSuggestions";

function UserRow({ user }) {
  const userId = user?._id || user?.id;

  if (!userId) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50">
      <Link to={`/users/${userId}`} className="shrink-0" aria-label={`View ${user?.name || "user"} profile`}>
      {user?.photo ? (
        <img
          src={user.photo}
          alt={user?.name || "User"}
          loading="lazy"
          decoding="async"
          width="40"
          height="40"
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
          {user?.name?.charAt(0) || "U"}
        </span>
      )}
      </Link>

      <Link to={`/users/${userId}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800 transition hover:text-indigo-600">
          {user?.name || "Unknown user"}
        </p>
        <p className="truncate text-xs text-slate-500">
          {user?.username ? `@${user.username}` : "@unknown"}
        </p>
      </Link>

      <FollowUser userid={userId} />
    </div>
  );
}

function PeopleCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
        <FaUsers className="text-indigo-600" />
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CardStatus({ children, isError = false }) {
  return (
    <div className={`flex min-h-20 items-center justify-center rounded-xl px-3 text-center text-sm ${isError ? "text-red-500" : "text-slate-500"}`}>
      {isError && <FaExclamationTriangle className="mr-2 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

export default function FollowSuggestions() {
  const suggestionsQuery = useQuery({
    queryKey: queryKeys.followSuggestions,
    queryFn: () => fetchFollowSuggestions(),
    staleTime: 60_000,
  });

  const suggestions = selectSuggestionUsers(suggestionsQuery.data);

  return (
    <div className="flex w-full flex-col gap-4">
      <PeopleCard title="Follow Suggestions">
        {suggestionsQuery.isLoading ? (
          <div className="flex min-h-20 items-center justify-center"><Spinner /></div>
        ) : suggestionsQuery.isError ? (
          <CardStatus isError>Unable to load suggestions</CardStatus>
        ) : suggestions.length === 0 ? (
          <CardStatus>No suggestions right now</CardStatus>
        ) : (
          <div className="space-y-1">
            {suggestions.map((user) => <UserRow key={user?._id || user?.id} user={user} />)}
          </div>
        )}
      </PeopleCard>

    </div>
  );
}
