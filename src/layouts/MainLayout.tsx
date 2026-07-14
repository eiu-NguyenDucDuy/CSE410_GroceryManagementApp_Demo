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
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import LeftSidebar from "../components/LeftSidebar";
import AppBreadcrumb from "../components/Breadcrumb";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

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
            icon: <ProfileOutlined style={{ color: "#0000bb" }} />,
            label: t("nav.profile"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined style={{ color: "#dc143c" }} />,
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
                        borderBottom: darkMode
                            ? "1px solid #303030"
                            : "1px solid #eee",
                        padding: "0 24px",
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
                                <MoonFilled style={{ color: "#fff" }} />
                            }
                            unCheckedChildren={
                                <SunFilled style={{ color: "#f4a470" }} />
                            }
                        />

                        <LanguageSwitcher darkMode={darkMode} />

                        <Dropdown
                            menu={{
                                items: menuItems,
                                onClick: handleMenuClick,
                            }}
                            placement="bottomRight"
                            trigger={["click"]}
                        >
                            <Avatar
                                src={state.user?.avatar}
                                icon={<UserOutlined />}
                                style={{ cursor: "pointer" }}
                            />
                        </Dropdown>

                        <Text
                            style={{
                                color: token.colorText,
                            }}
                        >
                            {t("common.welcome")} <b>{state.user?.username}</b>
                        </Text>
                    </Space>
                </Header>

                {/* Page Content */}
                <Content
                    style={{
                        margin: 24,
                        padding: 24,
                        background: token.colorBgContainer,
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
