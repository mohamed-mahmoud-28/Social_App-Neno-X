import { useContext, useState } from "react";
import { FaBell, FaCheck, FaChevronLeft, FaChevronRight, FaComment, FaHeart, FaRedo, FaReply, FaShare, FaTrash, FaUserPlus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { authContext } from "../../Context/AuthContextValue";
import { queryKeys } from "../../Hooks/queryKeys";
import { getNotifications } from "../../Hooks/useNotificationPolling";

const limit = 10;
const notificationStyles = {
  like: { Icon: FaHeart, icon: "text-rose-500", surface: "bg-rose-50" },
  reply: { Icon: FaReply, icon: "text-violet-600", surface: "bg-violet-50" },
  comment: { Icon: FaComment, icon: "text-sky-600", surface: "bg-sky-50" },
  share: { Icon: FaShare, icon: "text-cyan-600", surface: "bg-cyan-50" },
  follow: { Icon: FaUserPlus, icon: "text-emerald-600", surface: "bg-emerald-50" },
  default: { Icon: FaBell, icon: "text-blue-600", surface: "bg-blue-50" },
};

function getNotificationStyle(type) {
  const value = String(type || "").toLowerCase();
  return Object.entries(notificationStyles).find(([key]) => key !== "default" && value.includes(key))?.[1] || notificationStyles.default;
}

function getTime(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
}

function getTarget(notification) {
  const postId = notification?.post?._id || notification?.postId;
  if (postId) return `/details/${postId}`;
  const userId = notification?.user?._id || notification?.sender?._id || notification?.userId;
  return userId ? `/users/${userId}` : null;
}

function updateUnreadCount(response, nextCount) {
  const payload = response?.data?.data;
  if (!payload || typeof payload !== "object") return response;
  const countKey = "count" in payload ? "count" : "unreadCount" in payload ? "unreadCount" : null;
  if (!countKey) return response;

  return {
    ...response,
    data: { ...response.data, data: { ...payload, [countKey]: nextCount } },
  };
}

export default function Notifications() {
  const { authToken } = useContext(authContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications(page),
    queryFn: () => getNotifications(page, limit),
    enabled: Boolean(authToken),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  const responseData = notificationsQuery.data?.data?.data;
  const notifications = Array.isArray(responseData?.notifications) ? responseData.notifications : [];
  const meta = notificationsQuery.data?.data?.meta || responseData?.meta || {};
  const totalPages = Math.max(1, Number(meta.pages || meta.totalPages || 1));
  const { mutateAsync: markAsRead, isPending: isMarking } = useMutation({
    mutationFn: ({ notificationId }) => axios.patch(`https://route-posts.routemisr.com/notifications/${notificationId}/read`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
    onSuccess: (_, { notificationId, wasUnread }) => {
      queryClient.setQueriesData({ queryKey: queryKeys.notificationsRoot }, (current) => {
        const items = current?.data?.data?.notifications;
        if (!Array.isArray(items)) return current;
        return {
          ...current,
          data: {
            ...current.data,
            data: { ...current.data.data, notifications: items.map((item) => item?._id === notificationId ? { ...item, read: true } : item) },
          },
        };
      });
      if (wasUnread) {
        queryClient.setQueryData(queryKeys.unreadNotifications, (current) => {
          const count = current?.data?.data?.count ?? current?.data?.data?.unreadCount;
          return typeof count === "number" ? updateUnreadCount(current, Math.max(0, count - 1)) : current;
        });
      }
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Could not mark notification as read"),
  });
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMutation({
    mutationFn: () => axios.patch("https://route-posts.routemisr.com/notifications/read-all", {}, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
    onSuccess: (response) => {
      queryClient.setQueriesData({ queryKey: queryKeys.notificationsRoot }, (current) => {
        const items = current?.data?.data?.notifications;
        if (!Array.isArray(items)) return current;
        return {
          ...current,
          data: { ...current.data, data: { ...current.data.data, notifications: items.map((item) => ({ ...item, read: true })) } },
        };
      });
      queryClient.setQueryData(queryKeys.unreadNotifications, (current) => updateUnreadCount(current, 0));
      toast.success(response?.data?.message || "All notifications marked as read");
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Could not update notifications"),
  });
  async function openNotification(notification) {
    if (!notification?.read && notification?._id) { try { await markAsRead({ notificationId: notification._id, wasUnread: true }); } catch { return; } }
    const target = getTarget(notification);
    if (target) navigate(target);
  }
  if (notificationsQuery.isLoading) return <section aria-label="Loading notifications" className="mx-auto max-w-3xl space-y-3 px-4 py-8 sm:px-6">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl border border-slate-200/70 bg-white/70" />)}</section>;
  if (notificationsQuery.isError) return <section className="mx-auto max-w-xl px-4 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600"><FaBell /></span><h1 className="mt-4 text-xl font-bold text-slate-900">Couldnâ€™t load notifications</h1><p className="mt-2 text-sm text-slate-500">Please check your connection and try again.</p><button type="button" onClick={() => notificationsQuery.refetch()} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><FaRedo className="mr-2 inline" />Try again</button></section>;
  return <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6"><div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_12px_36px_-20px_rgba(15,23,42,0.24)]"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Activity</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Notifications</h1><p className="mt-1 text-sm text-slate-500">Updates from your community, all in one place.</p></div><button type="button" onClick={() => markAllAsRead()} disabled={isMarkingAll || notifications.every((item) => item?.read)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><FaCheck className="mr-2 inline" />{isMarkingAll ? "Updatingâ€¦" : "Mark all as read"}</button></header>{notifications.length === 0 ? <div className="px-6 py-20 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600"><FaBell /></span><h2 className="mt-5 text-lg font-bold text-slate-900">No notifications yet</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">When someone interacts with your posts or profile, youâ€™ll see it here.</p></div> : <div className="p-2 sm:p-3">{notifications.map((notification) => { const style = getNotificationStyle(notification?.type); const Icon = style.Icon; const unread = !notification?.read; return <article key={notification?._id} className={`group relative mb-1 flex items-start gap-1 rounded-2xl px-3 py-3 transition duration-200 last:mb-0 sm:gap-2 sm:px-4 ${unread ? "bg-blue-50/75 hover:bg-blue-100/75" : "hover:bg-slate-50"}`}><button type="button" onClick={() => openNotification(notification)} disabled={isMarking} className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left sm:gap-4"><span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.surface} ${style.icon}`}><Icon aria-hidden="true" /></span><span className="min-w-0 flex-1 pr-3"><span className={`block text-sm leading-5 ${unread ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>{notification?.message || "You have a new notification"}</span><span className="mt-1 block text-xs font-medium text-slate-500">{getTime(notification?.createdAt)}</span></span></button><span className="flex shrink-0 items-start gap-2"><button type="button" title="Delete unavailable" aria-label="Delete unavailable" aria-disabled="true" onClick={(event) => { event.stopPropagation(); }} className="mt-0.5 flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"><FaTrash aria-hidden="true" className="text-xs" /></button>{unread && <span aria-label="Unread" className="mt-3 h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_0_3px_rgba(34,211,238,0.16)]" />}</span></article> })}</div>} {totalPages > 1 && <nav aria-label="Notifications pages" className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"><FaChevronLeft />Previous</button><span className="text-sm font-medium text-slate-500">{page} / {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">Next<FaChevronRight /></button></nav>}</div></section>;
}

