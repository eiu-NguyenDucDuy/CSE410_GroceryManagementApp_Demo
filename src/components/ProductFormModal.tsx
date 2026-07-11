import type { ProductData, ProductFormData } from "../types/product";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
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

const { TextArea } = Input;
const { Text } = Typography;

type ProductFormModalProps = {
    show: boolean;
    editingProduct: ProductData | null;
    register: UseFormRegister<ProductFormData>;
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
    register,
    control,
    handleSubmit,
    errors,
    onSubmit,
    onClose,
    saving,
    categoryOptions,
}: ProductFormModalProps) {
    return (
        <Modal
            open={show}
            title={editingProduct ? "Edit Product" : "Add New Product"}
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
                            placeholder="Product title"
                            {...register("productTitle", {
                                required: "Product title is required",
                            })}
                        />

                        {errors.productTitle && (
                            <Text type="danger">
                                {errors.productTitle.message}
                            </Text>
                        )}
                    </div>

                    {/* Thumbnail */}
                    <div>
                        <label>Thumbnail Image</label>

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
                                        Choose Image
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
                        <label>
                            Price <Text type="danger">*</Text>
                        </label>

                        <Space.Compact style={{ width: "100%" }}>
                            <Controller
                                name="productPrice"
                                control={control}
                                rules={{
                                    required: "Price is required",
                                    min: {
                                        value: 0,
                                        message: "Price cannot be negative",
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
                        <label>Description</label>

                        <TextArea
                            rows={4}
                            placeholder="Product description"
                            {...register("productDescription")}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label>
                            Category<Text type="danger">*</Text>
                        </label>

                        <Controller
                            name="productCategoryType"
                            control={control}
                            rules={{
                                required: "Category is required",
                            }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder="Select a category"
                                    options={categoryOptions}
                                    style={{
                                        width: "100%",
                                    }}
                                />
                            )}
                        />

                        {errors.productCategoryType && (
                            <Text type="danger">
                                {errors.productCategoryType.message}
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
                            color="red"
                            variant="solid"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="primary"
                            color="green"
                            variant="solid"
                            htmlType="submit"
                            loading={saving}
                        >
                            {editingProduct ? "Update" : "Save"}
                        </Button>
                    </Space>
                </Space>
            </form>
        </Modal>
    );
}
