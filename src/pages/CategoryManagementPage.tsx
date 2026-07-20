import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../services/categoryService";
import type { CategoryData, CategoryFormData } from "../types/category";
import CategoryFormModal from "../components/CategoryFormModal";
import { useAuth } from "../hooks/useAuth";
import { Table, Button, Alert, Spin, Space, Input, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { colors } from "../config/colors";

const { Search } = Input;

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
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
    } = useForm<CategoryFormData>();
    const { t } = useTranslation();

    // Load categories
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

    // Create / Update
    const onSubmit = async (data: CategoryFormData) => {
        setSaving(true);
        setError("");

        try {
            const category = {
                categoryName: data.categoryName,
                description: data.categoryDescription,
            };

            if (editingCategory) {
                const updatedCategory = await updateCategory({
                    id: editingCategory.id,
                    ...category,
                });

                setCategories((prev) =>
                    prev.map((c) =>
                        c.id === updatedCategory.id ? updatedCategory : c,
                    ),
                );
            } else {
                const savedCategory = await createCategory(category);

                setCategories((prev) => [...prev, savedCategory]);
            }

            closeModal();
        } catch (err) {
            console.error(err);

            setError(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: CategoryData) => {
        setEditingCategory(category);

        reset({
            categoryName: category.categoryName,
            categoryDescription: category.description,
        });

        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            `${t("validation.confirmDeleteCategory")}`,
        );

        if (!confirmDelete) return;

        try {
            await deleteCategory(id);

            setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);

            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    };

    const openAddModal = () => {
        setEditingCategory(null);

        reset({
            categoryName: "",
            categoryDescription: "",
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        reset();
    };

    const handleSearchSubmit = (keyword: string) => {
        setActiveSearchKeyword(keyword);
    };

    const filteredCategories = categories.filter((c) =>
        c.categoryName
            .toLowerCase()
            .includes(activeSearchKeyword.toLowerCase()),
    );

    const onTableChange: TableProps<CategoryData>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra,
    ) => {
        console.log("Category params:", {
            pagination,
            filters,
            sorter,
            extra,
        });
    };

    const columns: ColumnsType<CategoryData> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: "ascend",
        },
        {
            title: t("category.name"),
            dataIndex: "categoryName",
            key: "categoryName",
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },
        {
            title: t("category.description"),
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (text: string) => <span title={text}>{text}</span>,
        },
        ...(isAdmin
            ? [
                  {
                      title: t("common.actions"),
                      key: "actions",
                      width: 180,
                      fixed: "right" as const,
                      render: (_: unknown, record: CategoryData) => (
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
            <h2 style={{ color: colors.category }}>
                {t("category.categoryManagement")}
            </h2>

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
                        {t("category.addCategory")}
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

            <Table<CategoryData>
                rowKey="id"
                columns={columns}
                dataSource={filteredCategories}
                onChange={onTableChange}
                bordered
                size="middle"
                scroll={{ x: 1100 }}
                pagination={{
                    pageSize: itemsPerPage,
                    showQuickJumper: true,
                    showSizeChanger: false,
                }}
            />

            <CategoryFormModal
                show={showModal}
                editingCategory={editingCategory}
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
