import { NavLink, useLocation } from "react-router-dom";
import { Menu, Typography, Tag } from "antd";
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    CrownOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/useAuth";
import useTheme from "../context/useTheme";

const { Title } = Typography;

export default function LeftSidebar() {
    const { state } = useAuth();

    const { darkMode } = useTheme();

    const location = useLocation();

    const isAdmin = state.user?.role === "admin";

    const selectedKey = location.pathname.startsWith("/dashboard/categories")
        ? "/dashboard/categories"
        : location.pathname.startsWith("/dashboard/products")
          ? "/dashboard/products"
          : "/dashboard";

    return (
        <>
            {/* Logo / User Info */}
            <div
                style={{
                    padding: 24,
                    textAlign: "center",

                    borderBottom: darkMode
                        ? "1px solid #303030"
                        : "1px solid #f0f0f0",

                    background: darkMode ? "#141414" : "#ffffff",
                }}
            >
                <Title
                    level={4}
                    style={{
                        color: darkMode ? "#ffffff" : "#000000",
                    }}
                >
                    {isAdmin ? (
                        <>
                            <CrownOutlined /> Admin
                        </>
                    ) : (
                        <>
                            <UserOutlined /> User
                        </>
                    )}
                </Title>

                <Tag color={isAdmin ? "gold" : "blue"}>
                    {isAdmin ? "ADMIN" : "USER"}
                </Tag>
            </div>

            {/* Navigation */}
            <Menu
                theme={darkMode ? "dark" : "light"}
                mode="inline"
                selectedKeys={[selectedKey]}
                defaultOpenKeys={["/management"]}
                style={{
                    borderRight: 0,
                }}
                items={[
                    {
                        key: "/dashboard",

                        icon: <DashboardOutlined />,

                        label: <NavLink to="/dashboard">Dashboard</NavLink>,
                    },

                    {
                        key: "/management",

                        icon: <AppstoreOutlined />,

                        label: "Management",

                        children: [
                            {
                                key: "/dashboard/categories",

                                icon: <AppstoreOutlined />,

                                label: (
                                    <NavLink to="/dashboard/categories">
                                        Categories
                                    </NavLink>
                                ),
                            },

                            {
                                key: "/dashboard/products",

                                icon: <ShoppingOutlined />,

                                label: (
                                    <NavLink to="/dashboard/products">
                                        Products
                                    </NavLink>
                                ),
                            },
                        ],
                    },
                ]}
            />
        </>
    );
}
