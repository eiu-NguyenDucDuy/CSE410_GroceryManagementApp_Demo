import { useEffect, useState } from "react";
import {
    Alert,
    Card,
    Col,
    Image,
    Row,
    Spin,
    Statistic,
    Table,
    Typography,
} from "antd";
import { AppstoreOutlined, ShoppingOutlined } from "@ant-design/icons";

import { type CategoryData } from "../types/category";
import { type ProductData } from "../types/product";
import { getAllCategories } from "../services/categoryService";
import { getAllProducts } from "../services/productService";
import { useTranslation } from "react-i18next";
import { colors } from "../config/colors";

const { Title } = Typography;

export default function DashboardPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true);

                const [categoryData, productData] = await Promise.all([
                    getAllCategories(),
                    getAllProducts(),
                ]);

                setCategories(categoryData);
                setProducts(productData);
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

    const categoryColumns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: t("category.name"),
            dataIndex: "categoryName",
        },
        {
            title: t("category.description"),
            dataIndex: "description",
        },
    ];

    const productColumns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: t("product.title"),
            dataIndex: "title",
        },
        {
            title: t("product.thumbnail"),
            dataIndex: "thumbnail",
            render: (thumbnail: string | null) =>
                thumbnail ? (
                    <Image
                        src={thumbnail}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                    />
                ) : null,
        },
        {
            title: t("product.price"),
            dataIndex: "price",
        },
        {
            title: t("product.category"),
            dataIndex: "categoryId",
            render: (id: number) =>
                categories.find((c) => c.id === id)?.id ?? "N/A",
        },
    ];

    return (
        <>
            <Title level={2} style={{ color: colors.dashboard }}>
                {t("dashboard.title")}
            </Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card style={{ borderColor: colors.dashboard }}>
                        <Statistic
                            title={t("dashboard.totalCategories")}
                            value={categories.length}
                            prefix={
                                <AppstoreOutlined
                                    style={{ color: colors.category }}
                                />
                            }
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card style={{ borderColor: colors.dashboard }}>
                        <Statistic
                            title={t("dashboard.totalProducts")}
                            value={products.length}
                            prefix={
                                <ShoppingOutlined
                                    style={{ color: colors.product }}
                                />
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title={t("nav.category")}
                style={{ marginBottom: 24, borderColor: colors.category }}
                styles={{ header: { color: colors.category } }}
            >
                <Table
                    rowKey="id"
                    columns={categoryColumns}
                    dataSource={categories}
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <Card
                title={t("nav.product")}
                style={{ borderColor: colors.product }}
                styles={{ header: { color: colors.product } }}
            >
                <Table
                    rowKey="id"
                    columns={productColumns}
                    dataSource={products}
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </>
    );
}
