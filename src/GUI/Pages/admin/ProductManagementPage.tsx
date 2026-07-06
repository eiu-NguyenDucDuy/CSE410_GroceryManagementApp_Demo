import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    updateProduct,
} from "../../../DAL/ProductService";
import { type ProductData } from "../../../models/ProductData";
import ProductFormModal from "../../Components/ProductFormModal";
import "./styles.css";
import type { ProductFormData } from "../../../models/ProductFormData";
import { useAuth } from "../../../context/auth/useAuth";

export default function ProductManagementPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(
        null,
    );

    const { state } = useAuth();
    const isAdmin = state.user?.role === "admin";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>();

    useEffect(() => {
        getAllProducts().then(setProducts);
    }, []);

    const generateId = () => {
        if (products.length === 0) return 1;
        return Math.max(...products.map((p) => Number(p.id))) + 1;
    };

    const onSubmit = async (data: ProductFormData) => {
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
            price: data.productPrice,
            description: data.productDescription,
            categoryId: Number(data.productCategoryId),
        };

        try {
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
                const savedProduct = await createProduct({
                    id: generateId(),
                    ...product,
                });

                setProducts((prev) => [...prev, savedProduct]);
            }

            closeModal();
        } catch (error) {
            console.error(error);
            alert("Save failed");
        }
    };

    const handleEdit = (product: ProductData) => {
        setEditingProduct(product);

        reset({
            productTitle: product.title,
            productThumbnail: product.thumbnail ?? "",
            productPrice: product.price,
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
        } catch (error) {
            console.log(error);
            alert("Delete failed");
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

    return (
        <>
            <h3 className="mb-4">Product Management</h3>

            {isAdmin && (
                <button className="btn btn-success mb-3" onClick={openAddModal}>
                    + Add Product
                </button>
            )}

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
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.title}</td>
                                <td>
                                    {p.thumbnail ? (
                                        <img
                                            src={p.thumbnail}
                                            alt={p.title}
                                            width={50}
                                        />
                                    ) : null}
                                </td>
                                <td>{p.price}</td>
                                <td>{p.description}</td>
                                <td>{p.categoryId}</td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning mr-2"
                                            onClick={() => handleEdit(p)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(p.id)}
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

            <ProductFormModal
                show={showModal}
                editingProduct={editingProduct}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onSubmit}
                onClose={closeModal}
            />
        </>
    );
}
