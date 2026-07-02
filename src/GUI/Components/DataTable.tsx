import { type ReactNode } from "react";

export type Column<T, K extends keyof T = keyof T> = {
    header: string;
    field: keyof T;
    render?: (value: T[K], row: T) => ReactNode;
};

type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
};

export function DataTable<T extends object>({
    data,
    columns,
}: DataTableProps<T>) {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th key={i}>{col.header}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((col, j) => {
                            const value = row[col.field];

                            return (
                                <td key={j}>
                                    {col.render
                                        ? col.render(value, row)
                                        : String(value)}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
