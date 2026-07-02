import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLoginPage from "./GUI/Pages/admin/AdminLoginPage";
import AdminLayout from "./GUI/Layouts/AdminLayout";
import RequireAdmin from "./GUI/Components/RequireAdmin";
import DashboardPage from "./GUI/Pages/admin/DashboardPage";
import CategoryManagementPage from "./GUI/Pages/admin/CategoryManagementPage";
import ProductManagementPage from "./GUI/Pages/admin/ProductManagementPage";
import ErrorPage from "./GUI/Pages/admin/ErrorPage";

const routers = createBrowserRouter([
    {
        path: "/admin/login",
        element: <AdminLoginPage />,
    },
    {
        path: "/admin",
        element: (
            <RequireAdmin>
                <AdminLayout />
            </RequireAdmin>
        ),
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
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

export default function Routes() {
    return <RouterProvider router={routers} />;
}
