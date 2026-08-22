import { Link } from "react-router-dom";
import CreateComment from "../CreateComment/CreateComment";

import {
  FaHeart,
  FaRegComment,
  FaGlobeAmericas,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

import CommentCard from "../CommentCard/CommentCard";
import axios from "axios";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import DropdownButton from "../DropdownButton/DropdownButton";
import { useContext, useState } from "react";
import { authContext } from "../../Context/AuthContextValue";
import { toast } from "react-toastify";

import FollowUser from "../FollowUser/FollowUser";
import LikesModal from "../LikesModal/LikesModal";
import SharePost from "../SharePost/SharePost";
import { queryKeys } from "../../Hooks/queryKeys";
import { invalidatePostViews } from "../../Hooks/postCache";

export default function PostCard({
  post,
  isSingleComment = false,
  queryKey,
}) {
  const { userData, getUserData } = useContext(authContext);
  const queryClient = useQueryClient();
  

  // ===================== States =====================

  const [likesModalOpen, setLikesModalOpen] = useState(false);

  // ===================== Like =====================

  const isLiked = post?.likes?.includes(userData?._id);

  // ===================== Post Data =====================

  const {
    user,
    body,
    image,
    createdAt,
    likesCount,
    commentsCount,
    sharesCount,
    isShare,
    sharedPost,
  } = post || {};

  // ===================== Comments =====================

  function getAllComments() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${post?._id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  const { data: commentsData } = useQuery({
    queryKey: queryKeys.comments(post?._id),
    queryFn: getAllComments,
    enabled: isSingleComment && !!post?._id,
  });

  const comments = Array.isArray(commentsData?.data?.data?.comments)
    ? commentsData.data.data.comments
    : [];

  // ===================== Like API =====================

  function setLike() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post?._id}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  const {
    mutate: handleLikePost,
    isPending: isLiking,
  } = useMutation({
    mutationFn: setLike,

    onSuccess: async () => {
      await invalidatePostViews(queryClient, { postId: post?._id });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    },
  });

  // ===================== Bookmark API =====================

  function setBookmark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post?._id}/bookmark`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  const {
    mutate: handleBookmark,
    isPending: isBookmarking,
  } = useMutation({
    mutationFn: setBookmark,

    onSuccess: async (response) => {
      await invalidatePostViews(queryClient, { postId: post?._id });

      await getUserData();

      toast.success(
        response?.data?.message ||
        "Bookmark updated successfully"
      );
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    },
  });

  // ===================== Helpers =====================

  const postDetailsLink = `/details/${post?._id}`;
  const userProfileLink = user?._id === userData?._id ? "/profile" : `/users/${user?._id}`;
  const sharedProfileLink = sharedPost?.user?._id === userData?._id ? "/profile" : `/users/${sharedPost?.user?._id}`;

  const postUserPhoto =
    userData?._id === user?._id
      ? userData?.photo
      : user?.photo;

  const isMyPost = userData?._id === user?._id;

  const isBookmarked =
    post?.isBookmarked ||
    post?.bookmarked ||
    false;

  // ===================== Render =====================

  return (
    <>
      <article className="w-full mx-auto overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">

        {/* ===================== Header ===================== */}

        <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">

          {/* User */}

          <div className="flex min-w-0 flex-1 items-center gap-3">

            {/* User Photo */}

            <Link to={userProfileLink} className="shrink-0" aria-label={`View ${user?.name || "user"} profile`}>
              {postUserPhoto ? (
                <img
                  src={postUserPhoto}
                  alt={user?.name || "User"}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-50 transition hover:ring-indigo-100"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600 ring-2 ring-indigo-50">
                  {user?.name?.charAt(0) || "U"}
                </span>
              )}
            </Link>

            {/* User Info */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">

                <Link to={userProfileLink} className="truncate text-sm font-semibold text-slate-900 transition hover:text-indigo-600">
                  {isShare ? `${user?.name} shared a post` : user?.name}
                </Link>

              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">

                <span className="truncate">
                  @{user?.username}
                </span>

                <span>•</span>

                <span>
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : ""}
                </span>

                <span>•</span>

                <FaGlobeAmericas className="text-[10px]" />

              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex shrink-0 items-center gap-2">

            {/* Follow */}

            {!isMyPost && (
              <FollowUser
                userid={user?._id}
                queryKey={queryKey}
              />
            )}

            {/* Dropdown */}

            {isMyPost && (
              <DropdownButton
                postId={post?._id}
                post={post}
                queryKey={queryKey}
              />
            )}

          </div>

        </div>

        {/* ===================== Post Body ===================== */}

        {body && (
          <Link
            to={postDetailsLink}
            className="block px-4 pb-4 sm:px-5"
          >
            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
              {body}
            </p>
          </Link>
        )}

        {/* ===================== Normal Image ===================== */}

        {image && !isShare && (
          <Link
            to={postDetailsLink}
            className="block w-full"
          >
            <img
              src={image}
              alt="Post"
              loading="lazy"
              decoding="async"
              className="max-h-[520px] w-full object-cover"
            />
          </Link>
        )}

        {/* ===================== Shared Post ===================== */}

        {isShare && sharedPost && (
          <div
            className="mx-4 mb-4 block overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:mx-5"
          >

            {/* Shared User */}

            <div className="flex items-center gap-2 p-2.5">

              <Link to={sharedProfileLink} className="shrink-0" aria-label={`View ${sharedPost.user?.name || "user"} profile`}>
              {sharedPost.user?.photo ? (
                <img
                  src={sharedPost.user.photo}
                  alt={sharedPost.user?.name || "User"}
                  loading="lazy"
                  decoding="async"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                  {sharedPost.user?.name?.charAt(0) || "U"}
                </span>
              )}
              </Link>

              <Link to={sharedProfileLink}>

                <h4 className="text-xs font-semibold text-slate-900">
                  {sharedPost.user?.name}
                </h4>

                <p className="text-[11px] text-slate-500">
                  @{sharedPost.user?.username}
                </p>

              </Link>

            </div>

            {/* Shared Body */}

            {sharedPost.body && (
              <Link to={postDetailsLink} className="block px-2.5 pb-2.5">
                <p className="whitespace-pre-line text-xs text-slate-700">
                  {sharedPost.body}
                </p>
              </Link>
            )}

            {/* Shared Image */}

            {sharedPost.image && (
              <Link to={postDetailsLink} className="block">
                <img
                  src={sharedPost.image}
                  alt="Shared post"
                  loading="lazy"
                  decoding="async"
                  className="max-h-[450px] w-full object-cover"
                />
              </Link>
            )}

          </div>
        )}

        {/* ===================== Statistics ===================== */}

        <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 sm:px-5">

          <div className="flex items-center gap-3">

            {/* Likes */}

            <button
              type="button"
              onClick={() => setLikesModalOpen(true)}
              className="transition hover:text-slate-800"
            >
              {likesCount || 0}{" "}
              {likesCount === 1 ? "Like" : "Likes"}
            </button>

            {/* Comments */}

            <Link
              to={postDetailsLink}
              className="transition hover:text-slate-800"
            >
              {commentsCount || 0}{" "}
              {commentsCount === 1
                ? "Comment"
                : "Comments"}
            </Link>

            {/* Shares */}

            {sharesCount > 0 && (
              <span>
                {sharesCount}{" "}
                {sharesCount === 1
                  ? "Share"
                  : "Shares"}
              </span>
            )}

          </div>

        </div>

        {/* ===================== Divider ===================== */}

        <div className="mx-4 border-t border-slate-100 sm:mx-5" />

        {/* ===================== Actions ===================== */}

        <div className="grid grid-cols-4 gap-1 px-3 py-2 sm:px-4">

          {/* Like */}

          <button
            type="button"
            onClick={handleLikePost}
            disabled={isLiking}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs transition ${isLiked
              ? "bg-rose-50 text-rose-500"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              } ${isLiking
                ? "cursor-not-allowed opacity-60"
                : ""
              }`}
          >
            <FaHeart
              className={
                isLiked ? "fill-current" : ""
              }
            />

            <span>
              {isLiking
                ? "Liking..."
                : isLiked
                  ? "Liked"
                  : "Like"}
            </span>
          </button>

          {/* Comment */}

          <Link
            to={postDetailsLink}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <FaRegComment />

            <span>
              Comment
            </span>
          </Link>

          {/* Share UI Only */}

          <SharePost post={post} queryKey={queryKey} />

          {/* Bookmark */}

          <button
            type="button"
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs transition ${isBookmarked
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              } ${isBookmarking
                ? "cursor-not-allowed opacity-60"
                : ""
              }`}
          >
            {isBookmarked ? (
              <FaBookmark />
            ) : (
              <FaRegBookmark />
            )}

            <span>
              {isBookmarking
                ? "Saving..."
                : isBookmarked
                  ? "Saved"
                  : "Save"}
            </span>
          </button>

        </div>

        {/* ===================== Top Comment ===================== */}

        {!isSingleComment &&
          post?.topComment && (
            <CommentCard
              comment={post.topComment}
              post={post}
              postQueryKey={queryKey || queryKeys.posts}
            />
          )}

        {/* ===================== All Comments ===================== */}

        {isSingleComment &&
          comments.map(
            (comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                post={post}
                postQueryKey={queryKey || queryKeys.postById(post?._id)}
              />
            )
          )}

        {/* ===================== Create Comment ===================== */}

        <CreateComment
          postId={post?._id}
          queryKey={
            queryKey ||
            (isSingleComment
              ? queryKeys.postById(post?._id)
              : queryKeys.posts)
          }
        />

      </article>

      {/* ===================== Likes Modal ===================== */}

      {likesModalOpen && (
        <LikesModal
          postId={post?._id}
          isOpen={likesModalOpen}
          onClose={() =>
            setLikesModalOpen(false)
          }
        />
      )}
    </>
  );
}
