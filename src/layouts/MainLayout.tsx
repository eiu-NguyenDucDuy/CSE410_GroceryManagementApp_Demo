import { Layout, Button, Avatar, Typography, Space, Switch } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useTheme from "../context/useTheme";
import LeftSidebar from "../components/LeftSidebar";
import AppBreadcrumb from "../components/Breadcrumb";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function MainLayout() {
    const navigate = useNavigate();

    const { state, dispatch } = useAuth();

    const { darkMode, toggleTheme } = useTheme();

    function handleLogout() {
        dispatch({
            type: "LOGOUT",
        });

        navigate("/login");
    }

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

                        background: darkMode ? "#141414" : "#ffffff",

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
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                        />

                        <Avatar icon={<UserOutlined />} />

                        <Text
                            style={{
                                color: darkMode ? "#fff" : "#000",
                            }}
                        >
                            Welcome <b>{state.user?.username}</b>
                        </Text>

                        <Button
                            danger
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Space>
                </Header>

                {/* Page Content */}
                <Content
                    style={{
                        margin: 24,
                        padding: 24,

                        background: darkMode ? "#1f1f1f" : "#ffffff",

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
