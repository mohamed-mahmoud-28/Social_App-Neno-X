import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Button } from "@heroui/react";
import { FaSpinner, FaArrowRight } from "react-icons/fa";


import {
    FaUser,
    FaAt,
    FaEnvelope,
    FaLock,
    FaCalendarAlt,
    FaVenusMars,
} from "react-icons/fa";

import { schema } from "../../Schema/Register/Register";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContextValue";
import PasswordInput from "../../Components/PasswordInput/PasswordInput";

export default function Register() {

    const [invalidError, setInvalidError] = useState("");
    const [validError, setValid] = useState("");
    const [loding, setLoding] = useState(false)
    const {setAuthToken} = useContext(authContext)

    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            rePassword: "",
            dateOfBirth: "",
            gender: "",
        },
        mode: "onBlur",
        resolver: zodResolver(schema),
    });

    function submitForm(userData) {
        setLoding(true);

        axios
            .post(
                "https://route-posts.routemisr.com/users/signup",
                userData
            )
            .then((response) => {
                setInvalidError("");

                setValid(
                    response?.data?.message ||
                    "Created."
                );

                if (response.data.message === 'account created') {
                    
                    setAuthToken(response.data?.data?.token)
                    localStorage.setItem("token", response.data?.data?.token);

                    navigate("/login");
                }
            })
            .catch((error) => {
                setValid("");

                setInvalidError(
                    error.response?.data?.message ||
                    "Something went wrong. Please try again."
                );
            })
            .finally(() => {
                setLoding(false);
            });
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
            <div className="w-full max-w-2xl rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl shadow-indigo-950/10 backdrop-blur sm:p-8">

                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><FaUser /></div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Create Account
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Create your account and get started
                    </p>
                </div>

                <form onSubmit={handleSubmit(submitForm)} noValidate>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Name
                        </label>

                        <div className="relative">
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Enter your name"
                                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>

                        <p className="h-5 mt-1 text-xs text-red-500">
                            {errors.name?.message}
                        </p>
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Username
                        </label>

                        <div className="relative">
                            <FaAt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                {...register("username")}
                                type="text"
                                placeholder="Enter your username"
                                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>

                        <p className="h-5 mt-1 text-xs text-red-500">
                            {errors.username?.message}
                        </p>
                    </div>

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
                                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>

                        <p className="h-5 mt-1 text-xs text-red-500">
                            {errors.email?.message}
                        </p>
                    </div>

                    {/* Password + Confirm Password */}
                    <div className="grid sm:grid-cols-2 gap-4">

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
                                    autoComplete: "new-password",
                                    disabled: loding,
                                    className: "w-full h-11 pl-10 pr-11 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70",
                                }} />
                            </div>

                            <p className="h-5 mt-1 text-xs text-red-500">
                                {errors.password?.message}
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                <PasswordInput inputProps={{
                                    ...register("rePassword"),
                                    placeholder: "Confirm password",
                                    autoComplete: "new-password",
                                    disabled: loding,
                                    className: "w-full h-11 pl-10 pr-11 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white disabled:cursor-not-allowed disabled:opacity-70",
                                }} />
                            </div>

                            <p className="h-5 mt-1 text-xs text-red-500">
                                {errors.rePassword?.message}
                            </p>
                        </div>

                    </div>

                    {/* Date + Gender */}
                    <div className="grid sm:grid-cols-2 gap-4 mt-2">

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Date of Birth
                            </label>

                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    {...register("dateOfBirth")}
                                    type="date"
                                    className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-slate-900 focus:bg-white"
                                />
                            </div>

                            <p className="h-5 mt-1 text-xs text-red-500">
                                {errors.dateOfBirth?.message}
                            </p>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Gender
                            </label>

                            <div className="relative">
                                <FaVenusMars className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />

                                <select
                                    {...register("gender")}
                                    className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none transition focus:border-slate-900 focus:bg-white"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <p className="h-5 mt-1 text-xs text-red-500">
                                {errors.gender?.message}
                            </p>
                        </div>

                    </div>

                    {/* Register Button */}
                    <Button isDisabled={loding} type="submit" className="mt-4 h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99]" endContent={!loding && <FaArrowRight />}>
                        {loding ? (
                            <span className="flex items-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            "Create account"
                        )}
                    </Button>

                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="font-semibold text-indigo-600 transition hover:text-indigo-700">Log in</Link>
                </p>

            </div>

        </div>
    );
}
