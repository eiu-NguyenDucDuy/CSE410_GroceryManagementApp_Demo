import { useForm } from "react-hook-form";
import "./styles.css";

type CategoryFormData = {
    categoryName: string;
    description: string;
};

export default function AddCategoryPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>();

    const onSubmit = (data: CategoryFormData) => {
        console.log("Category submitted:", data);
    };

    return (
        <>
            <main className="container mt-4 mb-5">
                <h3 className="mb-4">Add New Category</h3>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="category-form"
                >
                    <div className="form-group">
                        <label htmlFor="categoryName">Category Name</label>
                        <input
                            {...register("categoryName", {
                                required: "Category name is required",
                            })}
                            type="text"
                            className="form-control"
                            id="categoryName"
                            placeholder="Enter category name"
                        />
                        {errors.categoryName && (
                            <small className="text-danger">
                                {errors.categoryName.message}
                            </small>
                        )}
                    </div>

                    <div className="form-group mt-3">
                        <label htmlFor="categoryDescription">Description</label>
                        <textarea
                            {...register("description")}
                            className="form-control"
                            id="categoryDescription"
                            rows={4}
                            placeholder="Enter category description"
                        />
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-success mr-2">
                            Save
                        </button>
                        <button type="reset" className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
