import type { CategoryData, CategoryFormData } from "../types/category";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    Control,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Modal, Input, Button, Typography, Space } from "antd";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Text } = Typography;

type CategoryFormModalProps = {
    show: boolean;
    editingCategory: CategoryData | null;
    control: Control<CategoryFormData>;
    handleSubmit: UseFormHandleSubmit<CategoryFormData>;
    errors: FieldErrors<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onClose: () => void;
    saving: boolean;
};

export default function CategoryFormModal({
    show,
    editingCategory,
    control,
    handleSubmit,
    errors,
    onSubmit,
    onClose,
    saving,
}: CategoryFormModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            open={show}
            title={
                editingCategory
                    ? t("category.editCategory")
                    : t("category.addCategory")
            }
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
                            {t("category.name")} <Text type="danger">*</Text>
                        </label>

                        <Controller
                            name="categoryName"
                            control={control}
                            rules={{
                                required: t("validation.categoryNameRequired"),
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder={t("category.namePlaceholder")}
                                />
                            )}
                        />

                        {errors.categoryName && (
                            <Text type="danger">
                                {errors.categoryName.message}
                            </Text>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label>{t("category.description")}</label>

                        <Controller
                            name="categoryDescription"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    rows={4}
                                    placeholder={t(
                                        "category.descriptionPlaceholder",
                                    )}
                                />
                            )}
                        />
                    </div>

                    {/* Footer buttons */}
                    <Space
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            type="primary"
                            color="green"
                            variant="solid"
                            htmlType="submit"
                            loading={saving}
                        >
                            {editingCategory
                                ? t("common.update")
                                : t("common.save")}
                        </Button>

                        <Button
                            type="primary"
                            color="red"
                            variant="solid"
                            onClick={onClose}
                            disabled={saving}
                        >
                            {t("common.cancel")}
                        </Button>
                    </Space>
                </Space>
            </form>
        </Modal>
    );
}
