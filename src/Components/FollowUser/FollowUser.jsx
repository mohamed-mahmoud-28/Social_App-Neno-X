import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { authContext } from "../../Context/AuthContextValue";
import { queryKeys } from "../../Hooks/queryKeys";
import { invalidateUserViews } from "../../Hooks/postCache";

export default function FollowUser({ userid, queryKey }) {
    const { userData, getUserData } = useContext(authContext);

    const query = useQueryClient();
    const isFollowing = userData?.following?.some((followingUser) =>
        (typeof followingUser === "string" ? followingUser : followingUser?._id) === userid
    );


    // ================= Follow / Unfollow =================

    function followAndUnfollow() {
        return axios.put(
            `https://route-posts.routemisr.com/users/${userid}/follow`, {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    // ================= Mutation =================

    const {
        mutate,
        isPending,
    } = useMutation({
        mutationFn: followAndUnfollow,

        onSuccess: async () => {
            await getUserData();

            if (queryKey) {
                query.invalidateQueries({ queryKey });
            }

            await invalidateUserViews(query);
            query.invalidateQueries({ queryKey: queryKeys.followSuggestions });

            query.invalidateQueries({
                queryKey: queryKeys.userProfile(userid),
            });

            toast.success(
                isFollowing
                    ? "Unfollowed successfully"
                    : "Followed successfully"
            );
        },

        onError: (error) => {

            toast.error(
                error?.response?.data?.message ||
                "Something went wrong"
            );
        },
    });

    return (
        <button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${isFollowing
                ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                } ${isPending
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
        >
            {isFollowing ? (
                <>
                    <FaUserCheck />

                    <span>
                        {isPending ? "Loading..." : "Following"}
                    </span>
                </>
            ) : (
                <>
                    <FaUserPlus />

                    <span>
                        {isPending ? "Loading..." : "Follow"}
                    </span>
                </>
            )}
        </button>
    );
}
