import { useEffect, useRef, useState } from "react";
import { LuCamera, LuImagePlus, LuX } from "react-icons/lu";

export default function ChangeCoverPhoto() {
    const inputRef = useRef(null);
    const previewUrlRef = useRef(null);
    const [preview, setPreview] = useState(null);

    function handleImageChange(e) {
        const file = e.target.files[0];

        if (!file) return;

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const nextPreview = URL.createObjectURL(file);
        previewUrlRef.current = nextPreview;
        setPreview(nextPreview);
    }

    function removeImage() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setPreview(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    useEffect(() => () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
    }, []);

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                    Cover Photo
                </h2>

                <p className="text-sm text-slate-500">
                    Change your cover photo
                </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-slate-100">

                <div className="h-48 w-full">

                    {preview ? (
                        <img
                            src={preview}
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                            <LuImagePlus size={42} />

                            <p className="mt-2 text-sm">
                                No cover photo selected
                            </p>
                        </div>
                    )}

                </div>

                {preview && (
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                    >
                        <LuX size={18} />
                    </button>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-md backdrop-blur transition hover:bg-white active:scale-95"
                >
                    <LuCamera size={18} />
                    Change Cover
                </button>

            </div>

        </div>
    );
}