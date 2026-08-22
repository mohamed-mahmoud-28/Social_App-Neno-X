import { useContext } from "react";
import { Link } from "react-router-dom";
import {
    FaCamera,
    FaEdit,
    FaCalendarAlt,
    FaEnvelope,
    FaUserFriends,
    FaUserPlus,
    FaUser,
    FaCog,
    FaArrowRight,
} from "react-icons/fa";
import { authContext } from "../../Context/AuthContextValue";
import GetProfilePosts from "../GetProfilePosts/GetProfilePosts";
import Spinner from "../Spinner/Spinner";
import CreatePost from "../CreatePost/CreatePost";
import GetBookmarks from "../GetBookmarks/GetBookmarks";
import { queryKeys } from "../../Hooks/queryKeys";

export default function Profile() {
    const { userData } = useContext(authContext);

    if (!userData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Spinner />
            </div>
        );
    }

    const joinDate = new Date(userData.createdAt).toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        }
    );

    const birthDate = new Date(userData.dateOfBirth).toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    return (
        <div className="min-h-screen px-3 py-4 sm:px-5 sm:py-6 lg:py-8">
            <div className="mx-auto max-w-5xl">

                {/* ================= PROFILE CARD ================= */}

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:rounded-3xl">

                    {/* ================= COVER ================= */}

                    <div className="relative h-36 bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-900 sm:h-56 lg:h-64">

                        {userData.cover && (
                            <img
                                src={userData.cover}
                                alt="Cover"
                                className="h-full w-full object-cover"
                            />
                        )}

                        <Link
                            to="/settings"
                            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white sm:bottom-4 sm:right-4 sm:rounded-xl sm:px-4 sm:text-sm"
                        >
                            <FaCamera />

                            <span className="sm:hidden">
                                Edit
                            </span>

                            <span className="hidden sm:inline">
                                Edit Cover
                            </span>
                        </Link>

                    </div>

                    {/* ================= USER INFORMATION ================= */}

                    <div className="px-4 pb-5 sm:px-8 sm:pb-7">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            {/* ================= USER ================= */}

                            <div className="-mt-14 flex min-w-0 flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end">

                                {/* ================= PROFILE PHOTO ================= */}

                                <div className="relative w-fit">

                                    {userData.photo ? (
                                        <img
                                            src={userData.photo}
                                            alt={userData.name}
                                            className="h-24 w-24 rounded-full border-4 border-white bg-slate-200 object-cover shadow-lg sm:h-32 sm:w-32"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-indigo-50 text-indigo-600 shadow-lg sm:h-32 sm:w-32">
                                            <FaUser className="text-2xl sm:text-3xl" />
                                        </div>
                                    )}

                                    <Link
                                        to="/settings"
                                        aria-label="Edit profile photo"
                                        className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white transition hover:bg-slate-800 sm:bottom-2 sm:right-2 sm:h-9 sm:w-9"
                                    >
                                        <FaCamera className="text-xs sm:text-sm" />
                                    </Link>

                                </div>

                                {/* ================= NAME ================= */}

                                <div className="min-w-0 pb-1 sm:pb-2">

                                    <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                                        {userData.name}
                                    </h1>

                                    <p className="mt-0.5 truncate text-sm text-slate-500">
                                        @{userData.username}
                                    </p>

                                </div>

                            </div>

                            {/* ================= EDIT PROFILE ================= */}

                            <Link
                                to="/settings"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-100 transition hover:bg-indigo-700 sm:w-auto"
                            >
                                <FaEdit />
                                Edit Profile
                            </Link>

                        </div>

                        {/* ================= STATISTICS ================= */}

                        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 sm:mt-7 sm:flex sm:gap-8">

                            {/* Followers */}

                            <div className="text-center sm:text-left">
                                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                                    {userData.followersCount}
                                </p>

                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Followers
                                </p>
                            </div>

                            {/* Following */}

                            <div className="text-center sm:text-left">
                                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                                    {userData.followingCount}
                                </p>

                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Following
                                </p>
                            </div>

                            {/* Bookmarks */}

                            <div className="text-center sm:text-left">
                                <p className="text-lg font-bold text-slate-900 sm:text-xl">
                                    {userData.bookmarksCount}
                                </p>

                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Bookmarks
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= ABOUT ================= */}

                <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mt-6 sm:p-6">

                    <h2 className="mb-4 text-lg font-bold text-slate-900 sm:mb-5">
                        About
                    </h2>

                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

                        {/* ================= EMAIL ================= */}

                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50/70 sm:gap-4 sm:p-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 sm:h-10 sm:w-10">
                                <FaEnvelope />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs text-slate-400">
                                    Email
                                </p>

                                <p className="break-all text-sm font-medium text-slate-800">
                                    {userData.email}
                                </p>

                            </div>

                        </div>

                        {/* ================= DATE OF BIRTH ================= */}

                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50/70 sm:gap-4 sm:p-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 sm:h-10 sm:w-10">
                                <FaCalendarAlt />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs text-slate-400">
                                    Date of Birth
                                </p>

                                <p className="text-sm font-medium text-slate-800">
                                    {birthDate}
                                </p>

                            </div>

                        </div>

                        {/* ================= GENDER ================= */}

                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50/70 sm:gap-4 sm:p-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 sm:h-10 sm:w-10">
                                <FaUserFriends />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs text-slate-400">
                                    Gender
                                </p>

                                <p className="text-sm font-medium capitalize text-slate-800">
                                    {userData.gender}
                                </p>

                            </div>

                        </div>

                        {/* ================= JOINED ================= */}

                        <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50/70 sm:gap-4 sm:p-4">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 sm:h-10 sm:w-10">
                                <FaUserPlus />
                            </div>

                            <div className="min-w-0">

                                <p className="text-xs text-slate-400">
                                    Joined
                                </p>

                                <p className="text-sm font-medium text-slate-800">
                                    {joinDate}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= SETTINGS ================= */}

                <section className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11">
                            <FaCog className="text-lg" />
                        </div>

                        <div className="min-w-0">

                            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                                Account settings
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-slate-500 sm:leading-6">
                                Update your photos, password, and account preferences in one place.
                            </p>

                        </div>

                    </div>

                    <Link
                        to="/settings"
                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
                    >
                        Open settings
                        <FaArrowRight className="text-xs" />
                    </Link>

                </section>

                {/* ================= POSTS ================= */}

                <div className="mt-5 sm:mt-6">

                    <div className="mb-4">

                        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Posts
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your latest posts
                        </p>

                    </div>

                    <div className="mb-4 sm:mb-5">
                        <CreatePost
                            queryKey={queryKeys.profilePosts(userData._id)}
                        />
                    </div>

                    <GetProfilePosts />

                </div>

                {/* ================= BOOKMARKS ================= */}

                <GetBookmarks />

            </div>
        </div>
    );
}