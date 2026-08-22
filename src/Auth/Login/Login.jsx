import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";

import {
    FaEnvelope,
    FaLock,
    FaSpinner,
} from "react-icons/fa";

import { schema } from "../../Schema/Login/Login";
import { authContext } from "../../Context/AuthContextValue";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../Components/PasswordInput/PasswordInput";

export default function Login() {
    const [invalidError, setInvalidError] = useState("");
    const [validError, setValid] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setAuthToken } = useContext(authContext)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
        resolver: zodResolver(schema),
    });

    function submitForm(userData) {
        setInvalidError("");
        setValid("");
        setIsLoading(true);

        axios
            .post(
                "https://route-posts.routemisr.com/users/signin",
                userData
            )
            .then((response) => {
                if (response.data?.message === "signed in successfully") {
                    setValid(response.data.message);

                    setAuthToken(response.data?.data?.token);

                    localStorage.setItem(
                        "token",
                        response.data?.data?.token
                    );

                    navigate("/home");
                }
            })
            .catch((error) => {
                setInvalidError(
                    error.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-100 p-4 sm:p-6">

            {/* Error Message */}
            {invalidError && <div
                className={`absolute top-25 right-4 bg-white border-2 border-red-500 border-l-4 p-3 rounded-xl shadow-md transition-all duration-500 ease-in-out ${invalidError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}
            >
                <p className="text-red-500 text-sm font-medium">
                    {invalidError.toUpperCase()}
                </p>
            </div>
            }

            {/* Valid Message */}
            {validError && (
                <div
                    className={`absolute top-8 right-4 bg-white border-2 border-green-500 border-l-4 p-3 rounded-xl shadow-md transition-all duration-500 ease-in-out ${validError
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-3 pointer-events-none"
                        }`}
                >
                    <p className="text-green-500 text-sm font-medium">
                        {validError.toUpperCase()}
                    </p>
                </div>
            )}

            {/* Register Card */}
            <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-indigo-950/10 backdrop-blur sm:p-8">

                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><FaLock /></div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Login
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Login with your account and get started
                    </p>
                </div>

                <form onSubmit={handleSubmit(submitForm)} noValidate>





                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Email
                        </label>

                        <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        <p className="h-5 mt-1 text-xs text-red-500">
                            {errors.email?.message}
                        </p>
                    </div>


                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Password
                        </label>

                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <PasswordInput inputProps={{
                                ...register("password"),
                                placeholder: "Password",
                                autoComplete: "current-password",
                                disabled: isLoading,
                                className: "w-full h-11 pl-10 pr-11 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70",
                            }} />
                        </div>

                        <p className="h-5 mt-1 text-xs text-red-500">
                            {errors.password?.message}
                        </p>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                        {isLoading && <FaSpinner className="animate-spin" />}
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                    New here? <Link to="/" className="font-semibold text-indigo-600 transition hover:text-indigo-700">Create an account</Link>
                </p>

            </div>

        </div>
    );
}
