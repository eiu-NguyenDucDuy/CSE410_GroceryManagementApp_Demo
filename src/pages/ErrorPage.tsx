import {
    isRouteErrorResponse,
    useNavigate,
    useRouteError,
} from "react-router-dom";
import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { darkMode } = useTheme();

    const backgroundColor = darkMode ? "#111827" : "#fefefe";
    const textColor = darkMode ? "#f5f5f5" : "#1f1f1f";

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
                background: backgroundColor,
                color: textColor,
                padding: "24px",
            }}
        >
            <Result
                status={status === "404" ? "404" : "500"}
                title={<span style={{ color: textColor }}>{status}</span>}
                subTitle={
                    <div style={{ color: textColor }}>
                        <h3 style={{ color: textColor, marginBottom: "8px" }}>
                            {title}
                        </h3>
                        <p style={{ color: textColor, margin: 0 }}>{message}</p>
                    </div>
                }
                extra={
                    <Button
                        type="primary"
                        variant="outlined"
                        color="purple"
                        icon={<HomeOutlined />}
                        onClick={() => navigate("/dashboard")}
                    >
                        {t("errors.back")}
                    </Button>
                }
            />
        </div>
    );
}
