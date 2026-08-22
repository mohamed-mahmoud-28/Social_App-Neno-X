import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { FaImage, FaPaperPlane, FaTimes, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { authContext } from "../../Context/AuthContextValue";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function CreatePost() {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const previewUrlRef = useRef(null);
    const { userData } = useContext(authContext)

    const queryClient = useQueryClient();
    // IMAGE
    const image = useRef(null);

    // BODY
    const body = useRef(null);

    // Prepare Data
    function prepareData() {
        const formData = new FormData();

        // Body
        const content = body.current?.value.trim();

        if (content) {
            formData.append("body", content);
        }

        // Image
        if (image.current?.files?.[0]) {
            formData.append("image", image.current.files[0]);
        }

        return formData;
    }

    // Create Post API
    function createPostFun() {
        return axios.post(
            "https://route-posts.routemisr.com/posts",
            prepareData(),
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createPostFun,

        onSuccess: async () => {
            toast.success("Post Created Successfully");
            await invalidatePostViews(queryClient);
            closeModal();
        },

        onError: () => {
            toast.error("Post Is Not Created");
        },
    });

    // Image Change
    function handleImageChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreview = URL.createObjectURL(file);
        previewUrlRef.current = nextPreview;
        setImagePreview(nextPreview);
    }

    // Remove Image
    function removeImage() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setImagePreview(null);

        if (image.current) {
            image.current.value = "";
        }
    }

    useEffect(() => () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
    }, []);

    // Close Modal
    function closeModal() {
        setIsOpen(false);

        removeImage();

        if (body.current) {
            body.current.value = "";
        }
    }

    // Click Outside Modal
    function handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }

    // Handle Post
    function handlePost() {
        const bodyValue = body.current?.value.trim();
        const imageFile = image.current?.files?.[0];

        if (!bodyValue && !imageFile) {
            toast.error("Write something or add an image");
            return;
        }

        mutate();
    }

    return (
        <>
            {/* Open Create Post */}

            <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">

                <div className="flex items-center gap-3">

                    {userData?.photo ? (
                        <img
                            src={userData.photo}
                            alt="User"
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-50"
                        />
                    ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-2 ring-indigo-50">
                            <FaUser />
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="flex-1 rounded-2xl border border-transparent bg-slate-100 px-5 py-3 text-left text-sm text-slate-500 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                        What's on your mind?
                    </button>

                </div>

            </div>


            {/* Modal */}

            {isOpen && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={handleBackdropClick}
                >

                    {/* Create Post Box */}

                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                        onMouseDown={(e) => e.stopPropagation()}
                    >

                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

                            <h2 className="text-xl font-bold text-slate-900">
                                Create Post
                            </h2>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isPending}
                                aria-label="Close create post dialog"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
                            >
                                <FaTimes />
                            </button>

                        </div>


                        {/* User */}

                        <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">

                            {userData?.photo ? (
                                <img
                                    src={userData.photo}
                                    alt="User"
                                    className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-50"
                                />
                            ) : (
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-2 ring-indigo-50">
                                    <FaUser />
                                </span>
                            )}

                            <div>

                                <h3 className="font-semibold text-gray-800">
                                    {userData?.name || "Your name"}
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Create a post
                                </p>

                            </div>

                        </div>


                        {/* Content */}

                        <div className="p-5 sm:p-6">

                            {/* Text */}

                            <textarea
                                ref={body}
                                autoFocus
                                placeholder="What's on your mind?"
                                className="min-h-36 w-full resize-none rounded-2xl border border-transparent bg-slate-50 p-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />


                            {/* Image Preview */}

                            {imagePreview && (

                                <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-200">

                                    <img
                                        src={imagePreview}
                                        alt="Post preview"
                                        className="w-full max-h-80 object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        disabled={isPending}
                                        aria-label="Remove selected image"
                                        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition disabled:opacity-50"
                                    >
                                        <FaTimes />
                                    </button>

                                </div>

                            )}


                            {/* Image Input */}

                            <label
                                htmlFor="post-image"
                                className="mt-4 flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-slate-300 p-3 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                            >

                                <FaImage className="text-xl" />

                                <span className="text-sm font-medium">
                                    Add Photo
                                </span>

                                <input
                                    ref={image}
                                    id="post-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isPending}
                                    className="hidden"
                                />

                            </label>


                            {/* Post Button */}

                            <button
                                type="button"
                                onClick={handlePost}
                                disabled={isPending}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >

                                <FaPaperPlane />

                                {isPending ? "Posting..." : "Post"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}
