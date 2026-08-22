import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { queryKeys } from "./queryKeys";

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const getUnreadNotifications = () =>
  axios.get("https://route-posts.routemisr.com/notifications/unread-count", { headers: headers() });

export const getNotifications = (page = 1, limit = 10) =>
  axios.get(`https://route-posts.routemisr.com/notifications?unread=false&page=${page}&limit=${limit}`, { headers: headers() });

// The current backend exposes REST endpoints, not a socket/SSE stream. Polling
// these shared query keys gives live-enough updates without duplicate requests.
export function useNotificationPolling(authToken) {
  const knownIds = useRef(null);

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications(1),
    queryFn: () => getNotifications(1),
    enabled: Boolean(authToken),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });

  useQuery({
    queryKey: queryKeys.unreadNotifications,
    queryFn: getUnreadNotifications,
    enabled: Boolean(authToken),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    const notifications = notificationsQuery.data?.data?.data?.notifications;
    if (!Array.isArray(notifications)) return;

    const nextIds = new Set(notifications.map((item) => item?._id).filter(Boolean));
    if (knownIds.current) {
      const newUnread = notifications.find((item) => item?._id && !knownIds.current.has(item._id) && !item.read);
      if (newUnread) toast.info(newUnread.message || "You have a new notification");
    }
    knownIds.current = nextIds;
  }, [notificationsQuery.data]);
}
