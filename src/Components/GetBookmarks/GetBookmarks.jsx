import { FaBookmark } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner/Spinner";
import PostCard from "../PostCard/PostCard";
import { queryKeys } from "../../Hooks/queryKeys";

export default function GetBookmarks() {
    function getBookMarks() {
        return axios.get(
            "https://route-posts.routemisr.com/users/bookmarks",
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
    } = useQuery({
        queryKey: queryKeys.bookmarks,
        queryFn: getBookMarks,
    });

    const bookmarks = Array.isArray(data?.data?.data?.bookmarks)
        ? data.data.data.bookmarks
        : [];

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
                Failed to load bookmarks
            </div>
        );
    }

    return (
        <section className="mt-6">

            {/* Header */}
            <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                        <FaBookmark className="text-indigo-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Bookmarks
                        </h2>

                        <p className="text-sm text-slate-500">
                            {bookmarks.length} saved{" "}
                            {bookmarks.length === 1 ? "post" : "posts"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Posts */}
            {bookmarks.length > 0 ? (
                <div className="space-y-5">
                    {bookmarks.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            queryKey={queryKeys.bookmarks}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                        <FaBookmark className="text-xl text-slate-400" />
                    </div>

                    <h3 className="text-base font-semibold text-slate-900">
                        No saved posts yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Posts you save will appear here.
                    </p>

                </div>
            )}
        </section>
    );
}
