import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { LuCamera, LuImagePlus, LuX, LuUpload } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authContext } from "../../Context/AuthContextValue";
import { invalidateUserViews } from "../../Hooks/postCache";

export default function ChangeProfilePhoto() {
    const inputRef = useRef(null);
    const previewUrlRef = useRef(null);
    const { getUserData , userData } = useContext(authContext);
    const queryClient = useQueryClient();

    const [preview, setPreview] = useState(null);
    const [photo, setPhoto] = useState(null);

    function handleImageChange(e) {
        const selectedPhoto = e.target.files[0];

        if (!selectedPhoto) return;

        if (!selectedPhoto.type.startsWith("image/")) {
            toast.error("Please select an image file");
            e.target.value = "";
            return;
        }

        if (selectedPhoto.size > 5 * 1024 * 1024) {
            toast.error("Image size must be 5 MB or less");
            e.target.value = "";
            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreview = URL.createObjectURL(selectedPhoto);

        setPhoto(selectedPhoto);
        setPreview(nextPreview);
        previewUrlRef.current = nextPreview;
    }

    function removeImage() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setPreview(null);
        setPhoto(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    function uploadProfilePhoto() {
        const formData = new FormData();

        formData.append("photo", photo);

        return axios.put(
            "https://route-posts.routemisr.com/users/upload-photo",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const { mutate, isPending } = useMutation({
        mutationFn: uploadProfilePhoto,

        onSuccess: async () => {
            toast.success("Profile photo updated successfully");
            await getUserData();
            await invalidateUserViews(queryClient);
            removeImage();
        },

        onError: () => {
            toast.error("Failed to update profile photo");
        },
    });

    function handleUpload() {
        if (!photo) {
            toast.error("Please select a photo first");
            return;
        }

        mutate();
    }

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                    Profile Photo
                </h2>

                <p className="text-sm text-slate-500">
                    Change your profile picture
                </p>
            </div>

            {/* Image */}
            <div className="flex flex-col items-center gap-5">

                <div className="relative">

                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-2 ring-slate-200">

                        {preview || userData?.photo ? (
                            <img
                                src={preview || userData?.photo}
                                alt="Profile preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <LuImagePlus size={40} />
                            </div>
                        )}

                    </div>

                    {/* Remove */}
                    {preview && (
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600 active:scale-95"
                        >
                            <LuX size={17} />
                        </button>
                    )}

                </div>

                {/* File Input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {/* Buttons */}
                <div className="flex flex-wrap justify-center gap-3">

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
                    >
                        <LuCamera size={18} />

                        Choose Photo
                    </button>

                    {photo && (
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                        >
                            <LuUpload size={18} />

                            {isPending ? "Uploading..." : "Upload Photo"}
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}
