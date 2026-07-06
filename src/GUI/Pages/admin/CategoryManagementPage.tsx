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
import SearchBar from "../../Components/SearchBar";
import Pagination from "../../Components/Pagination";

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
    const [activeSearchKeyword, setActiveSearchKeyword] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

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

    const filteredCategories = categories.filter((c) =>
        c.categoryName
            .toLowerCase()
            .includes(activeSearchKeyword.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentCategoriesSlice = filteredCategories.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const handleSearchSubmit = (keyword: string) => {
        setActiveSearchKeyword(keyword);
        setCurrentPage(1);
    };

    return (
        <>
            <h3 className="mb-4">Category Management</h3>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                {isAdmin && (
                    <button
                        className="btn btn-success mb-3"
                        onClick={openAddModal}
                    >
                        + Add Category
                    </button>
                )}

                <div style={{ minWidth: "350px" }}>
                    <SearchBar
                        onSearch={handleSearchSubmit}
                        placeholder="Search categories..."
                    />
                </div>
            </div>

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
                        {currentCategoriesSlice.length > 0 ? (
                            currentCategoriesSlice.map((c) => (
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
                                                onClick={() =>
                                                    handleDelete(c.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={isAdmin ? 4 : 3}
                                    className="text-center text-muted py-4"
                                >
                                    No categories found matching "
                                    {activeSearchKeyword}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCategories.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />

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
