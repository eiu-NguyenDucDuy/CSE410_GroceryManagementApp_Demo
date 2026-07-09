import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Typography, Space } from "antd";
import {
    LoginOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    BarChartOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg,#f6ffed,#ffffff)",
                padding: "60px 20px",
            }}
        >
            {/* Hero Section */}

            <Row justify="center" align="middle">
                <Col
                    xs={24}
                    md={16}
                    lg={12}
                    style={{
                        textAlign: "center",
                    }}
                >
                    <ShoppingCartOutlined
                        style={{
                            fontSize: 64,
                            color: "#52c41a",
                        }}
                    />

                    <Title>Grocery Management System</Title>

                    <Paragraph
                        style={{
                            fontSize: 18,
                            color: "#666",
                        }}
                    >
                        Manage your grocery products, categories, and inventory
                        easily with a simple and modern dashboard.
                    </Paragraph>

                    <Space size="middle">
                        <Button
                            type="primary"
                            size="large"
                            icon={<LoginOutlined />}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>

                        <Button size="large" onClick={() => navigate("/login")}>
                            Access Dashboard
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Features */}

            <Row
                gutter={[24, 24]}
                justify="center"
                style={{
                    marginTop: 70,
                }}
            >
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <AppstoreOutlined
                            style={{
                                fontSize: 40,
                                color: "#1677ff",
                            }}
                        />

                        <Title level={4}>Category Management</Title>

                        <Text>
                            Create and organize grocery categories easily.
                        </Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <ShoppingCartOutlined
                            style={{
                                fontSize: 40,
                                color: "#52c41a",
                            }}
                        />

                        <Title level={4}>Product Management</Title>

                        <Text>Add, update and manage grocery products.</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        hoverable
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <BarChartOutlined
                            style={{
                                fontSize: 40,
                                color: "#faad14",
                            }}
                        />

                        <Title level={4}>Dashboard Analytics</Title>

                        <Text>View important information in one place.</Text>
                    </Card>
                </Col>
            </Row>

            {/* Footer */}

            <div
                style={{
                    textAlign: "center",
                    marginTop: 80,
                    color: "#888",
                }}
            >
                Grocery Management System © 2026
            </div>
        </div>
    );
}
