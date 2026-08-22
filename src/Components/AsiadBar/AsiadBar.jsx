import { NavLink, Link } from "react-router-dom";
import {
  LuUser,
  LuSettings,
  LuLogOut,
  LuCircleUserRound,
  LuBell,
} from "react-icons/lu";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContextValue";
import { useLogout } from "../../Hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "../../Hooks/queryKeys";
import logoLight from "../../assets/logo-light.png";

export default function AsiadBar() {
  const { userData } = useContext(authContext);
  const logout = useLogout();
  const { data: unreadData } = useQuery({
    queryKey: queryKeys.unreadNotifications,
    queryFn: () => axios.get("https://route-posts.routemisr.com/notifications/unread-count", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
  });
  const unreadCount = unreadData?.data?.data?.count || unreadData?.data?.data?.unreadCount || 0;

  return (
    <aside className="fixed left-4 top-[92px] z-40 hidden w-72 flex-col gap-4 lg:flex">

      <Link to="/home" className="px-3">
        <img src={logoLight} alt="Venox" className="h-9 w-28 object-contain object-left" />
      </Link>

      {/* User */}
      <Link
        to="/profile"
        className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-indigo-100 hover:bg-indigo-50/40"
      >
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-600 ring-2 ring-white shadow-sm">
            {userData?.photo ? (
              <img
                src={userData.photo}
                alt={userData?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <LuUser size={19} />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-500">
              Welcome back
            </p>

            <h2 className="truncate text-sm font-semibold text-slate-800">
              {userData?.name || "Your profile"}
            </h2>
          </div>

        </div>
      </Link>

      {/* Navigation */}
      <nav aria-label="Account navigation" className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">

        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
          <LuCircleUserRound size={17} className="text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Account</h2>
        </div>

        <div className="flex flex-col gap-1">

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LuUser
                  size={21}
                  className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-indigo-700" : "text-indigo-500"
                    }`}
                />

                <span className="font-medium">
                  Profile
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"}`}
          >
            <LuBell size={21} className="text-indigo-500" />
            <span className="font-medium">Notifications</span>
            {unreadCount > 0 && <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-indigo-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LuSettings
                  size={21}
                  className={`transition-transform duration-200 group-hover:rotate-45 ${isActive ? "text-indigo-700" : "text-indigo-500"
                    }`}
                />

                <span className="font-medium">
                  Settings
                </span>
              </>
            )}
          </NavLink>

        </div>

      </nav>

      {/* Logout */}
      <div className="rounded-2xl border border-red-100 bg-white p-3 shadow-sm">

        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LuLogOut
            size={21}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />

          <span className="font-medium">
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}
