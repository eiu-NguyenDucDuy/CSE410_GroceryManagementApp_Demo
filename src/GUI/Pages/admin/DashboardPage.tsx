import { useEffect, useState } from "react";
import type { CategoryData } from "../../../models/CategoryData";
import type { ProductData } from "../../../models/ProductData";
import { DataTable, type Column } from "../../Components/DataTable";
import "./styles.css";

export default function DashboardPage() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);

    useEffect(() => {
        fetch("http://localhost:3001/categories")
            .then((response) => response.json())
            .then((data) => setCategories(data));

        fetch("http://localhost:3001/products")
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, []);

    const categoryColumns: Column<CategoryData>[] = [
        { header: "ID", field: "id" },
        { header: "Name", field: "categoryName" },
        { header: "Description", field: "description" },
    ];

    const productColumns: Column<ProductData>[] = [
        { header: "ID", field: "id" },
        { header: "Title", field: "title" },
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
        { header: "Price", field: "price" },
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
