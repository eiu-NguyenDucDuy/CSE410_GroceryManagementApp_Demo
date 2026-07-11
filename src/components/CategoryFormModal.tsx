import type { CategoryData, CategoryFormData } from "../types/category";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
} from "react-hook-form";
import { Modal, Input, Button, Typography, Space } from "antd";

const { TextArea } = Input;
const { Text } = Typography;

type CategoryFormModalProps = {
    show: boolean;
    editingCategory: CategoryData | null;
    register: UseFormRegister<CategoryFormData>;
    handleSubmit: UseFormHandleSubmit<CategoryFormData>;
    errors: FieldErrors<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onClose: () => void;
    saving: boolean;
};

export default function CategoryFormModal({
    show,
    editingCategory,
    register,
    handleSubmit,
    errors,
    onSubmit,
    onClose,
    saving,
}: CategoryFormModalProps) {
    return (
        <Modal
            open={show}
            title={editingCategory ? "Edit Category" : "Add New Category"}
            onCancel={onClose}
            footer={null}
            width={700}
            maskClosable={!saving}
            closable={!saving}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{
                        width: "100%",
                    }}
                >
                    {/* Title */}
                    <div>
                        <label>
                            Title <Text type="danger">*</Text>
                        </label>

                        <Input
                            placeholder="Category name"
                            {...register("categoryName", {
                                required: "Category name is required",
                            })}
                        />

                        {errors.categoryName && (
                            <Text type="danger">
                                {errors.categoryName.message}
                            </Text>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label>Description</label>

                        <TextArea
                            rows={4}
                            placeholder="Category description"
                            {...register("categoryDescription")}
                        />
                    </div>

                    {/* Footer buttons */}
                    <Space
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button onClick={onClose} disabled={saving}>
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={saving}
                        >
                            {editingCategory ? "Update" : "Save"}
                        </Button>
                    </Space>
                </Space>
            </form>
        </Modal>
    );
}
