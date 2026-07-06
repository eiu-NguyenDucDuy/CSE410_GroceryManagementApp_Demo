import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

export default function LeftSidebar() {
    const { state } = useAuth();
    const isAdmin = state.user?.role === "admin";

    return (
        <>
            <div className="col-md-2 sidebar">
                <div className="logo">
                    {isAdmin ? (
                        <i className="fas fa-crown">ADMIN</i>
                    ) : (
                        <i className="fas fa-chess-bishop">USER</i>
                    )}
                </div>

                <nav className="nav-menu">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard" end>
                                <i className="fas fa-tachometer-alt">
                                    Dashboard
                                </i>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/dashboard/categories"
                            >
                                <i className="fas fa-list">
                                    Category Management
                                </i>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/dashboard/products"
                            >
                                {" "}
                                <i className="fas fa-box">
                                    Product Management{" "}
                                </i>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
