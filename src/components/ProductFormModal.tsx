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
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

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

                        <Upload
                            beforeUpload={() => false}
                            accept="image/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>
                                Choose Image
                            </Button>
                        </Upload>

                        <input
                            type="file"
                            accept="image/*"
                            style={{
                                display: "none",
                            }}
                            {...register("productThumbnail", {
                                validate: {
                                    imageType: (files) => {
                                        if (
                                            !files ||
                                            !(files instanceof FileList)
                                        ) {
                                            return true;
                                        }

                                        if (files.length === 0) {
                                            return true;
                                        }

                                        return (
                                            files[0].type.startsWith(
                                                "image/",
                                            ) || "Only image files are allowed"
                                        );
                                    },
                                },
                            })}
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
                                    {...field}
                                    style={{
                                        width: "100%",
                                    }}
                                    min={0}
                                    placeholder="Price"
                                />
                            )}
                        />

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
                            Category ID <Text type="danger">*</Text>
                        </label>

                        <Controller
                            name="productCategoryId"
                            control={control}
                            rules={{
                                required: "Category ID is required",
                                min: {
                                    value: 0,
                                    message: "Category ID cannot be negative",
                                },
                            }}
                            render={({ field }) => (
                                <InputNumber
                                    {...field}
                                    style={{
                                        width: "100%",
                                    }}
                                    min={0}
                                    placeholder="Category ID"
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
                        <Button onClick={onClose} disabled={saving}>
                            Cancel
                        </Button>

                        <Button
                            type="primary"
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
