import {
    Dropdown,
    Layout,
    Avatar,
    Typography,
    Space,
    Switch,
    theme,
    type MenuProps,
} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    MoonFilled,
    SunFilled,
    ProfileOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import LeftSidebar from "../components/LeftSidebar";
import AppBreadcrumb from "../components/Breadcrumb";
import LanguageSwitcher from "../components/LanguageSwitcher";
import NotificationBell from "../components/NotificationBell";
import { useTranslation } from "react-i18next";
import { colors } from "../config/colors";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function MainLayout() {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const { token } = theme.useToken();
    const { t } = useTranslation();

    function handleLogout() {
        dispatch({
            type: "LOGOUT",
        });

        navigate("/login");
    }

    const menuItems: MenuProps["items"] = [
        {
            key: "profile",
            icon: <ProfileOutlined style={{ color: colors.profile }} />,
            label: t("nav.profile"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined style={{ color: colors.secondary }} />,
            label: t("auth.logout"),
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === "profile") {
            navigate("/dashboard/profile");
        }
        if (key === "logout") {
            handleLogout();
        }
    };

    return (
        <Layout
            style={{
                minHeight: "100vh",
            }}
        >
            {/* Sidebar */}
            <Sider width={250} theme={darkMode ? "dark" : "light"}>
                <LeftSidebar />
            </Sider>

            <Layout>
                {/* Top Header */}
                <Header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: token.colorBgContainer,
                        padding: "0 24px",
                        borderLeft: `4px solid ${token.colorText}`,
                    }}
                >
                    {/* Breadcrumb */}
                    <AppBreadcrumb />

                    {/* Right section */}
                    <Space size="middle">
                        <Switch
                            checked={darkMode}
                            onChange={toggleTheme}
                            checkedChildren={
                                <MoonFilled
                                    style={{ color: token.colorText }}
                                />
                            }
                            unCheckedChildren={
                                <SunFilled style={{ color: token.colorText }} />
                            }
                        />

                        <LanguageSwitcher darkMode={darkMode} />

                        <NotificationBell />

                        <Dropdown
                            menu={{
                                items: menuItems,
                                onClick: handleMenuClick,
                            }}
                            trigger={["click"]}
                            placement="bottomRight"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    transition: "all .2s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        token.colorFillSecondary)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "transparent")
                                }
                            >
                                <Avatar
                                    src={state.user?.avatar}
                                    icon={<UserOutlined />}
                                />

                                <Text
                                    style={{
                                        color: token.colorText,
                                        fontWeight: 600,
                                    }}
                                >
                                    {state.user?.username}
                                </Text>

                                <DownOutlined
                                    style={{
                                        color: token.colorTextSecondary,
                                        fontSize: 12,
                                    }}
                                />
                            </div>
                        </Dropdown>
                    </Space>
                </Header>

                {/* Page Content */}
                <Content
                    style={{
                        margin: 24,
                        padding: 24,
                        borderRadius: 8,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
