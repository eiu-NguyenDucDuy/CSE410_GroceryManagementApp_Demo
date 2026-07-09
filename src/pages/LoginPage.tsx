import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { login } from "../services/userService";

export default function LoginPage() {
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const user = await login(email.trim(), password);

            if (!user) {
                setError("Invalid email or password.");
                setPassword("");
                return;
            }

            dispatch({
                type: "LOGIN",
                payload: user,
            });

            navigate("/dashboard");
            return;
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to connect to the server.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container mt-5" style={{ maxWidth: 400 }}>
                <h2 className="text-center mb-4">Account Login</h2>

                <form onSubmit={handleLogin}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            autoComplete="email"
                            className="form-control"
                            id="email"
                            required
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            className="form-control"
                            id="password"
                            required
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </>
    );
}
