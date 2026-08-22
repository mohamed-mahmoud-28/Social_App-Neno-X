
import PostCard from "../PostCard/PostCard";
import Spinner from "../Spinner/Spinner";
import CreatePost from "../CreatePost/CreatePost";
import { useApi } from "../../Hooks/useAbi";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";

export default function Home() {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useApi();
  if (isLoading) {
    return <Spinner />;
  }
  
  if (isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">
            We couldn't load the home feed
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {error?.message || "Please check your connection and try again."}
          </p>
        </div>
      </div>
    );
  }


  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-[650px] items-center justify-center px-4 text-center text-sm text-slate-500">
        No posts to show yet. Create the first one.
      </div>
    );
  }
  return (
    <div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-6 px-3 py-6 sm:px-5 lg:py-8 xl:grid-cols-[minmax(0,650px)_300px] xl:justify-center">

      <div className="flex min-w-0 flex-col items-center gap-5">

        {/* Create Post */}

        <CreatePost />


        {/* Posts */}

        {data.map((post) => (

          <PostCard
            isSingleComment={false}
            key={post._id}
            post={post}
          />

        ))}


      </div>
      <aside className="w-full self-start xl:sticky xl:top-[92px]">
        <FollowSuggestions />
      </aside>


    </div>
  );
}
