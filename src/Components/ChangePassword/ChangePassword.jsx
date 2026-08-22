import axios from "axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    LuLock,
    LuKeyRound,
} from "react-icons/lu";
import PasswordInput from "../PasswordInput/PasswordInput";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Change password API
    function changePassword() {
        return axios.patch(
            "https://route-posts.routemisr.com/users/change-password",
            {
                password: password,
                newPassword: newPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const { mutate, isPending } = useMutation({
        mutationFn: changePassword,

        onSuccess: (response) => {
            toast.success(
                response.data?.message ||
                "Password changed successfully"
            );

            // Try different possible token locations
            const newToken =
                response.data?.token ||
                response.data?.data?.token ||
                response.data?.data?.accessToken;

            if (newToken) {
                localStorage.setItem("token", newToken);
            }

            // Clear inputs
            setPassword("");
            setNewPassword("");

        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to change password"
            );
        },
    });

    function handleSubmit(e) {
        e.preventDefault();

        if (!password.trim() || !newPassword.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword.length < 6) {
            toast.error(
                "New password must be at least 6 characters"
            );
            return;
        }

        if (password === newPassword) {
            toast.error(
                "New password must be different from the current password"
            );
            return;
        }

        mutate();
    }

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            {/* Header */}
            <div className="mb-6">

                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <LuKeyRound size={22} />
                </div>

                <h2 className="text-lg font-semibold text-slate-800">
                    Change Password
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Update your password to keep your account secure.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* Current Password */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Current Password
                    </label>

                    <div className="relative">

                        <LuLock
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <PasswordInput inputProps={{
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                            placeholder: "Enter current password",
                            disabled: isPending,
                            autoComplete: "current-password",
                            className: "w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50",
                        }} />

                    </div>

                </div>

                {/* New Password */}
                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        New Password
                    </label>

                    <div className="relative">

                        <LuLock
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <PasswordInput inputProps={{
                            value: newPassword,
                            onChange: (e) => setNewPassword(e.target.value),
                            placeholder: "Enter new password",
                            disabled: isPending,
                            autoComplete: "new-password",
                            className: "w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50",
                        }} />

                    </div>

                </div>

                {/* Change Password Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <LuKeyRound size={18} />

                    {isPending
                        ? "Changing Password..."
                        : "Change Password"}

                </button>

            </form>

        </div>
    );
}
