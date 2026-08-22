import { queryKeys } from "./queryKeys";

// Posts appear in several independently queried views. Keeping this list in
// one place prevents a mutation from refreshing only its originating view.
export async function invalidatePostViews(queryClient, { postId, comments = false } = {}) {
  const keys = [
    queryKeys.posts,
    queryKeys.post,
    ["profilePosts"],
    queryKeys.homeFeed,
    queryKeys.bookmarks,
  ];

  if (comments && postId) keys.push(queryKeys.comments(postId));
  if (postId) keys.push(queryKeys.postLikes(postId));

  await Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
}

// User fields are embedded in posts, comments and like lists. Profile changes
// are uncommon, so refreshing those active views keeps every avatar/name view
// consistent without keeping separate copies of the same user in component state.
export async function invalidateUserViews(queryClient) {
  const keys = [
    queryKeys.posts,
    queryKeys.post,
    ["profilePosts"],
    queryKeys.homeFeed,
    queryKeys.bookmarks,
    ["userProfile"],
    ["postLikes"],
    ["comments"],
    ["replies"],
  ];

  await Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
}
