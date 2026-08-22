import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export function useApi() {
  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      params: {
        sort: "-createdAt",
      },

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.posts,

    queryFn: getAllPosts,

    select: (data) => {
      return data?.data?.data?.posts || [];
    },
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
}
