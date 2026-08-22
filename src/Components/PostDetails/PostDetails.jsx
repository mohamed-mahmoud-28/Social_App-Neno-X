import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import PostCard from "../PostCard/PostCard"
import Spinner from "../Spinner/Spinner"
import { queryKeys } from "../../Hooks/queryKeys"


export default function PostDetails() {
  const { id } = useParams()
  
  function getPost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.postById(id),
    queryFn: getPost
  })
  
  
  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">We couldn't load this post</h2>
          <p className="mt-2 text-sm text-slate-500">
            {error?.message || "Please try again in a moment."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-2xl px-3 pb-6 sm:px-5">
      <PostCard
        isSingleComment={true}
        post={data?.data?.data?.post}
        queryKey={queryKeys.postById(id)}
      />
    </div>
  )
}
