import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <>
            <nav aria-label="breadcrumb">
                <div className="container">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/admin">Home</Link>
                        </li>

                        {pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                            const isLast = index === pathnames.length - 1;

                            const name = decodeURIComponent(value);

                            return (
                                <li
                                    key={to}
                                    className={`breadcrumb-item ${isLast ? "active" : ""}`}
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {isLast ? (
                                        name
                                    ) : (
                                        <Link to={to}>{name}</Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </nav>
        </>
    );
}
