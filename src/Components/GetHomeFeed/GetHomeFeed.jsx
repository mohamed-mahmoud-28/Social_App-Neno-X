import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostCard from "../PostCard/PostCard";
import Spinner from "../Spinner/Spinner";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";
import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { queryKeys } from "../../Hooks/queryKeys";

export default function GetHomeFeed() {
    function getHomeFeed() {
        return axios.get(
            "https://route-posts.routemisr.com/posts/feed?only=following&limit=10",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: queryKeys.homeFeed,
        queryFn: getHomeFeed,
    });

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <div className="flex h-screen w-full items-center justify-center px-4 text-red-500">
                <h2 className="text-center text-xl md:text-4xl">
                    {error?.message?.toUpperCase() || "SOMETHING WENT WRONG"}
                </h2>
            </div>
        );
    }

    const posts = Array.isArray(data?.data?.data?.posts)
        ? data.data.data.posts
        : [];

    if (posts.length === 0) {
        return (
            <div className="mx-auto flex min-h-[60vh] w-full max-w-[650px] items-center justify-center px-4">
                <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                        <FaUsers className="text-2xl text-indigo-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        Your Feed is Empty
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        You don't have any posts from your friends yet.
                        Follow more people to see their latest posts here.
                    </p>

                    <Link
                        to="/home"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg"
                    >
                        <FaUsers className="text-sm" />
                        Find People
                    </Link>

                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-6 px-3 py-6 sm:px-5 lg:py-8 xl:grid-cols-[minmax(0,650px)_300px] xl:justify-center">

            {/* Posts */}

            <div className="flex min-w-0 flex-col items-center gap-5">

                {posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        isSingleComment={false}
                        queryKey={queryKeys.homeFeed}
                    />
                ))}

            </div>

            {/* Follow Suggestions */}

            <aside className="w-full self-start xl:sticky xl:top-[92px]">
                <FollowSuggestions />
            </aside>

        </div>
    );
}
