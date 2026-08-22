import axios from "axios";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { authContext } from "../../Context/AuthContextValue";
import { queryKeys } from "../../Hooks/queryKeys";
import FollowUser from "../FollowUser/FollowUser";
import PostCard from "../PostCard/PostCard";
import Spinner from "../Spinner/Spinner";

export default function UserProfile() {
  const { id } = useParams();
  const { userData } = useContext(authContext);

  function getUserProfile() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  }

  function getUserPosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  }

  const profileQuery = useQuery({
    queryKey: queryKeys.userProfile(id),
    queryFn: getUserProfile,
    enabled: Boolean(id && userData?._id),
  });

  const postsQuery = useQuery({
    queryKey: queryKeys.profilePosts(id),
    queryFn: getUserPosts,
    enabled: Boolean(id && userData?._id && id !== userData._id),
  });

  if (!userData) return <Spinner />;

  if (id === userData._id) {
    return <Navigate to="/profile" replace />;
  }

  if (profileQuery.isLoading) return <Spinner />;

  if (profileQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">We couldn't load this profile</h1>
          <p className="mt-2 text-sm text-slate-500">Please check the profile link and try again.</p>
        </div>
      </div>
    );
  }

  const profile = profileQuery.data?.data?.data?.user || profileQuery.data?.data?.data;
  const posts = Array.isArray(postsQuery.data?.data?.data?.posts)
    ? postsQuery.data.data.data.posts
    : [];
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen px-3 py-6 sm:px-5 lg:py-8">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-48 bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-900 sm:h-64">
            {profile?.cover && <img src={profile.cover} alt="Profile cover" className="h-full w-full object-cover" />}
          </div>

          <div className="px-5 pb-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4 -mt-16">
                {profile?.photo ? (
                  <img src={profile.photo} alt={profile.name} className="h-28 w-28 rounded-full border-4 border-white bg-slate-200 object-cover shadow-lg sm:h-32 sm:w-32" />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-indigo-50 text-indigo-600 shadow-lg sm:h-32 sm:w-32"><FaUser className="text-3xl" /></div>
                )}
                <div className="pb-2">
                  <h1 className="text-2xl font-bold text-slate-900">{profile?.name || "User"}</h1>
                  <p className="text-sm text-slate-500">@{profile?.username || "user"}</p>
                </div>
              </div>
              <FollowUser userid={id} queryKey={queryKeys.userProfile(id)} />
            </div>

            <div className="mt-7 flex flex-wrap gap-8 border-t border-slate-100 pt-5">
              <div><p className="text-xl font-bold text-slate-900">{profile?.followersCount || 0}</p><p className="text-sm text-slate-500">Followers</p></div>
              <div><p className="text-xl font-bold text-slate-900">{profile?.followingCount || 0}</p><p className="text-sm text-slate-500">Following</p></div>
              <div><p className="text-xl font-bold text-slate-900">{posts.length}</p><p className="text-sm text-slate-500">Posts</p></div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-900">About</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileInfo icon={<FaUserFriends />} label="Gender" value={profile?.gender || "Not specified"} />
            <ProfileInfo icon={<FaUserPlus />} label="Joined" value={joinedDate || "Not available"} />
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4"><h2 className="text-xl font-bold text-slate-900">Posts</h2><p className="mt-1 text-sm text-slate-500">Recent posts from {profile?.name || "this user"}</p></div>
          {postsQuery.isLoading ? <Spinner /> : postsQuery.isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">Failed to load posts.</div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm"><FaCalendarAlt className="mx-auto mb-3 text-xl text-slate-400" /><p className="text-sm text-slate-500">No posts to show yet.</p></div>
          ) : (
            <div className="space-y-5">{posts.map((post) => <PostCard key={post._id} post={post} queryKey={queryKeys.profilePosts(id)} />)}</div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProfileInfo({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600">{icon}</div>
      <div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-medium capitalize text-slate-800">{value}</p></div>
    </div>
  );
}
