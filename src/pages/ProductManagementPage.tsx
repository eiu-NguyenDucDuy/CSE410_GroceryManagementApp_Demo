import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
} from "../services/productService";
import { type ProductData, type ProductFormData } from "../types/product";
import ProductFormModal from "../components/ProductFormModal";
import "./styles.css";
import { useAuth } from "../context/useAuth";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

export default function ProductManagementPage() {
    const [products, setProducts] = useState<ProductData[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(
        null,
    );

    const [activeSearchKeyword, setActiveSearchKeyword] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const itemsPerPage = 10;

    const { state } = useAuth();
    const isAdmin = state.user?.role === "admin";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>();

    // Load products
    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true);
                setError("");

                const data = await getAllProducts();

                setProducts(data);
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load products.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    // Create / Update
    const onSubmit = async (data: ProductFormData) => {
        setSaving(true);
        setError("");

        try {
            let thumbnailString = "";

            if (
                data.productThumbnail instanceof FileList &&
                data.productThumbnail.length > 0
            ) {
                const file = data.productThumbnail[0];

                thumbnailString = await new Promise<string>((resolve) => {
                    const reader = new FileReader();

                    reader.onloadend = () => resolve(reader.result as string);

                    reader.readAsDataURL(file);
                });
            } else if (typeof data.productThumbnail === "string") {
                thumbnailString = data.productThumbnail;
            }

            if (!thumbnailString && editingProduct) {
                thumbnailString = editingProduct.thumbnail || "";
            }

            const product = {
                title: data.productTitle,
                thumbnail: thumbnailString || null,
                price: Number(data.productPrice),
                description: data.productDescription,
                categoryId: Number(data.productCategoryId),
            };

            if (editingProduct) {
                const updatedProduct = await updateProduct({
                    id: editingProduct.id,
                    ...product,
                });

                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === updatedProduct.id ? updatedProduct : p,
                    ),
                );
            } else {
                const savedProduct = await createProduct(product);

                setProducts((prev) => [...prev, savedProduct]);
            }

            closeModal();
        } catch (err) {
            console.error(err);

            setError(err instanceof Error ? err.message : "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product: ProductData) => {
        setEditingProduct(product);

        reset({
            productTitle: product.title,
            productThumbnail: product.thumbnail ?? "",
            productPrice: Number(product.price).toString(),
            productDescription: product.description,
            productCategoryId: product.categoryId,
        });

        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Confirm delete this product?");

        if (!confirmDelete) return;

        try {
            await deleteProduct(id);

            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);

            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);

        reset({
            productTitle: "",
            productThumbnail: "",
            productPrice: "",
            productDescription: "",
            productCategoryId: 0,
        });

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        reset();
    };

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(activeSearchKeyword.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;

    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentProductsSlice = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const handleSearchSubmit = (keyword: string) => {
        setActiveSearchKeyword(keyword);
        setCurrentPage(1);
    };

    if (loading) {
        return <p className="text-center p-5">Loading products...</p>;
    }

    return (
        <>
            <h3 className="mb-4">Product Management</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                {isAdmin && (
                    <button
                        className="btn btn-success mb-3"
                        onClick={openAddModal}
                    >
                        + Add Product
                    </button>
                )}

                <div style={{ minWidth: "350px" }}>
                    <SearchBar
                        onSearch={handleSearchSubmit}
                        placeholder="Search products..."
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Thumbnail</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Category ID</th>

                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {currentProductsSlice.length > 0 ? (
                            currentProductsSlice.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.title}</td>

                                    <td>
                                        {p.thumbnail && (
                                            <img
                                                src={p.thumbnail}
                                                alt={p.title}
                                                width={50}
                                            />
                                        )}
                                    </td>

                                    <td>{p.price}</td>
                                    <td>{p.description}</td>
                                    <td>{p.categoryId}</td>

                                    {isAdmin && (
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleEdit(p)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    handleDelete(p.id)
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
                                    colSpan={isAdmin ? 7 : 6}
                                    className="text-center text-muted py-4"
                                >
                                    No products found matching "
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
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />

            <ProductFormModal
                show={showModal}
                editingProduct={editingProduct}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                onClose={closeModal}
                saving={saving}
            />
        </>
    );
}
