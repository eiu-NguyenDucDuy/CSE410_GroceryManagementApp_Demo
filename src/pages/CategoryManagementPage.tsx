import { useEffect, useState } from "react";
import {
    Table,
    Button,
    Input,
    Space,
    Alert,
    Typography,
    Popconfirm,
} from "antd";

import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../services/categoryService";

import type { CategoryData, CategoryFormData } from "../types/category";

import { useAuth } from "../context/useAuth";
import CategoryFormModal from "../components/CategoryFormModal";

const { Title } = Typography;
const { Search } = Input;

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);

    const [showModal, setShowModal] = useState(false);

    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
        null,
    );

    const [searchKeyword, setSearchKeyword] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const { state } = useAuth();

    const isAdmin = state.user?.role === "admin";

    async function loadCategories() {
        try {
            setLoading(true);
            setError("");

            const data = await getAllCategories();

            setCategories(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load categories.",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError("");

                const data = await getAllCategories();

                setCategories(data);
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load categories.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    const onSubmit = async (data: CategoryFormData) => {
        setSaving(true);
        setError("");

        try {
            const category = {
                categoryName: data.categoryName,
                description: data.categoryDescription,
            };

            if (editingCategory) {
                await updateCategory({
                    id: editingCategory.id,
                    ...category,
                });
            } else {
                await createCategory(category);
            }

            await loadCategories();

            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: CategoryData) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    async function handleDelete(id: number) {
        try {
            await deleteCategory(id);

            await loadCategories();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    }

    const openAddModal = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const filteredCategories = categories.filter((category) =>
        category.categoryName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()),
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },

        {
            title: "Category Name",
            dataIndex: "categoryName",
            key: "categoryName",
        },

        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },

        ...(isAdmin
            ? [
                  {
                      title: "Actions",
                      key: "actions",

                      render: (_: unknown, record: CategoryData) => (
                          <Space>
                              <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEdit(record)}
                              >
                                  Edit
                              </Button>

                              <Popconfirm
                                  title="Delete this category?"
                                  onConfirm={() => handleDelete(record.id)}
                              >
                                  <Button danger icon={<DeleteOutlined />}>
                                      Delete
                                  </Button>
                              </Popconfirm>
                          </Space>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <>
            <Title level={2}>Category Management</Title>

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

            <Space
                style={{
                    width: "100%",
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {isAdmin && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        Add Category
                    </Button>
                )}

                <Search
                    placeholder="Search categories..."
                    allowClear
                    onSearch={setSearchKeyword}
                    style={{
                        width: 350,
                    }}
                />
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={filteredCategories}
                pagination={{
                    pageSize: 10,
                }}
            />

            <CategoryFormModal
                show={showModal}
                editingCategory={editingCategory}
                onSubmit={onSubmit}
                onClose={closeModal}
                saving={saving}
            />
        </>
    );
}
