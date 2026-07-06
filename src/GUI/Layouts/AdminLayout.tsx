import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import LeftSidebar from "../Components/LeftSidebar";
import Breadcrumb from "../Components/Breadcrumb";

export default function AdminLayout() {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();

    function handleLogout() {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    }

    return (
        <>
            <title>Grocery Management</title>

            {/* Bootstrap 4.6 CSS */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
            />
            {/* Font Awesome */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
            />
            <link rel="stylesheet" href="style.css" />

            <div className="container-fluid">
                <div className="row">
                    <LeftSidebar />

                    <div className="col-md-10 main-content">
                        <div className="top-bar">
                            <div className="row align-items-center">
                                <div className="col">
                                    <Breadcrumb />
                                </div>

                                <div className="col-auto">
                                    <div className="user-avatar">
                                        <i className="fas fa-user"></i>
                                    </div>
                                </div>

                                <div className="col-auto">
                                    <span className="mr-3">
                                        Welcome{" "}
                                        <strong>{state.user?.username}</strong>
                                    </span>
                                </div>

                                <div className="col-auto">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-danger"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="content-area">
                            <div className="content-card">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
