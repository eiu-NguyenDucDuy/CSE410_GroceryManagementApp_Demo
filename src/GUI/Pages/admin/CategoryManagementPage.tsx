import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../../../DAL/CategoryService";
import { type CategoryData } from "../../../models/CategoryData";
import CategoryFormModal from "../../Components/CategoryFormModal";
import "./styles.css";
import { useAuth } from "../../../context/auth/useAuth";

type CategoryFormData = {
    categoryName: string;
    categoryDescription: string;
};

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
        null,
    );

    const { state } = useAuth();
    const isAdmin = state.user?.role === "admin";

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
        const category = {
            categoryName: data.categoryName,
            description: data.categoryDescription,
        };

        try {
            if (editingCategory) {
                const updatedCategory = await updateCategory({
                    id: editingCategory.id,
                    ...category,
                });

                setCategories((prev) =>
                    prev.map((c) =>
                        c.id === updatedCategory.id ? updatedCategory : c,
                    ),
                );
            } else {
                const savedCategory = await createCategory({
                    id: generateId(),
                    ...category,
                });

                setCategories((prev) => [...prev, savedCategory]);
            }

            closeModal();
        } catch (error) {
            console.error(error);
            alert("Save failed");
        }
    };

    const handleEdit = (category: CategoryData) => {
        setEditingCategory(category);

        reset({
            categoryName: category.categoryName,
            categoryDescription: category.description,
        });

        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Confirm delete this category?");

        if (!confirmDelete) return;

        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.error(error);
            alert("Delete failed");
        }
    };

    const openAddModal = () => {
        setEditingCategory(null);

        reset({
            categoryName: "",
            categoryDescription: "",
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        reset();
    };

    return (
        <>
            <h3 className="mb-4">Category Management</h3>

            {isAdmin && (
                <button className="btn btn-success mb-3" onClick={openAddModal}>
                    + Add Category
                </button>
            )}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.categoryName}</td>
                                <td>{c.description}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning mr-2"
                                            onClick={() => handleEdit(c)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(c.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CategoryFormModal
                show={showModal}
                editingCategory={editingCategory}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                onClose={closeModal}
            />
        </>
    );
}
