import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllCategories } from "../../../DAL/CategoryService";
import type { CategoryData } from "../../../models/CategoryData";
import axios from "axios";
import "./styles.css";

type CategoryFormData = {
    categoryName: string;
    description: string;
};

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [showModal, setShowModal] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormData>();

    useEffect(() => {
        getAllCategories().then(setCategories);
    }, []);

    const generateId = () => {
        if (categories.length === 0) return 1;
        return Math.max(...categories.map((c) => Number(c.id))) + 1;
    };

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const newCategory = {
                id: generateId(),
                categoryName: data.categoryName,
                description: data.description,
            };

            const response = await fetch(`http://localhost:3001/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCategory),
            });

            const saved = await response.json();

            setCategories((prev) => [...prev, saved]);

            reset();
            setShowModal(false);
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Failed to create category.");
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Confirm delete this category?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3001/categories/${id}`);
            setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category.");
        }
    };

    return (
        <>
            <h3 className="mb-4">Category Management</h3>
            <button
                className="btn btn-success mb-3"
                onClick={() => setShowModal(true)}
            >
                + Add Category
            </button>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.categoryName}</td>
                                <td>{c.description}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning mr-2">
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div
                    className="modal d-block"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Category</h5>
                                <button
                                    className="btn btn-close"
                                    onClick={() => setShowModal(false)}
                                >
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
                                                required:
                                                    "Category name is required",
                                            })}
                                        />
                                        {errors.categoryName && (
                                            <small className="text-danger">
                                                {errors.categoryName.message}
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="description">
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            {...register("description")}
                                        />
                                        {errors.description && (
                                            <small className="text-danger">
                                                {errors.description.message}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
