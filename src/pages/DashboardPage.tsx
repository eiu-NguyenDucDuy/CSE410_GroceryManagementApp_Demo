import { useEffect, useState } from "react";
import { type CategoryData } from "../types/category";
import { type ProductData } from "../types/product";
import { DataTable, type Column } from "../components/DataTable";
import { getAllCategories } from "../services/categoryService";
import { getAllProducts } from "../services/productService";
import "./styles.css";

export default function DashboardPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true);
                setError("");

                const [categoryData, productData] = await Promise.all([
                    getAllCategories(),
                    getAllProducts(),
                ]);

                setCategories(categoryData);
                setProducts(productData);
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load dashboard data.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-5">
                <h1 className="text-xl text-slate-900">Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-5 text-red-500">
                <h1 className="text-xl">Error!</h1>
                <p>{error}</p>
            </div>
        );
    }

    const categoryColumns: Column<CategoryData>[] = [
        {
            header: "ID",
            field: "id",
        },
        {
            header: "Name",
            field: "categoryName",
        },
        {
            header: "Description",
            field: "description",
        },
    ];

    const productColumns: Column<ProductData>[] = [
        {
            header: "ID",
            field: "id",
        },
        {
            header: "Title",
            field: "title",
        },
        {
            header: "Thumbnail",
            field: "thumbnail",
            render: (value: string | null) => {
                return value ? (
                    <img src={value} width={50} alt="product" />
                ) : (
                    <span className="no-image">No Image</span>
                );
            },
        },
        {
            header: "Price",
            field: "price",
        },
        {
            header: "Category ID",
            field: "categoryId",
            render: (value: number) => {
                const category = categories.find((c) => c.id === value);

                return category ? category.categoryName : "N/A";
            },
        },
    ];

    return (
        <div className="dashboard">
            <h2>Category List</h2>
            <DataTable data={categories} columns={categoryColumns} />

            <h2>Product List</h2>
            <DataTable data={products} columns={productColumns} />
        </div>
    );
}
