import {
    isRouteErrorResponse,
    useNavigate,
    useRouteError,
} from "react-router-dom";
import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();
    const { t } = useTranslation();

    let status = "500";
    let title = t("errors.500");
    let message = t("errors.500Message");

    if (isRouteErrorResponse(error)) {
        status = String(error.status);

        if (error.status === 404) {
            title = t("errors.404");
            message = t("errors.404Message");
        } else {
            title = error.statusText || t("errors.400");
            message = t("errors.400Message");
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f5f5",
            }}
        >
            <Result
                status={status === "404" ? "404" : "500"}
                title={status}
                subTitle={
                    <>
                        <h3>{title}</h3>
                        <p>{message}</p>
                    </>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<HomeOutlined />}
                        onClick={() => navigate("/")}
                    >
                        {t("errors.back")}
                    </Button>
                }
            />
        </div>
    );
}
