import { useContext, useEffect, useRef, useState } from "react";
import {
    FaUser,
    FaPaperPlane,
    FaTimes,
    FaImage,
} from "react-icons/fa";
import { authContext } from "../../Context/AuthContextValue";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function CommentReply({
    onCancel,
    postId,
    commentId,
}) {
    const { userData } = useContext(authContext);

    const [reply, setReply] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const imageInputRef = useRef(null);
    const previewUrlRef = useRef("");

    const queryClient = useQueryClient();

    // This cleanup is only for an unexpected unmount, such as navigating away
    // while an image preview is open.
    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    // =========================================
    // Create Reply
    // =========================================
    const { mutate, isPending } = useMutation({
        mutationFn: async ({ content, image }) => {
            const formData = new FormData();

            formData.append("content", content);

            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.post(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            return data;
        },

        onSuccess: async (data) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["replies", postId, commentId] }),
                invalidatePostViews(queryClient, { postId, comments: true }),
            ]);

            toast.success(
                data?.message || "Reply created successfully"
            );

            // Clear input
            setReply("");

            // Clear image
            clearImage();

            // Close reply input
            onCancel();
        },

        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                "Reply could not be created";

            toast.error(message);

            console.error("Reply Error:", error?.response?.data || error);
        },
    });

    // =========================================
    // Submit
    // =========================================
    const handleSubmit = () => {
        const content = reply.trim();

        if (content.length < 2) {
            return;
        }

        if (isPending) {
            return;
        }

        if (typeof postId !== "string" || typeof commentId !== "string") {
            toast.error("Invalid post or comment");
            return;
        }

        mutate({
            content,
            image,
        });
    };

    // =========================================
    // Select Image
    // =========================================
    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate image
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");

            event.target.value = "";

            return;
        }

        // Remove previous preview URL
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        // Create new preview
        const previewUrl = URL.createObjectURL(file);

        previewUrlRef.current = previewUrl;

        setImage(file);
        setImagePreview(previewUrl);
    };

    // =========================================
    // Clear Image
    // =========================================
    const clearImage = () => {
        // Revoke current object URL
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = "";
        }

        setImage(null);
        setImagePreview("");

        // Reset input
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // =========================================
    // Cancel
    // =========================================
    const handleCancel = () => {
        if (isPending) {
            return;
        }

        clearImage();
        setReply("");

        onCancel();
    };

    return (
        <div className="mt-2 flex gap-2">

            {/* =========================================
                Current User Avatar
            ========================================= */}
            {userData?.photo ? (
                <img
                    src={userData.photo}
                    alt={userData?.name || "User"}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
            ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <FaUser className="text-[10px]" />
                </span>
            )}

            <div className="min-w-0 flex-1">

                <p className="mb-1 px-1 text-[10px] text-slate-500">
                    Replying as {userData?.name || "You"}
                </p>

                {/* =========================================
                    Input Container
                ========================================= */}
                <div
                    className="
                        flex items-center
                        rounded-2xl
                        border border-slate-200
                        bg-white
                        px-3 py-1.5
                        transition
                        focus-within:border-indigo-400
                    "
                >
                    <input
                        type="text"
                        value={reply}
                        onChange={(event) =>
                            setReply(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                !event.shiftKey
                            ) {
                                event.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Write a reply..."
                        autoFocus
                        disabled={isPending}
                        maxLength={500}
                        className="
                            min-w-0
                            flex-1
                            bg-transparent
                            text-xs
                            text-slate-700
                            outline-none
                            placeholder:text-slate-400
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    />

                    {/* =========================================
                        Image Button
                    ========================================= */}
                    <button
                        type="button"
                        onClick={() =>
                            imageInputRef.current?.click()
                        }
                        disabled={isPending}
                        aria-label="Add image"
                        className="
                            ml-2
                            flex h-7 w-7
                            items-center justify-center
                            rounded-full
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-indigo-600
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        <FaImage className="text-xs" />
                    </button>

                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isPending}
                        className="hidden"
                    />

                    {/* =========================================
                        Send Button
                    ========================================= */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            reply.trim().length < 2 ||
                            isPending
                        }
                        aria-label="Send reply"
                        className="
                            ml-1
                            flex h-7 w-7
                            items-center justify-center
                            rounded-full
                            bg-indigo-600
                            text-white
                            transition
                            hover:bg-indigo-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >
                        {isPending ? (
                            <span
                                className="
                                    h-3 w-3
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-white
                                    border-t-transparent
                                "
                            />
                        ) : (
                            <FaPaperPlane className="text-[10px]" />
                        )}
                    </button>
                </div>

                {/* =========================================
                    Image Preview
                ========================================= */}
                {imagePreview && (
                    <div className="relative mt-2 w-fit">

                        <img
                            src={imagePreview}
                            alt="Selected reply"
                            className="
                                h-24 w-24
                                rounded-xl
                                border border-slate-200
                                object-cover
                            "
                        />

                        <button
                            type="button"
                            onClick={clearImage}
                            disabled={isPending}
                            aria-label="Remove image"
                            className="
                                absolute
                                right-1 top-1
                                flex h-6 w-6
                                items-center justify-center
                                rounded-full
                                bg-black/60
                                text-white
                                transition
                                hover:bg-black/80
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <FaTimes className="text-[10px]" />
                        </button>
                    </div>
                )}

                {/* =========================================
                    Validation
                ========================================= */}
                {reply.length > 0 &&
                    reply.trim().length < 2 && (
                        <p className="mt-1 px-1 text-[10px] text-red-400">
                            Reply must be at least 2 characters.
                        </p>
                    )}

                {/* =========================================
                    Cancel
                ========================================= */}
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="
                        mt-1
                        flex items-center gap-1
                        px-1
                        text-[10px]
                        font-medium
                        text-red-400
                        transition
                        hover:text-red-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <FaTimes className="text-[8px]" />
                    Cancel
                </button>
            </div>
        </div>
    );
}
