import type { ProductData, ProductFormData } from "../types/product";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    Control,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import {
    Modal,
    Input,
    InputNumber,
    Button,
    Upload,
    Typography,
    Space,
    Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { DefaultOptionType } from "antd/es/select";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;
const { Text } = Typography;

type ProductFormModalProps = {
    show: boolean;
    editingProduct: ProductData | null;
    control: Control<ProductFormData>;
    handleSubmit: UseFormHandleSubmit<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    onSubmit: (data: ProductFormData) => Promise<void>;
    onClose: () => void;
    saving: boolean;
    categoryOptions: DefaultOptionType[];
};

export default function ProductFormModal({
    show,
    editingProduct,
    control,
    handleSubmit,
    errors,
    onSubmit,
    onClose,
    saving,
    categoryOptions,
}: ProductFormModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            open={show}
            title={
                editingProduct
                    ? t("product.editProduct")
                    : t("product.addProduct")
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
                            {t("product.title")} <Text type="danger">*</Text>
                        </label>

                        <Controller
                            name="productTitle"
                            control={control}
                            rules={{
                                required: t("validation.productTitleRequired"),
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder={t("product.titlePlaceholder")}
                                />
                            )}
                        />

                        {errors.productTitle && (
                            <Text type="danger">
                                {errors.productTitle.message}
                            </Text>
                        )}
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label>{t("product.thumbnail")}</label>

                        <Controller
                            name="productThumbnail"
                            control={control}
                            render={({ field }) => (
                                <Upload
                                    beforeUpload={() => false}
                                    accept="image/*"
                                    maxCount={1}
                                    fileList={
                                        field.value instanceof FileList &&
                                        field.value.length > 0
                                            ? [
                                                  {
                                                      uid: "-1",
                                                      name: field.value[0].name,
                                                      status: "done",
                                                  },
                                              ]
                                            : []
                                    }
                                    onChange={({ fileList }) => {
                                        if (fileList.length === 0) {
                                            field.onChange(undefined);
                                            return;
                                        }

                                        const file = fileList[0].originFileObj;

                                        if (file) {
                                            const dt = new DataTransfer();
                                            dt.items.add(file);
                                            field.onChange(dt.files);
                                        }
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        {t("common.upload")}
                                    </Button>
                                </Upload>
                            )}
                        />

                        {errors.productThumbnail && (
                            <Text type="danger">
                                {errors.productThumbnail.message}
                            </Text>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label>{t("product.price")}</label>

                        <Space.Compact style={{ width: "100%" }}>
                            <Controller
                                name="productPrice"
                                control={control}
                                rules={{
                                    min: {
                                        value: 0,
                                        message: t(
                                            "validation.productPriceMin",
                                        ),
                                    },
                                }}
                                render={({ field }) => (
                                    <InputNumber
                                        value={field.value}
                                        onChange={(value) =>
                                            field.onChange(value ?? 0)
                                        }
                                        min={0}
                                        style={{ width: "100%" }}
                                        formatter={(value) =>
                                            value
                                                ? Number(value).toLocaleString()
                                                : ""
                                        }
                                        parser={(value) =>
                                            Number(
                                                value?.replace(/,/g, "") || 0,
                                            )
                                        }
                                    />
                                )}
                            />

                            <Select
                                defaultValue="USD"
                                style={{ width: 100 }}
                                options={[
                                    { label: "USD", value: "USD" },
                                    { label: "VND", value: "VND" },
                                    { label: "RMB", value: "RMB" },
                                    { label: "JPY", value: "JPY" },
                                ]}
                            />
                        </Space.Compact>

                        {errors.productPrice && (
                            <Text type="danger">
                                {errors.productPrice.message}
                            </Text>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label>{t("product.description")}</label>

                        <Controller
                            name="productDescription"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    rows={4}
                                    placeholder={t(
                                        "product.descriptionPlaceholder",
                                    )}
                                />
                            )}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label>
                            {t("product.category")} <Text type="danger">*</Text>
                        </label>

                        <Controller
                            name="productCategoryId"
                            control={control}
                            rules={{
                                required: t(
                                    "validation.productCategoryRequired",
                                ),
                            }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder={t(
                                        "product.categoryPlaceholder",
                                    )}
                                    options={categoryOptions}
                                    style={{
                                        width: "100%",
                                    }}
                                />
                            )}
                        />

                        {errors.productCategoryId && (
                            <Text type="danger">
                                {errors.productCategoryId.message}
                            </Text>
                        )}
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
                            {editingProduct
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
