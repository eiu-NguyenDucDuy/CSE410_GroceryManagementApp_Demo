import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
} from "../services/productService";
import { type ProductData, type ProductFormData } from "../types/product";
import ProductFormModal from "../components/ProductFormModal";
import { useAuth } from "../hooks/useAuth";
import { Table, Button, Alert, Spin, Space, Image, Input, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { CategoryData } from "../types/category";
import { getAllCategories } from "../services/categoryService";

const { Search } = Input;

export default function ProductManagementPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(
        null,
    );
    const [activeSearchKeyword, setActiveSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const itemsPerPage = 10;
    const { state } = useAuth();
    const isAdmin = state.user?.role === "admin";
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>();
    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.categoryName,
    }));
    const { t } = useTranslation();

    // Load products & categories
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const [productData, categoryData] = await Promise.all([
                    getAllProducts(),
                    getAllCategories(),
                ]);

                setProducts(productData);
                setCategories(categoryData);
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error ? err.message : "Unable to load data.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Create / Update
    const onSubmit = async (data: ProductFormData) => {
        setSaving(true);
        setError("");

        try {
            let thumbnailString = "";

            if (
                data.productThumbnail instanceof FileList &&
                data.productThumbnail.length > 0
            ) {
                const file = data.productThumbnail[0];

                thumbnailString = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            } else if (typeof data.productThumbnail === "string") {
                thumbnailString = data.productThumbnail;
            }

            if (!thumbnailString && editingProduct) {
                thumbnailString = editingProduct.thumbnail || "";
            }

            const product = {
                title: data.productTitle,
                thumbnail: thumbnailString || null,
                price: Number(data.productPrice),
                description: data.productDescription,
                categoryId: data.productCategoryId,
            };

            if (editingProduct) {
                const updatedProduct = await updateProduct({
                    id: editingProduct.id,
                    ...product,
                });

                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === updatedProduct.id ? updatedProduct : p,
                    ),
                );
            } else {
                const savedProduct = await createProduct(product);

                setProducts((prev) => [...prev, savedProduct]);
            }

            closeModal();
        } catch (err) {
            console.error(err);

            setError(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product: ProductData) => {
        setEditingProduct(product);

        reset({
            productTitle: product.title,
            productThumbnail: product.thumbnail ?? "",
            productPrice: product.price,
            productDescription: product.description,
            productCategoryId: product.categoryId,
        });

        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            `${t("validation.confirmDeleteProduct")}`,
        );

        if (!confirmDelete) return;

        try {
            await deleteProduct(id);

            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);

            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);

        reset({
            productTitle: "",
            productThumbnail: "",
            productPrice: 0,
            productDescription: "",
            productCategoryId: undefined,
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        reset();
    };

    const handleSearchSubmit = (keyword: string) => {
        setActiveSearchKeyword(keyword);
    };

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(activeSearchKeyword.toLowerCase()),
    );

    const onTableChange: TableProps<ProductData>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra,
    ) => {
        console.log("Table params:", {
            pagination,
            filters,
            sorter,
            extra,
        });
    };

    const categoryFilters = categories.map((category) => ({
        text: category.categoryName,
        value: category.categoryName,
    }));

    const columns: ColumnsType<ProductData> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: "ascend",
        },
        {
            title: t("product.title"),
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: t("product.thumbnail"),
            dataIndex: "thumbnail",
            key: "thumbnail",
            width: 100,
            render: (thumbnail: string | null) =>
                thumbnail ? (
                    <Image
                        src={thumbnail}
                        width={60}
                        height={60}
                        style={{
                            objectFit: "cover",
                            borderRadius: 6,
                        }}
                    />
                ) : null,
        },
        {
            title: t("product.price"),
            dataIndex: "price",
            key: "price",
            width: 120,
            sorter: (a, b) => a.price - b.price,
            render: (price: number) =>
                `${price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
        },
        {
            title: t("product.description"),
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (text: string) => <span title={text}>{text}</span>,
        },
        {
            title: t("product.category"),
            dataIndex: "categoryId",
            key: "categoryId",
            width: 120,
            filters: categoryFilters,
            onFilter: (value, record) => record.categoryId === value,
            sorter: (a, b) => a.categoryId - b.categoryId,
        },
        ...(isAdmin
            ? [
                  {
                      title: t("common.actions"),
                      key: "actions",
                      width: 180,
                      fixed: "right" as const,
                      render: (_: unknown, record: ProductData) => (
                          <Space>
                              <Tooltip title={t("common.edit")}>
                                  <Button
                                      type="text"
                                      color="primary"
                                      variant="outlined"
                                      icon={<EditOutlined />}
                                      onClick={() => handleEdit(record)}
                                  />
                              </Tooltip>

                              <Tooltip title={t("common.delete")}>
                                  <Button
                                      type="text"
                                      color="danger"
                                      variant="outlined"
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleDelete(record.id)}
                                  />
                              </Tooltip>
                          </Space>
                      ),
                  },
              ]
            : []),
    ];

    if (loading) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: 50,
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <h2>{t("product.productManagement")}</h2>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{
                        marginBottom: 20,
                    }}
                />
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
            >
                {isAdmin && (
                    <Button
                        type="text"
                        color="cyan"
                        variant="outlined"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        {t("product.addProduct")}
                    </Button>
                )}

                <Search
                    placeholder={t("common.search")}
                    allowClear
                    enterButton
                    onSearch={handleSearchSubmit}
                    style={{
                        width: 350,
                    }}
                />
            </div>

            <Table<ProductData>
                rowKey="id"
                columns={columns}
                dataSource={filteredProducts}
                onChange={onTableChange}
                bordered
                size="middle"
                scroll={{ x: 1100 }}
                pagination={{
                    pageSize: itemsPerPage,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    showQuickJumper: true,
                }}
            />

            <ProductFormModal
                show={showModal}
                editingProduct={editingProduct}
                control={control}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                onClose={closeModal}
                saving={saving}
                categoryOptions={categoryOptions}
            />
        </>
    );
}
