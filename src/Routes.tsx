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
    },
    {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        element: (
            <RequireAdmin>
                <MainLayout />
            </RequireAdmin>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "categories",
                element: <CategoryManagementPage />,
            },
            {
                path: "products",
                element: <ProductManagementPage />,
            },
        ],
    },
]);

export default function Routes() {
    return <RouterProvider router={routers} />;
}
