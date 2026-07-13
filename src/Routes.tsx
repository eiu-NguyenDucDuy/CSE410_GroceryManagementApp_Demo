import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import RequireAdmin from "./components/RequireAuth";
import DashboardPage from "./pages/DashboardPage";
import CategoryManagementPage from "./pages/CategoryManagementPage";
import ProductManagementPage from "./pages/ProductManagementPage";
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
        ],
    },
]);

export default function Routes() {
    return <RouterProvider router={routers} />;
}
