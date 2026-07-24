import { useEffect, useState } from "react";
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    List,
    Row,
    Spin,
    theme,
    Typography,
} from "antd";
import {
    AppstoreOutlined,
    ShoppingOutlined,
    TeamOutlined,
} from "@ant-design/icons";

import { type CategoryData } from "../types/category";
import { type ProductData } from "../types/product";
import { type UserData } from "../types/user";
import { getAllCategories } from "../services/categoryService";
import { getAllProducts } from "../services/productService";
import { useTranslation } from "react-i18next";
import { colors } from "../config/colors";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { getAllUsers } from "../services/userService";

const { Title, Text } = Typography;

export default function DashboardPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { token } = theme.useToken();
    const { t } = useTranslation();

    const productsByCategory = categories.map((category) => ({
        id: category.id,
        category: category.categoryName,
        count: products.filter((product) => product.categoryId === category.id)
            .length,
    }));
    const pieData = productsByCategory;
    const CHART_COLORS = [
        "#DC143C",
        "#D2691E",
        "#FFA500",
        "#FFFF00",
        "#32CD32",
        "#00CED1",
        "#4169E1",
        "#000080",
        "#800080",
        "#FF69B4",
        "#C0C0C0",
        "#FF6347",
        "#A52A2A",
        "#FA8072",
        "#FFD700",
        "#228B22",
        "#708090",
        "#6A5ACD",
        "#FF00FF",
        "#FF1493",
        "#7FFFD4",
    ];
    const categoryColorMap = Object.fromEntries(
        categories.map((category, index) => [
            category.id,
            CHART_COLORS[index % CHART_COLORS.length],
        ]),
    );

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true);

                const [categoryData, productData, userData] = await Promise.all(
                    [getAllCategories(), getAllProducts(), getAllUsers()],
                );

                setCategories(categoryData);
                setProducts(productData);
                setUsers(userData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load dashboard data.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 80 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert type="error" message={error} showIcon />;
    }

    return (
        <>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: colors.dashboard }}>
                    {t("dashboard.title")}
                </Title>

                <Text type="secondary">{t("dashboard.welcome")}</Text>
            </div>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        className="dashboard-card"
                        style={{ backgroundColor: colors.category }}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text
                                    type="secondary"
                                    style={{ color: token.colorBgBase }}
                                >
                                    {t("dashboard.totalCategories")}
                                </Text>

                                <Title
                                    level={2}
                                    style={{
                                        margin: 0,
                                        color: token.colorBgBase,
                                    }}
                                >
                                    {categories.length}
                                </Title>
                            </Col>

                            <Avatar
                                size={64}
                                style={{
                                    background: token.colorBgBase,
                                    color: colors.category,
                                }}
                                icon={<AppstoreOutlined />}
                            />
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        className="dashboard-card"
                        style={{ backgroundColor: colors.product }}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text
                                    type="secondary"
                                    style={{ color: token.colorBgBase }}
                                >
                                    {t("dashboard.totalProducts")}
                                </Text>

                                <Title
                                    level={2}
                                    style={{
                                        margin: 0,
                                        color: token.colorBgBase,
                                    }}
                                >
                                    {products.length}
                                </Title>
                            </Col>

                            <Avatar
                                size={64}
                                style={{
                                    background: token.colorBgBase,
                                    color: colors.product,
                                }}
                                icon={<ShoppingOutlined />}
                            />
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card
                        className="dashboard-card"
                        style={{ backgroundColor: colors.users }}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Text
                                    type="secondary"
                                    style={{ color: token.colorBgBase }}
                                >
                                    {t("dashboard.totalUsers")}
                                </Text>

                                <Title
                                    level={2}
                                    style={{
                                        margin: 0,
                                        color: token.colorBgBase,
                                    }}
                                >
                                    {users.length}
                                </Title>
                            </Col>

                            <Avatar
                                size={64}
                                style={{
                                    background: token.colorBgBase,
                                    color: colors.users,
                                }}
                                icon={<TeamOutlined />}
                            />
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Divider style={{ margin: "32px 0" }}>
                {t("dashboard.charts")}
            </Divider>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title={t("dashboard.productsByCategory")}>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                                data={productsByCategory}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 40,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis
                                    type="category"
                                    dataKey="category"
                                    width={120}
                                />
                                <RechartsTooltip />
                                <Bar
                                    dataKey="count"
                                    fill={colors.category}
                                    radius={[0, 6, 6, 0]}
                                    label={{ position: "right" }}
                                >
                                    {productsByCategory.map((item) => (
                                        <Cell
                                            key={item.category}
                                            fill={categoryColorMap[item.id]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title={t("dashboard.categoryDistribution")}>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="count"
                                    nameKey="category"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    label
                                >
                                    {productsByCategory.map((item) => (
                                        <Cell
                                            key={item.category}
                                            fill={categoryColorMap[item.id]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Recent Items */}
            <Divider style={{ margin: "32px 0" }}>
                {t("dashboard.recentItems")}
            </Divider>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title={t("dashboard.recentCategories")}
                        extra={
                            <Button type="link" href="/dashboard/categories">
                                {t("common.viewAll")}
                            </Button>
                        }
                    >
                        <List
                            dataSource={categories.slice(0, 5)}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{
                                                    backgroundColor:
                                                        categoryColorMap[
                                                            item.id
                                                        ],
                                                }}
                                                icon={
                                                    <AppstoreOutlined
                                                        style={{
                                                            color: colors.category,
                                                        }}
                                                    />
                                                }
                                            />
                                        }
                                        title={item.categoryName}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={t("dashboard.recentProducts")}
                        extra={
                            <Button type="link" href="/dashboard/products">
                                {t("common.viewAll")}
                            </Button>
                        }
                    >
                        <List
                            dataSource={products.slice(0, 5)}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={item.thumbnail}
                                                icon={<ShoppingOutlined />}
                                            />
                                        }
                                        title={item.title}
                                        description={`$${item.price}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
