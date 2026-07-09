import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

export default function AppBreadcrumb() {
    const location = useLocation();

    const items = location.pathname
        .split("/")
        .filter(Boolean)
        .map((item) => ({
            title: item.charAt(0).toUpperCase() + item.slice(1),
        }));

    return (
        <Breadcrumb
            items={[
                {
                    title: "Home",
                },
                ...items,
            ]}
        />
    );
}
