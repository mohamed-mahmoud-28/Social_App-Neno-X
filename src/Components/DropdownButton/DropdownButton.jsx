import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaEllipsisV,
    FaPen,
    FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

import EditPostModal from "../EditPostModal/EditPostModal";
import { queryKeys } from "../../Hooks/queryKeys";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function DropdownButton({
    postId,
    post,
    queryKey,
}) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    // =========================
    // DELETE POST
    // =========================

    function deletePost() {

        return axios.delete(
            `https://route-posts.routemisr.com/posts/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

    }

    const {
        mutate: handleDeletePost,
        isPending: isDeleting,
    } = useMutation({

        mutationFn: deletePost,

        onSuccess: async () => {

            toast.success("Post Deleted Successfully");

            queryClient.removeQueries({ queryKey: queryKeys.postById(postId), exact: true });
            await invalidatePostViews(queryClient, { postId });

            if (location.pathname === `/details/${postId}`) {
                navigate("/home", { replace: true });
            }

        },

        onError: () => {

            toast.error("Post Could Not Be Deleted");

        },

    });


    return (
        <div className="relative">


            {/* =========================
                MORE BUTTON
            ========================= */}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >

                <FaEllipsisV size={15} />

            </button>


            {/* =========================
                DROPDOWN
            ========================= */}

            {isOpen && (

                <>

                    {/* Click Outside */}

                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />


                    {/* Menu */}

                    <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">


                        {/* Header */}

                        <div className="border-b border-slate-100 px-4 py-3">

                            <p className="text-xs font-semibold uppercase text-slate-400">
                                Post Actions
                            </p>

                        </div>


                        {/* =========================
                            EDIT
                        ========================= */}

                        <button
                            type="button"
                            onClick={() => {

                                setIsOpen(false);

                                setShowEditModal(true);

                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

                                <FaPen
                                    size={13}
                                    className="text-slate-600"
                                />

                            </div>


                            <div className="flex flex-col">

                                <span className="text-sm font-medium text-slate-800">
                                    Edit Post
                                </span>

                            </div>

                        </button>


                        {/* Divider */}

                        <div className="border-t border-slate-100" />


                        {/* =========================
                            DELETE
                        ========================= */}

                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => {

                                setIsOpen(false);

                                handleDeletePost();

                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">

                                <FaTrash
                                    size={13}
                                    className="text-red-500"
                                />

                            </div>


                            <div className="flex flex-col">

                                <span className="text-sm font-medium text-red-600">

                                    {isDeleting
                                        ? "Deleting..."
                                        : "Delete Post"}

                                </span>

                            </div>

                        </button>

                    </div>

                </>

            )}


            {/* =========================
                EDIT MODAL
            ========================= */}

            {showEditModal && (

                <EditPostModal
                    postId={postId}
                    oldContent={post?.body}
                    queryKey={queryKey}
                    onClose={() => setShowEditModal(false)}
                />

            )}

        </div>
    );
}
