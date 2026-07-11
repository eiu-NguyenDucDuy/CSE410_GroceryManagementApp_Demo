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
            title: "Category",
            dataIndex: "categoryName",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
    ];

    const productColumns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            render: (thumbnail: string | null) =>
                thumbnail ? (
                    <Image
                        src={thumbnail}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    "No Image"
                ),
        },
        {
            title: "Price",
            dataIndex: "price",
        },
        {
            title: "Category",
            dataIndex: "categoryType",
            render: (type: string) =>
                categories.find(
                    (c) =>
                        c.categoryName.toLocaleLowerCase() ===
                        type.toLocaleLowerCase(),
                )?.categoryName ?? "N/A",
        },
    ];

    return (
        <>
            <Title level={2}>Dashboard</Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Total Categories"
                            value={categories.length}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={products.length}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Categories" style={{ marginBottom: 24 }}>
                <Table
                    rowKey="id"
                    columns={categoryColumns}
                    dataSource={categories}
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <Card title="Products">
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
