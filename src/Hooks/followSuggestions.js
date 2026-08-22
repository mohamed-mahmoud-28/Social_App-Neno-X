import axios from "axios";

export function fetchFollowSuggestions(limit = 10) {
  return axios.get(
    `https://route-posts.routemisr.com/users/suggestions?limit=${limit}`,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
}

export function selectSuggestionUsers(response) {
  const users = response?.data?.data?.users ?? response?.data?.data;
  return Array.isArray(users) ? users : [];
}
