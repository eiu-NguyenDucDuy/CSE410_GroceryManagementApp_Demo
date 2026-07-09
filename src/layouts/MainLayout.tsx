import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LeftSidebar from "../components/LeftSidebar";
import Breadcrumb from "../components/Breadcrumb";
import "../pages/styles.css";

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
