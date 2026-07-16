import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import RequireAdmin from "./components/RequireAuth";
import DashboardPage from "./pages/DashboardPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import ErrorPage from "./pages/ErrorPage";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
        handle: {
            breadcrumb: "common.home",
        },
    },
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
        handle: {
            breadcrumb: "auth.login",
        },
    },
    {
        path: "/dashboard",
        element: (
            <RequireAdmin>
                <MainLayout />
            </RequireAdmin>
        ),
        errorElement: <ErrorPage />,
        handle: {
            breadcrumb: "nav.dashboard",
        },
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "categories",
                element: <CategoryManagementPage />,
                handle: {
                    breadcrumb: "nav.category",
                },
            },
            {
                path: "products",
                element: <ProductManagementPage />,
                handle: {
                    breadcrumb: "nav.product",
                },
            },
            {
                path: "users",
                element: <UserManagementPage />,
                handle: {
                    breadcrumb: "nav.users",
                },
            },
            {
                path: "profile",
                element: <ProfilePage />,
                handle: {
                    breadcrumb: "nav.profile",
                },
            },
            {
                path: "history",
                element: <HistoryPage />,
                handle: {
                    breadcrumb: "nav.history",
                },
            },
            {
                path: "settings",
                element: <SettingsPage />,
                handle: {
                    breadcrumb: "nav.settings",
                },
            },
        ],
    },
]);

export default function Routes() {
    return <RouterProvider router={routers} />;
}
