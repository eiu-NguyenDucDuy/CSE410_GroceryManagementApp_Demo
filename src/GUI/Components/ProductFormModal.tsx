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
                                <label htmlFor="title">
                                    Title
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
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
                                <label htmlFor="thumbnail">Thumbnail URL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="thumbnail"
                                    {...register("productThumbnail")}
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="price">
                                    Price
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
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
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    rows={3}
                                    {...register("productDescription")}
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="categoryId">
                                    Category ID
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="categoryId"
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
