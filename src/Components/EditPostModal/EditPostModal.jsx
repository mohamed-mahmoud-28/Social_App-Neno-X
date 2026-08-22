import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaPen, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function EditPostModal({
    postId,
    oldContent,
    onClose,
}) {
    const queryClient = useQueryClient();

    const [content, setContent] = useState(oldContent || "");

    function editPost() {
        return axios.put(
            `https://route-posts.routemisr.com/posts/${postId}`,
            {
                body: content.trim(),
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const { mutate: handleEditPost, isPending } = useMutation({
        mutationFn: editPost,

        onSuccess: async () => {
            toast.success("Post Updated Successfully");
            await invalidatePostViews(queryClient, { postId });

            onClose();
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                "Post Could Not Be Updated"
            );
        },
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Post content cannot be empty");
            return;
        }

        handleEditPost();
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >

            <div
                className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

                            <FaPen
                                size={14}
                                className="text-slate-600"
                            />

                        </div>

                        <h2 className="text-lg font-semibold text-slate-800">
                            Edit Post
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* Form */}

                <form onSubmit={handleSubmit}>

                    <div className="p-5">

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Post Content
                        </label>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            placeholder="Write your post..."
                            className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />

                    </div>


                    {/* Footer */}

                    <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isPending
                                ? "Updating..."
                                : "Update Post"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}
