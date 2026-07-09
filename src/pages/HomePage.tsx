import { NavLink } from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <h1>HomePage</h1>
            <NavLink to="/login">
                <button type="button">Login</button>
            </NavLink>
        </>
    );
}
