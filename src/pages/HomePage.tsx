import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Typography, Space } from "antd";
import {
    LoginOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

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

                    <Title style={{ color: "#40414d" }}>
                        {t("home.title")}
                    </Title>
                    <Paragraph
                        style={{
                            fontSize: 18,
                            color: "#666",
                        }}
                    >
                        {t("home.description")}
                    </Paragraph>

                    <Space size="middle">
                        <Button
                            type="primary"
                            size="large"
                            icon={<LoginOutlined />}
                            onClick={() => navigate("/login")}
                        >
                            {t("auth.login")}
                        </Button>

                        <Button size="large" onClick={() => navigate("/login")}>
                            {t("home.access")}
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

                        <Title level={4}>{t("category.categoryManagement")}</Title>
                        <Text>{t("home.categoryManagementDescription")}</Text>
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

                        <Title level={4}>{t("product.productManagement")}</Title>
                        <Text>{t("home.productManagementDescription")}</Text>
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

                        <Title level={4}>{t("home.dashboardTitle")}</Title>
                        <Text>{t("home.dashboardDescription")}</Text>
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
