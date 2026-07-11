import {
    Layout,
    Button,
    Avatar,
    Typography,
    Space,
    Switch,
    Tooltip,
    theme,
} from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    MoonFilled,
    SunFilled,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import LeftSidebar from "../components/LeftSidebar";
import AppBreadcrumb from "../components/Breadcrumb";
import LanguageSwitcher from "../components/LanguageSwitcher";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function MainLayout() {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const { token } = theme.useToken();

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

                        <Avatar icon={<UserOutlined />} />

                        <Text
                            style={{
                                color: token.colorText,
                            }}
                        >
                            Welcome <b>{state.user?.username}</b>
                        </Text>

                        <Tooltip title="Logout">
                            <Button
                                danger
                                shape="circle"
                                icon={<LogoutOutlined />}
                                onClick={handleLogout}
                            />
                        </Tooltip>
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
