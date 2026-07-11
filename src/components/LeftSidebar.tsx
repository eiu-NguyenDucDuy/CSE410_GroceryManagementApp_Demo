import { NavLink, useLocation } from "react-router-dom";
import { Menu, Typography, Tag, theme } from "antd";
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    CrownOutlined,
    UserOutlined,
    SettingOutlined,
    ControlOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

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
    const { token } = theme.useToken();
    const { t } = useTranslation();

    return (
        <>
            {/* Logo / User Info */}
            <div
                style={{
                    padding: 24,
                    textAlign: "center",

                    borderBottom: token.colorBorderSecondary,

                    background: token.colorBgContainer,
                }}
            >
                <Title
                    level={4}
                    style={{
                        color: token.colorTextHeading,
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
                        label: (
                            <NavLink to="/dashboard">
                                {t("common.dashboard")}
                            </NavLink>
                        ),
                    },
                    {
                        key: "/management",
                        icon: <ControlOutlined />,
                        label: t("common.management"),
                        children: [
                            {
                                key: "/dashboard/categories",
                                icon: <AppstoreOutlined />,
                                label: (
                                    <NavLink to="/dashboard/categories">
                                        {t("common.category")}
                                    </NavLink>
                                ),
                            },
                            {
                                key: "/dashboard/products",
                                icon: <ShoppingOutlined />,
                                label: (
                                    <NavLink to="/dashboard/products">
                                        {t("common.product")}
                                    </NavLink>
                                ),
                            },
                            {
                                key: "/dashboard/users",
                                icon: <TeamOutlined />,
                                label: (
                                    <NavLink to="/dashboard/users">
                                        {t("common.users")}
                                    </NavLink>
                                ),
                            },
                        ],
                    },
                    {
                        key: "/profile",
                        icon: <UserOutlined />,
                        label: (
                            <NavLink to="/profile">
                                {t("common.profile")}
                            </NavLink>
                        ),
                    },
                    {
                        key: "/settings",
                        icon: <SettingOutlined />,
                        label: (
                            <NavLink to="/settings">
                                {t("common.settings")}
                            </NavLink>
                        ),
                    },
                ]}
            />
        </>
    );
}
