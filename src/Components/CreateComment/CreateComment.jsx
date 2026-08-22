import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaImage, FaPaperPlane, FaTimes  } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function CreateComment({ postId }) {
    const queryClient = useQueryClient();

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const imageInputRef = useRef(null);
    const previewUrlRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            content: "",
            image: "",
        },
    });

    function handleSubmitComment(data) {
        const content = data.content?.trim() || "";

        if (!content && !imageFile) {
            toast.error("Write a comment or add an image");
            return;
        }

        const formData = new FormData();

        if (content) {
            formData.append("content", content);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }

        mutate(formData);
    }

    function createCommentFun(formData) {
        return axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createCommentFun,

        onSuccess: async () => {
            toast.success("Comment was created");

            await invalidatePostViews(queryClient, { postId, comments: true });

            reset();
            removeImage();
        },

        onError: () => {
            toast.error("Comment could not be created");
        },
    });

    function handleImageChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            e.target.value = "";
            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreview = URL.createObjectURL(file);
        previewUrlRef.current = nextPreview;
        setImageFile(file);
        setImagePreview(nextPreview);
    }

    function removeImage() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setImagePreview(null);

        setImageFile(null);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    }

    useEffect(() => () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
    }, []);

    return (
        <form
            onSubmit={handleSubmit(handleSubmitComment)}
            className="mx-auto mb-3 w-[calc(100%-2rem)] sm:w-[calc(100%-2.5rem)]"
        >
            <div className="flex items-start gap-3">

                {/* Avatar */}
                {/* <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                /> */}

                <div className="flex-1">

                    {/* Comment Box */}
                    <div className="rounded-2xl border border-transparent bg-slate-100 px-4 py-3 transition focus-within:border-indigo-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50">

                        {/* Comment Input */}
                        <input
                            {...register("content")}
                            type="text"
                            aria-label="Write a comment"
                            placeholder="Write a comment..."
                            className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative mt-3 w-fit">

                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-xl"
                                />

                                {/* Remove Image */}
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    aria-label="Remove image preview"
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-red-600 transition"
                                >
                                    <FaTimes size={11} />

                                </button>

                            </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2">

                            {/* Image */}
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-indigo-600">

                                <FaImage size={17} />

                                <span>Photo</span>

                                <input
                                    ref={imageInputRef}
                                    onChange={(event) => {
                                        handleImageChange(event);
                                    }}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />

                            </label>

                            {/* Send */}
                            <button
                                type="submit"
                                disabled={isPending}
                                aria-label={isPending ? "Sending comment" : "Send comment"}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
                            >
                                
                                    {isPending ? <AiOutlineLoading3Quarters size={14} className="animate-spin"/> : <FaPaperPlane size={14} />}
                                
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
}
