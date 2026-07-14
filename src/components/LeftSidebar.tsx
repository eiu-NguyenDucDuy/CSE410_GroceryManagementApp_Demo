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
    ProfileOutlined,
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
          : location.pathname.startsWith("/dashboard/users")
            ? "/dashboard/users"
            : location.pathname.startsWith("/dashboard/profile")
              ? "/dashboard/profile"
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
                            <CrownOutlined /> {t("common.Admin")}
                        </>
                    ) : (
                        <>
                            <UserOutlined /> {t("common.User")}
                        </>
                    )}
                </Title>

                <Tag color={isAdmin ? "gold" : "blue"}>
                    {isAdmin ? t("common.Admin") : t("common.User")}
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
                        icon: (
                            <DashboardOutlined style={{ color: "#dc143c" }} />
                        ),
                        label: (
                            <NavLink to="/dashboard">
                                {t("nav.dashboard")}
                            </NavLink>
                        ),
                    },
                    {
                        key: "/management",
                        icon: <ControlOutlined style={{ color: "#ff6600" }} />,
                        label: t("nav.management"),
                        children: [
                            {
                                key: "/dashboard/categories",
                                icon: (
                                    <AppstoreOutlined
                                        style={{ color: "#ffff00" }}
                                    />
                                ),
                                label: (
                                    <NavLink to="/dashboard/categories">
                                        {t("nav.category")}
                                    </NavLink>
                                ),
                            },
                            {
                                key: "/dashboard/products",
                                icon: (
                                    <ShoppingOutlined
                                        style={{ color: "#77aa00" }}
                                    />
                                ),
                                label: (
                                    <NavLink to="/dashboard/products">
                                        {t("nav.product")}
                                    </NavLink>
                                ),
                            },
                            {
                                key: "/dashboard/users",
                                icon: (
                                    <TeamOutlined style={{ color: "#69f" }} />
                                ),
                                label: (
                                    <NavLink to="/dashboard/users">
                                        {t("nav.users")}
                                    </NavLink>
                                ),
                            },
                        ],
                    },
                    {
                        key: "/dashboard/profile",
                        icon: <ProfileOutlined style={{ color: "#0000bb" }} />,
                        label: (
                            <NavLink to="/dashboard/profile">
                                {t("nav.profile")}
                            </NavLink>
                        ),
                    },
                    {
                        key: "/settings",
                        icon: <SettingOutlined />,
                        label: (
                            <NavLink to="/settings">
                                {t("nav.settings")}
                            </NavLink>
                        ),
                    },
                ]}
            />
        </>
    );
}
