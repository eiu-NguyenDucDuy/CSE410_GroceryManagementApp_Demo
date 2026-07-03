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

type ProductFormData = {
    productTitle: string;
    productThumbnail: string;
    productPrice: string;
    productDescription: string;
    productCategoryId: number;
};

export default function ProductManagementPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(
        null,
    );

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
        const product = {
            title: data.productTitle,
            thumbnail: data.productThumbnail,
            price: data.productPrice,
            description: data.productDescription,
            categoryId: data.productCategoryId,
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
            productThumbnail: product.thumbnail,
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

            <button className="btn btn-success mb-3" onClick={openAddModal}>
                + Add Product
            </button>

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.title}</td>
                                <td>{p.thumbnail}</td>
                                <td>{p.price}</td>
                                <td>{p.description}</td>
                                <td>{p.categoryId}</td>
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
