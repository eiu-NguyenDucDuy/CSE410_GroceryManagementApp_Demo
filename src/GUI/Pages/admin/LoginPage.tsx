import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { useAuth } from "../../../context/auth/useAuth";
import { login } from "../../../DAL/UserService";

export default function LoginPage() {
    const navigate = useNavigate();
    const { dispatch } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const user = await login(username, password);
            console.log("User:", user);

            if (!user) {
                alert("Invalid username or password.");
                return;
            }
            console.log("Dispatching LOGIN");

            dispatch({ type: "LOGIN", payload: user });
            console.log("Navigate to /dashboard");

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("An error occurred during login.");
        }
    };

    return (
        <>
            <div className="container mt-5" style={{ maxWidth: 400 }}>
                <h2 className="text-center mb-4">Account Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </>
    );
}
