import { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaEllipsisV, FaHeart, FaImage, FaRegHeart, FaTimes, FaTrash, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { authContext } from "../../Context/AuthContextValue";
import CommentReply from "../CommentReply/CommentReply";
import { queryKeys } from "../../Hooks/queryKeys";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function CommentCard({ comment, post }) {
    const { userData } = useContext(authContext);
    const queryClient = useQueryClient();
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState("");
    const imageInputRef = useRef(null);
    const previewUrlRef = useRef("");

    const commentCreator = comment?.commentCreator;
    const commentCreatorId = commentCreator?._id;
    const isCommentOwner = commentCreatorId === userData?._id;
    const commentName = isCommentOwner ? userData?.name : commentCreator?.name;
    const commentPhoto = isCommentOwner ? userData?.photo : commentCreator?.photo;
    const commentProfileLink = isCommentOwner
        ? "/profile"
        : commentCreatorId ? `/users/${commentCreatorId}` : null;

    const postId = typeof post === "string" ? post : typeof post?._id === "string" ? post._id : "";
    const commentId = typeof comment?._id === "string" ? comment._id : "";
    const hasValidIds = Boolean(postId && commentId);
    const likes = Array.isArray(comment?.likes) ? comment.likes : [];
    const isLiked = likes.some((like) => (typeof like === "string" ? like : like?._id) === userData?._id);
    const likesCount = typeof comment?.likesCount === "number" ? comment.likesCount : likes.length;

    const clearEditImage = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = "";
        }
        setEditImage(null);
        setEditImagePreview("");
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    useEffect(() => () => {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    }, []);

    const refreshComments = async () => {
        await invalidatePostViews(queryClient, { postId, comments: true });
    };

    const { data: repliesData, isLoading: repliesLoading, isError: repliesError } = useQuery({
        queryKey: queryKeys.replies(postId, commentId),
        queryFn: async () => {
            const { data } = await axios.get(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            return data;
        },
        enabled: hasValidIds && showReplies,
    });

    const replies = Array.isArray(repliesData?.data)
        ? repliesData.data
        : Array.isArray(repliesData?.data?.replies)
            ? repliesData.data.replies
            : Array.isArray(repliesData?.replies) ? repliesData.replies : [];

    const { mutate: updateComment, isPending: isUpdating } = useMutation({
        mutationFn: async ({ content, image }) => {
            const formData = new FormData();
            formData.append("content", content);
            if (image) formData.append("image", image);
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
                formData,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            return data;
        },
        onSuccess: async (data) => {
            await refreshComments();
            clearEditImage();
            setIsEditing(false);
            toast.success(data?.message || "Comment updated successfully");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Comment could not be updated"),
    });

    const { mutate: deleteComment, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.delete(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            return data;
        },
        onSuccess: async (data) => {
            await refreshComments();
            setShowDeleteConfirm(false);
            toast.success(data?.message || "Comment deleted successfully");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Comment could not be deleted"),
    });

    const { mutate: toggleLike, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            return data;
        },
        onSuccess: async (data) => {
            await refreshComments();
            toast.success(data?.message || (isLiked ? "Comment unliked" : "Comment liked"));
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Could not update comment like"),
    });

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape" || isUpdating || isDeleting) return;

            setShowActions(false);
            setShowDeleteConfirm(false);

            if (isEditing) {
                clearEditImage();
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isDeleting, isEditing, isUpdating]);

    const openEditor = () => {
        setEditedContent(comment?.content || "");
        clearEditImage();
        setShowActions(false);
        setIsEditing(true);
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            event.target.value = "";
            return;
        }
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const previewUrl = URL.createObjectURL(file);
        previewUrlRef.current = previewUrl;
        setEditImage(file);
        setEditImagePreview(previewUrl);
    };

    const saveEdit = () => {
        const content = editedContent.trim();
        if (content.length < 2 || isUpdating) return;
        if (!hasValidIds) return toast.error("Invalid post or comment");
        updateComment({ content, image: editImage });
    };

    const removeComment = () => {
        if (!hasValidIds) return toast.error("Invalid post or comment");
        setShowActions(false);
        setShowDeleteConfirm(true);
    };

    const likeComment = () => {
        if (!hasValidIds) return toast.error("Invalid post or comment");
        toggleLike();
    };

    const ReplyAvatar = ({ creator, reply }) => {
        const creatorId = typeof creator === "string" ? creator : creator?._id;
        const isCurrentUser = creatorId === userData?._id;
        const name = isCurrentUser ? userData?.name : creator?.name;
        const photo = isCurrentUser ? userData?.photo : creator?.photo;
        const profileLink = isCurrentUser ? "/profile" : creatorId ? `/users/${creatorId}` : null;
        return (
            <div className="mb-3 flex gap-2" key={reply?._id}>
                {profileLink && (
                    <Link to={profileLink} className="shrink-0" aria-label={`View ${name || "user"} profile`}>
                        {photo ? <img src={photo} alt={name || "User"} loading="lazy" decoding="async" className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200" /> : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><FaUser className="text-[10px]" /></span>}
                    </Link>
                )}
                <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 px-3 py-2">
                    {name && profileLink && <Link to={profileLink} className="text-[11px] font-semibold text-slate-800 hover:text-indigo-600">{name}</Link>}
                    {reply?.content && <p className="mt-1 text-xs leading-5 text-slate-600">{reply.content}</p>}
                    {reply?.image && <img src={reply.image} alt="Reply" loading="lazy" decoding="async" className="mt-2 max-h-60 max-w-xs rounded-lg object-cover" />}
                </div>
            </div>
        );
    };

    return (
        <div className="p-3">
            <div className="flex gap-3">
                {commentProfileLink ? (
                    <Link to={commentProfileLink} className="shrink-0" aria-label={`View ${commentName || "user"} profile`}>
                        {commentPhoto ? <img src={commentPhoto} alt={commentName || "User"} loading="lazy" decoding="async" className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-50" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-2 ring-indigo-50"><FaUser className="text-xs" /></span>}
                    </Link>
                ) : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><FaUser className="text-xs" /></span>}

                <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-slate-100 px-3 py-2.5">
                        <div className="flex items-start justify-between gap-2">
                            {commentProfileLink ? <Link to={commentProfileLink} className="text-xs font-semibold text-slate-800 hover:text-indigo-600">{commentName || "User"}</Link> : <span className="text-xs font-semibold text-slate-800">{commentName || "User"}</span>}

                            {isCommentOwner && <div className="relative -mr-1 -mt-1">
                                <button type="button" onClick={() => setShowActions((value) => !value)} aria-label="Comment actions" aria-expanded={showActions} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">
                                    <FaEllipsisV className="text-xs" />
                                </button>

                                {showActions && <>
                                    <button type="button" aria-label="Close comment actions" onClick={() => setShowActions(false)} className="fixed inset-0 z-10 cursor-default" />
                                    <div className="absolute right-0 top-8 z-20 w-36 origin-top-right rounded-xl border border-slate-200 bg-white p-1 shadow-lg transition duration-150 ease-out animate-in fade-in zoom-in-95 slide-in-from-top-1">
                                        <button type="button" onClick={openEditor} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-100">
                                            <FaEdit className="text-slate-500" /> Edit
                                        </button>
                                        <button type="button" onClick={removeComment} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </>}
                            </div>}
                        </div>

                        {comment?.content && <p className="mt-1 text-xs leading-5 text-slate-700">{comment.content}</p>}
                        {comment?.image && <img src={comment.image} alt="Comment" loading="lazy" decoding="async" className="mt-2 max-h-72 max-w-xs rounded-lg object-cover" />}
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-3 px-1 text-[10px] font-medium text-slate-500">
                        <button type="button" onClick={likeComment} disabled={isLiking} className={`flex items-center gap-1 disabled:opacity-50 ${isLiked ? "text-rose-500" : "hover:text-indigo-600"}`}>{isLiked ? <FaHeart className="fill-current" /> : <FaRegHeart />}{isLiking ? "Loading..." : isLiked ? "Liked" : "Like"}{likesCount > 0 && <span>({likesCount})</span>}</button>
                        <button type="button" onClick={() => { setShowReply(true); setShowReplies(true); }} className="hover:text-indigo-600">Reply</button>
                        <button type="button" onClick={() => setShowReplies((value) => !value)} className="hover:text-indigo-600">{showReplies ? "Hide replies" : "View replies"}</button>
                    </div>

                    {showReply && <CommentReply postId={postId} commentId={commentId} onCancel={() => setShowReply(false)} />}

                    {showReplies && <div className="mt-3 ml-4 border-l-2 border-slate-200 pl-3">
                        {repliesLoading && <p className="py-2 text-xs text-slate-400">Loading replies...</p>}
                        {repliesError && <p className="py-2 text-xs text-red-400">Failed to load replies.</p>}
                        {!repliesLoading && !repliesError && replies.length === 0 && <p className="py-2 text-xs text-slate-400">No replies yet.</p>}
                        {!repliesLoading && !repliesError && replies.map((reply) => <ReplyAvatar key={reply?._id} creator={reply?.replyCreator || reply?.user} reply={reply} />)}
                    </div>}
                </div>
            </div>

            {isEditing && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={() => !isUpdating && (clearEditImage(), setIsEditing(false))}>
                <div role="dialog" aria-modal="true" aria-labelledby="edit-comment-title" className="w-full max-w-lg rounded-2xl bg-white shadow-2xl transition duration-200 ease-out" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 id="edit-comment-title" className="text-base font-semibold text-slate-800">Edit Comment</h2>
                        <button type="button" onClick={() => { if (!isUpdating) { clearEditImage(); setIsEditing(false); } }} disabled={isUpdating} aria-label="Close edit comment dialog" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"><FaTimes /></button>
                    </div>
                    <div className="space-y-3 p-5">
                        <textarea value={editedContent} onChange={(event) => setEditedContent(event.target.value)} disabled={isUpdating} rows={4} aria-label="Edit comment" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-60" />
                        {comment?.image && !editImagePreview && <img src={comment.image} alt="Current comment" className="max-h-48 max-w-full rounded-xl object-cover" />}
                        {editImagePreview && <div className="relative w-fit"><img src={editImagePreview} alt="New comment preview" className="h-28 w-28 rounded-xl border border-slate-200 object-cover" /><button type="button" onClick={clearEditImage} disabled={isUpdating} aria-label="Remove selected image" className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-50"><FaTimes className="text-xs" /></button></div>}
                        <button type="button" onClick={() => imageInputRef.current?.click()} disabled={isUpdating} className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 disabled:opacity-50"><FaImage /> Change photo</button>
                        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        {editedContent.length > 0 && editedContent.trim().length < 2 && <p className="text-xs text-red-500">Comment must be at least 2 characters.</p>}
                    </div>
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                        <button type="button" onClick={() => { if (!isUpdating) { clearEditImage(); setIsEditing(false); } }} disabled={isUpdating} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">Cancel</button>
                        <button type="button" onClick={saveEdit} disabled={isUpdating || editedContent.trim().length < 2} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{isUpdating ? "Saving..." : "Save Changes"}</button>
                    </div>
                </div>
            </div>}

            {showDeleteConfirm && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onMouseDown={() => !isDeleting && setShowDeleteConfirm(false)}>
                <div role="dialog" aria-modal="true" aria-labelledby="delete-comment-title" className="w-full max-w-sm rounded-2xl bg-white shadow-2xl transition duration-200 ease-out" onMouseDown={(event) => event.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <h2 id="delete-comment-title" className="text-base font-semibold text-slate-800">Delete comment?</h2>
                        <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} aria-label="Close delete confirmation" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"><FaTimes /></button>
                    </div>
                    <div className="px-5 py-5"><p className="text-sm leading-6 text-slate-600">Are you sure you want to delete this comment? This action cannot be undone.</p></div>
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
                        <button type="button" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">Cancel</button>
                        <button type="button" onClick={() => deleteComment()} disabled={isDeleting} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete"}</button>
                    </div>
                </div>
            </div>}
        </div>
    );
}
