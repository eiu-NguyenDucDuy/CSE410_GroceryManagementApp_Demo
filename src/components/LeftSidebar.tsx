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
import { colors } from "../config/colors";

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
              : location.pathname.startsWith("/dashboard/settings")
                ? "/dashboard/settings"
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
                            <DashboardOutlined
                                style={{ color: colors.dashboard }}
                            />
                        ),
                        label: (
                            <NavLink to="/dashboard">
                                {t("nav.dashboard")}
                            </NavLink>
                        ),
                        style: {
                            borderLeft: `3px solid ${colors.dashboard}`,
                        },
                    },
                    {
                        key: "/management",
                        icon: (
                            <ControlOutlined
                                style={{ color: colors.management }}
                            />
                        ),
                        label: t("nav.management"),
                        style: {
                            borderLeft: `2px solid ${colors.management}`,
                        },
                        children: [
                            {
                                key: "/dashboard/categories",
                                icon: (
                                    <AppstoreOutlined
                                        style={{ color: colors.category }}
                                    />
                                ),
                                label: (
                                    <NavLink to="/dashboard/categories">
                                        {t("nav.category")}
                                    </NavLink>
                                ),
                                style: {
                                    borderLeft: `2px solid ${colors.category}`,
                                },
                            },
                            {
                                key: "/dashboard/products",
                                icon: (
                                    <ShoppingOutlined
                                        style={{ color: colors.product }}
                                    />
                                ),
                                label: (
                                    <NavLink to="/dashboard/products">
                                        {t("nav.product")}
                                    </NavLink>
                                ),
                                style: {
                                    borderLeft: `2px solid ${colors.product}`,
                                },
                            },
                            {
                                key: "/dashboard/users",
                                icon: (
                                    <TeamOutlined
                                        style={{ color: colors.users }}
                                    />
                                ),
                                label: (
                                    <NavLink to="/dashboard/users">
                                        {t("nav.users")}
                                    </NavLink>
                                ),
                                style: {
                                    borderLeft: `2px solid ${colors.users}`,
                                },
                            },
                        ],
                    },
                    {
                        key: "/dashboard/profile",
                        icon: (
                            <ProfileOutlined
                                style={{ color: colors.profile }}
                            />
                        ),
                        label: (
                            <NavLink to="/dashboard/profile">
                                {t("nav.profile")}
                            </NavLink>
                        ),
                        style: {
                            borderLeft: `2px solid ${colors.profile}`,
                        },
                    },
                    {
                        key: "/dashboard/settings",
                        icon: <SettingOutlined />,
                        label: (
                            <NavLink to="/dashboard/settings">
                                {t("nav.settings")}
                            </NavLink>
                        ),
                        style: {
                            borderLeft: `2px solid ${token.colorText}`,
                        },
                    },
                ]}
            />
        </>
    );
}
