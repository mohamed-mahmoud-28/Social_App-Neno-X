import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import { Link } from "react-router-dom";
import { queryKeys } from "../../Hooks/queryKeys";

import {
    FaTimes,
    FaHeart,
    FaExclamationTriangle,
    FaRedo,
} from "react-icons/fa";

export default function LikesModal({ postId, isOpen, onClose }) {

    function getPostLikes() {
        return axios.get(
            `https://route-posts.routemisr.com/posts/${postId}/likes?page=1&limit=20`,
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
        isFetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: queryKeys.postLikes(postId),
        queryFn: getPostLikes,
        enabled: Boolean(isOpen && postId),
        // The modal is a live view of a post's likes, not a second local copy.
        // Always request the latest server list when it opens; mutations also
        // invalidate this key while it is open.
        staleTime: 0,
        refetchOnMount: "always",
    });

    const users = Array.isArray(data?.data?.data?.likes)
        ? data.data.data.likes
        : [];

    // Keep the portal and its UI out of the DOM whenever the modal is closed.
    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]"
            onClick={onClose}
        >

            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                            <FaHeart />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Likes
                            </h2>

                            <p className="text-xs text-slate-500">
                                People who liked this post
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close likes dialog"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* Loading */}
                {(isLoading || isFetching) && (
                    <div className="flex h-60 items-center justify-center">
                        <Spinner />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <FaExclamationTriangle />
                        </div>

                        <h3 className="font-bold text-slate-800">
                            Something went wrong
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            We couldn't load the likes.
                        </p>

                        <button
                            onClick={refetch}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            <FaRedo className="text-xs" />
                            Try Again
                        </button>

                    </div>
                )}

                {/* Users */}
                {!isLoading && !isFetching && !isError && (
                    <div className="max-h-[420px] overflow-y-auto p-3">

                        {users.length === 0 ? (
                            <div className="py-12 text-center">

                                <FaHeart className="mx-auto mb-3 text-3xl text-slate-300" />

                                <p className="text-sm font-medium text-slate-600">
                                    No likes yet
                                </p>

                            </div>
                        ) : (
                            users.map((like) => {

                                const user = like.user || like;

                                return (
                                    <Link
                                        to={`/users/${user._id}`}
                                        key={user._id}
                                        className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50"
                                    >

                                        {user.photo ? (
                                            <img
                                                src={user.photo}
                                                alt={user.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                                            />
                                        ) : (
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 font-semibold text-indigo-600">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">

                                            <h3 className="truncate text-sm font-semibold text-slate-800">
                                                {user.name}
                                            </h3>

                                            <p className="truncate text-xs text-slate-500">
                                                @{user.username}
                                            </p>

                                        </div>

                                    </Link>
                                );
                            })
                        )}

                    </div>
                )}

            </div>
        </div>,
        document.body
    );
}
