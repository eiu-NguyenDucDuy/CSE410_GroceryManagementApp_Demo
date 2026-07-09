import type { CategoryData, CategoryFormData } from "../types/category";
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
                        <button
                            type="button"
                            className="btn btn-close"
                            onClick={onClose}
                            disabled={saving}
                        >
                            &times;
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
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
                                <label className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
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
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingCategory
                                      ? "Update"
                                      : "Save"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={saving}
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
