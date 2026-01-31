import { useState } from "react"
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const SignIn = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { signInUser } = UserAuth()
    const navigate = useNavigate()

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            const result = await signInUser(email, password)
            if (result?.success) {
                navigate('/')
            }
        } catch (error: any) {
            setError(error.message || "something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen grid place-items-center bg-base-200 p-4">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold">Sign In</h2>

                    <form onSubmit={handleSignin} className="space-y-4">

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="alert alert-error text-sm">
                                {typeof error === "string" ? error : "Something went wrong"}
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
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