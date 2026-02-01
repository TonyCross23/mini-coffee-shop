import { useSingIn } from "../hooks/useSignIn"

const SignIn = () => {

    const { register, handleSubmit, onSubmit, errors, isLoading, authError } = useSingIn()

    return (
        <div className="min-h-screen grid place-items-center bg-base-200 p-4">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold">Sign In</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="my-3">
                            {authError && (
                                <div className="alert alert-error text-sm">
                                    {authError}
                                </div>
                            )}
                        </div>
                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="input input-bordered w-full"
                                {...register("email")}
                            />
                            {errors.email && (<div className="text-red-500 text-sm mt-1">{errors.email.message}</div>)}
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input input-bordered w-full"
                                {...register("password")}
                            />
                            {errors.password && (<div className="text-red-500 text-sm mt-1">{errors.password.message}</div>)}
                        </div>

                        {/* Error message */}
                        {/* {error && (
                            <div className="alert alert-error text-sm">
                                {typeof error === "string" ? error : "Something went wrong"}
                            </div>
                        )} */}

                        {/* Submit button */}
                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    )
}

export default SignIn