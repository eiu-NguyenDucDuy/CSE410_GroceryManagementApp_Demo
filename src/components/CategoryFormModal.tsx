import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import type { CategoryData, CategoryFormData } from "../types/category";

type CategoryFormModalProps = {
    show: boolean;
    editingCategory: CategoryData | null;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onClose: () => void;
    saving: boolean;
};

export default function CategoryFormModal({
    show,
    editingCategory,
    onSubmit,
    onClose,
    saving,
}: CategoryFormModalProps) {
    const [form] = Form.useForm<CategoryFormData>();

    useEffect(() => {
        if (editingCategory) {
            form.setFieldsValue({
                categoryName: editingCategory.categoryName,
                categoryDescription: editingCategory.description,
            });
        } else {
            form.resetFields();
        }
    }, [editingCategory, form]);

    const handleFinish = async (values: CategoryFormData) => {
        await onSubmit(values);
        form.resetFields();
    };

    return (
        <Modal
            title={editingCategory ? "Edit Category" : "Add New Category"}
            open={show}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: "Category name is required",
                        },
                    ]}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>

                <Form.Item label="Description" name="categoryDescription">
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                    }}
                >
                    <Button onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>

                    <Button type="primary" htmlType="submit" loading={saving}>
                        {editingCategory ? "Update" : "Save"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
