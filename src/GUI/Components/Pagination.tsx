interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    const indexOfLastItem = currentPage * itemsPerPage;

    const pageNumbers = Array.from(
        { length: totalPages },
        (_, index) => index + 1,
    );

    return (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted small">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, totalItems)} entries
            </span>
            <nav aria-label="Table navigation">
                <ul className="pagination mb-0">
                    <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous"
                        >
                            &laquo;
                        </button>
                    </li>

                    {pageNumbers.map((number) => (
                        <li
                            key={number}
                            className={`page-item ${currentPage === number ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageChange(number)}
                                style={{ cursor: "pointer" }}
                            >
                                {number}
                            </button>
                        </li>
                    ))}

                    <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next"
                        >
                            &raquo;
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
