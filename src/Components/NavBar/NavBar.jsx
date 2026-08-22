import { NavLink, Link } from "react-router-dom";
import { FaBars, FaBell, FaTimes, FaUser, FaUsers } from "react-icons/fa";
import { useContext, useState } from "react";
import { authContext } from "./../../Context/AuthContextValue";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "../../Hooks/queryKeys";
import logoLight from "../../assets/logo-light.png";
export default function NavBar() {
  const { authToken, userData } = useContext(authContext);
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadData } = useQuery({
    queryKey: queryKeys.unreadNotifications,
    queryFn: () =>
      axios.get(
        "https://route-posts.routemisr.com/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ),
    enabled: Boolean(authToken),
  });

  const unreadCount =
    unreadData?.data?.data?.count ||
    unreadData?.data?.data?.unreadCount ||
    0;

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  const navItemClass = ({ isActive }) =>
    `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
      ? "bg-indigo-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav
      aria-label="Primary navigation"
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex h-[72px] items-center justify-between gap-4">
          {/* ==================== LEFT - LOGO ==================== */}
          <Link
            to="/home"
            className="flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.02]"
          >
            <img
              src={logoLight}
              alt="Venox"
              className="h-10 w-[116px] object-contain object-left"
            />
          </Link>

          {/* ==================== CENTER - NAVIGATION ==================== */}
          {authToken && (
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 shadow-sm">
                <NavLink to="/home" className={navItemClass}>
                  Home
                </NavLink>

                <NavLink
                  to="/following-users"
                  className={navItemClass}
                >
                  Following Users
                </NavLink>

                <NavLink to="/follow-suggestions" className={navItemClass}>
                  Discover People
                </NavLink>

                <NavLink to="/profile" className={navItemClass}>
                  Profile
                </NavLink>
              </div>
            </div>
          )}

          {/* ==================== RIGHT ==================== */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {authToken ? (
              <>
                {/* Notifications */}
                <NavLink
                  to="/notifications"
                  aria-label="Notifications"
                  className="group relative flex h-11 w-11 items-center justify-center  transition-all duration-200 hover:text-indigo-600"
                >
                  <FaBell className="text-[15px] transition-transform duration-200 group-hover:scale-110" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-5 text-white shadow-sm ring-2 ring-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </NavLink>

                <div className="border border-.2 border-b-zinc-700 h-10 rounded-xl"></div>

                {/* Account */}
                <Link
                  to="/profile"
                  className="flex items-center gap-3  px-3 py-1.5 transition-all duration-200"
                >
                  {userData?.photo ? (
                    <img
                      src={userData.photo}
                      alt={userData?.name || "User"}
                      width="40"
                      height="40"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                      <FaUser className="text-sm" />
                    </span>
                  )}

                  <div className="hidden lg:block min-w-0">
                    <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                      {userData?.name}
                    </p>

                    <p className="max-w-[130px] truncate text-xs text-slate-500">
                      @{userData?.username}
                    </p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700"
                >
                  Create Account
                </NavLink>
              </>
            )}
          </div>

          {/* ==================== MOBILE BUTTON ==================== */}
          <button
            onClick={toggle}
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:bg-slate-100 lg:hidden"
          >
            {isOpen ? (
              <FaTimes className="text-base" />
            ) : (
              <FaBars className="text-base" />
            )}
          </button>
        </div>

        {/* ==================== MOBILE MENU ==================== */}
        <div
          id="mobile-navigation"
          className={`overflow-hidden transition-all duration-300 lg:hidden ${isOpen
            ? "max-h-[600px] opacity-100 pb-4"
            : "max-h-0 opacity-0"
            }`}
        >
          <div className="border-t border-slate-100 pt-4">
            {authToken ? (
              <div className="flex flex-col gap-2">
                {/* Mobile User */}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="mb-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {userData?.photo ? (
                    <img
                      src={userData.photo}
                      alt={userData?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <FaUser className="text-sm" />
                    </span>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {userData?.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      @{userData?.username}
                    </p>
                  </div>
                </Link>

                {/* Mobile Navigation Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-1.5">
                  <NavLink
                    to="/home"
                    onClick={() => setIsOpen(false)}
                    className={navItemClass}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/following-users"
                    onClick={() => setIsOpen(false)}
                    className={navItemClass}
                  >
                    Following Users
                  </NavLink>

                  <NavLink
                    to="/follow-suggestions"
                    onClick={() => setIsOpen(false)}
                    className={navItemClass}
                  >
                    <span className="inline-flex items-center gap-2"><FaUsers /> Discover People</span>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className={navItemClass}
                  >
                    Profile
                  </NavLink>
                </div>

                {/* Mobile Notifications */}
                <NavLink
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <FaBell className="text-slate-500" />
                    <span>Notifications</span>
                  </div>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-indigo-700"
                >
                  Create Account
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
