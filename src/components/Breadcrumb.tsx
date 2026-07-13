import { Breadcrumb } from "antd";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router-dom";

type BreadcrumbHandle = {
    breadcrumb?: string;
};

export default function AppBreadcrumb() {
    const matches = useMatches();
    const { t } = useTranslation();

    const items = matches
        .map((match) => {
            const handle = match.handle as BreadcrumbHandle;

            if (!handle?.breadcrumb) {
                return null;
            }

            return {
                title: t(handle.breadcrumb),
            };
        })
        .filter((item): item is { title: string } => Boolean(item));

    return <Breadcrumb items={items} />;
}
