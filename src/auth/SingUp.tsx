import { useState } from "react"
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const SingUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { signUpUser } = UserAuth()
    const navigate = useNavigate()

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            const result = await signUpUser(email, password)
            if (result.success) {
                navigate('/')
            }
        } catch (error: any) {
            setError(error.message || "something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid place-items-center bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body">

                    <h2 className="card-title justify-center">Sign Up</h2>

                    <form onSubmit={handleSignUp} className="space-y-4">

                        <div className="form-control">
                            <label className="label flex flex-col items-start gap-1 mb-2">
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

                        <div className="form-control">
                            <label className="label flex flex-col items-start gap-1 mb-2">
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

                        {error && (
                            <div className="alert alert-error text-sm">
                                {error as string}
                            </div>
                        )}

                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing up..." : "Sign Up"}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>


    )
}

export default SingUp