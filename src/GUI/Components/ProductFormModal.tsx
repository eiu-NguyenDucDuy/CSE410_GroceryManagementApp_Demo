import type { ProductData } from "../../models/ProductData";
import type { ProductFormData } from "../../models/ProductFormData";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
} from "react-hook-form";

type ProductFormModalProps = {
    show: boolean;
    editingProduct: ProductData | null;
    register: UseFormRegister<ProductFormData>;
    handleSubmit: UseFormHandleSubmit<ProductFormData>;
    errors: FieldErrors<ProductFormData>;
    onSubmit: (data: ProductFormData) => void;
    onClose: () => void;
};

export default function ProductFormModal({
    show,
    editingProduct,
    register,
    handleSubmit,
    errors,
    onSubmit,
    onClose,
}: ProductFormModalProps) {
    if (!show) return null;

    return (
        <div className="modal d-block model-overlay">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {editingProduct
                                ? "Edit Product"
                                : "Add New Product"}
                        </h5>
                        <button className="btn btn-close" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body modal-scroll">
                            <div className="form-group">
                                <label className="form-label">
                                    Title
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("productTitle", {
                                        required: "Product title is required",
                                    })}
                                />
                                {errors.productTitle && (
                                    <small className="text-danger">
                                        {errors.productTitle.message}
                                    </small>
                                )}
                            </div>

                            <div className="form-group mt-3">
                                <label className="form-label">
                                    Thumbnail URL
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`form-control ${errors.productThumbnail ? "is-invalid" : ""}`}
                                    {...register("productThumbnail")}
                                />
                            </div>
                            {errors.productThumbnail && (
                                <div className="invalid-feedback">
                                    {errors.productThumbnail.message}
                                </div>
                            )}

                            <div className="form-group mt-3">
                                <label className="form-label">
                                    Price
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    {...register("productPrice", {
                                        required: "Price is required",
                                    })}
                                />
                                {errors.productPrice && (
                                    <small className="text-danger">
                                        {errors.productPrice.message}
                                    </small>
                                )}
                            </div>

                            <div className="form-group mt-3">
                                <label className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    {...register("productDescription")}
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label className="form-label">
                                    Category ID
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    {...register("productCategoryId", {
                                        required: "Category ID is required",
                                        min: {
                                            value: 0,
                                            message:
                                                "Category ID cannot be negative",
                                        },
                                    })}
                                />
                                {errors.productCategoryId && (
                                    <small className="text-danger">
                                        {errors.productCategoryId.message}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">
                                {editingProduct ? "Update" : "Save"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
