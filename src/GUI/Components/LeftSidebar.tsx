import { NavLink } from "react-router-dom";

export default function LeftSidebar() {
    return (
        <>
            <div className="col-md-2 sidebar">
                <div className="logo">
                    <i className="fas fa-crown">ADMIN</i>
                </div>

                <nav className="nav-menu">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin" end>
                                <i className="fas fa-tachometer-alt">
                                    Dashboard
                                </i>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/admin/categories"
                            >
                                <i className="fas fa-list">
                                    Category Management
                                </i>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/products">
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
