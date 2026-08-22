import { useState } from "react";
import { FaShare, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function SharePost({ post }) {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");

    function handleShare() {
        return axios.post(
            `https://route-posts.routemisr.com/posts/${post?._id}/share`,
            {
                body: content.trim(),
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const { mutate: sharePost, isPending } = useMutation({
        mutationFn: handleShare,

        onSuccess: async () => {
            await invalidatePostViews(queryClient, { postId: post?._id });

            toast.success("Post shared successfully");
            setContent("");
            setIsOpen(false);
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                "Failed to share post"
            );
        },
    });

    function handleSubmit(event) {
        event.preventDefault();

        if (!content.trim()) {
            toast.error("Share content cannot be empty");
            return;
        }

        sharePost();
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
                <FaShare />
                <span>Share</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6"
                    onClick={() => !isPending && setIsOpen(false)}
                >
                    <div
                        className="my-auto flex max-h-[calc(100vh-3rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
                            <h2 className="text-lg font-semibold text-slate-800">Share Post</h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                aria-label="Close share modal"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto">
                            <div className="space-y-5 p-5">
                                <div>
                                    <label htmlFor={`share-content-${post?._id}`} className="mb-2 block text-sm font-medium text-slate-700">
                                        What do you want to say?
                                    </label>
                                    <textarea
                                        id={`share-content-${post?._id}`}
                                        value={content}
                                        onChange={(event) => setContent(event.target.value)}
                                        rows={4}
                                        autoFocus
                                        placeholder="Write something..."
                                        className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Original Post</p>
                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                        <div className="flex items-center gap-2 p-3">
                                            {post?.user?.photo ? (
                                                <img src={post.user.photo} alt={post.user.name || "User"} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                                                    {post?.user?.name?.charAt(0) || "U"}
                                                </span>
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-slate-900">{post?.user?.name || "User"}</p>
                                                <p className="truncate text-[11px] text-slate-500">@{post?.user?.username || "user"}</p>
                                            </div>
                                        </div>
                                        {post?.body && <p className="whitespace-pre-line px-3 pb-3 text-sm leading-6 text-slate-700">{post.body}</p>}
                                        {post?.image && <img src={post.image} alt="Original post" className="max-h-72 w-full object-cover" />}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => setIsOpen(false)} disabled={isPending} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                                    {isPending ? "Sharing..." : "Share"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
