import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllProducts } from "../../../DAL/ProductService";
import type { ProductData } from "../../../models/ProductData";
import "./styles.css";
import axios from "axios";

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
        try {
            const newProduct = {
                id: generateId(),
                title: data.productTitle,
                thumbnail: data.productThumbnail,
                price: data.productPrice,
                description: data.productDescription,
                categoryId: data.productCategoryId,
            };

            const response = await fetch(`http://localhost:3001/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            const saved = await response.json();

            setProducts((prev) => [...prev, saved]);

            reset();
            setShowModal(false);
        } catch (error) {
            console.error(error);
            alert("Failed to create product");
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?",
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3001/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.log(error);
            alert("Delete failed");
        }
    };

    return (
        <>
            <h3 className="mb-4">Product Management</h3>

            <button
                className="btn btn-success mb-3"
                onClick={() => setShowModal(true)}
            >
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
                                    <button className="btn btn-sm btn-warning mr-2">
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

            {showModal && (
                <div className="modal d-block model-overlay">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Product</h5>
                                <button
                                    className="btn btn-close"
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-body modal-scroll">
                                    <div className="form-group">
                                        <label htmlFor="title">
                                            Title
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="string"
                                            className="form-control"
                                            id="title"
                                            {...register("productTitle", {
                                                required:
                                                    "Product title is required",
                                            })}
                                        />
                                        {errors.productTitle && (
                                            <small className="text-danger">
                                                {errors.productTitle.message}
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="thumbnail">
                                            Thumbnail URL
                                        </label>
                                        <input
                                            className="form-control"
                                            id="thumbnail"
                                            {...register("productThumbnail")}
                                        />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label htmlFor="price">
                                            Price
                                            <span className="text-danger">
                                                *
                                            </span>
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
                                        <label htmlFor="description">
                                            Description
                                        </label>
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
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="categoryId"
                                            {...register("productCategoryId", {
                                                required:
                                                    "Category ID is required",
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Category ID cannot be negative",
                                                },
                                            })}
                                        />
                                        {errors.productCategoryId && (
                                            <small className="text-danger">
                                                {
                                                    errors.productCategoryId
                                                        .message
                                                }
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
