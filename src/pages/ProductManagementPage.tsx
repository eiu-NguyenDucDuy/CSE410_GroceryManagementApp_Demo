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

import { useAuth } from "../context/useAuth";

import { Table, Button, Alert, Spin, Space, Image, Input } from "antd";

import type { ColumnsType } from "antd/es/table";

const { Search } = Input;

export default function ProductManagementPage() {
    const [products, setProducts] = useState<ProductData[]>([]);

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
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>();

    // Load products
    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                setError("");

                const data = await getAllProducts();

                setProducts(data);
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load products.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
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
        const confirmDelete = window.confirm("Confirm delete this product?");

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
            productCategoryId: 0,
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

    const columns: ColumnsType<ProductData> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },

        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            key: "thumbnail",

            render: (thumbnail) =>
                thumbnail ? <Image width={50} src={thumbnail} /> : "No Image",
        },

        {
            title: "Price",
            dataIndex: "price",
            key: "price",
        },

        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },

        {
            title: "Category ID",
            dataIndex: "categoryId",
            key: "categoryId",
        },

        ...(isAdmin
            ? [
                  {
                      title: "Actions",

                      key: "actions",

                      render: (_: unknown, record: ProductData) => (
                          <Space>
                              <Button
                                  type="primary"
                                  onClick={() => handleEdit(record)}
                              >
                                  Edit
                              </Button>

                              <Button
                                  danger
                                  onClick={() => handleDelete(record.id)}
                              >
                                  Delete
                              </Button>
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
            <h2>Product Management</h2>

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
                    <Button type="primary" onClick={openAddModal}>
                        + Add Product
                    </Button>
                )}

                <Search
                    placeholder="Search products..."
                    allowClear
                    onSearch={handleSearchSubmit}
                    style={{
                        width: 300,
                    }}
                />
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredProducts}
                pagination={{
                    pageSize: itemsPerPage,
                }}
            />

            <ProductFormModal
                show={showModal}
                editingProduct={editingProduct}
                register={register}
                control={control}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                onClose={closeModal}
                saving={saving}
            />
        </>
    );
}
