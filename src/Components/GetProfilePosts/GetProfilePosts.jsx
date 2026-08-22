import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContextValue";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner/Spinner";
import PostCard from "../PostCard/PostCard";
import { queryKeys } from "../../Hooks/queryKeys";

export default function GetProfilePosts() {

    const { userData } = useContext(authContext);

    function getProfilePosts() {

        return axios.get(
            `https://route-posts.routemisr.com/users/${userData?._id}/posts`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    }

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.profilePosts(userData?._id),
        queryFn: getProfilePosts,
        enabled: !!userData?._id,

    });

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <p className="text-center text-red-500">
                Failed to load posts
            </p>
        );
    }

    const posts = Array.isArray(data?.data?.data?.posts)
        ? data.data.data.posts
        : [];

    return (
        <div className="space-y-5">

            {posts.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-800">
                        No Posts Yet
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        You haven't created any posts yet.
                    </p>

                </div>

            ) : (

                posts.map((post) => (
                    <PostCard
                        queryKey={queryKeys.profilePosts(userData?._id)}
                        key={post._id}
                        post={post}
                    />
                ))

            )}

        </div>
    );
}
