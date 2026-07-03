import type { CategoryData } from "../../models/CategoryData";
import type { CategoryFormData } from "../../models/CategoryFormData";
import type {
    FieldErrors,
    UseFormHandleSubmit,
    UseFormRegister,
} from "react-hook-form";

type CategoryFormModalProps = {
    show: boolean;
    editingCategory: CategoryData | null;
    register: UseFormRegister<CategoryFormData>;
    handleSubmit: UseFormHandleSubmit<CategoryFormData>;
    errors: FieldErrors<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => void;
    onClose: () => void;
};

export default function CategoryFormModal({
    show,
    editingCategory,
    register,
    handleSubmit,
    errors,
    onSubmit,
    onClose,
}: CategoryFormModalProps) {
    if (!show) return null;

    return (
        <div
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {editingCategory
                                ? "Edit Category"
                                : "Add New Category"}
                        </h5>
                        <button className="btn btn-close" onClick={onClose}>
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="categoryName">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoryName"
                                    {...register("categoryName", {
                                        required: "Category name is required",
                                    })}
                                />
                                {errors.categoryName && (
                                    <small className="text-danger">
                                        {errors.categoryName.message}
                                    </small>
                                )}
                            </div>

                            <div className="form-group mt-3">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    {...register("categoryDescription")}
                                />
                                {errors.categoryDescription && (
                                    <small className="text-danger">
                                        {errors.categoryDescription.message}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">
                                {editingCategory ? "Update" : "Save"}
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
