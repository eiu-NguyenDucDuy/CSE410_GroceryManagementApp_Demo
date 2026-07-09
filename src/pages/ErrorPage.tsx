import {
    isRouteErrorResponse,
    useNavigate,
    useRouteError,
} from "react-router-dom";
import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";

export default function ErrorPage() {
    const error = useRouteError();

    const navigate = useNavigate();

    let status = "500";

    let title = "Something went wrong";

    let message = "An unexpected error has occurred.";

    if (isRouteErrorResponse(error)) {
        status = String(error.status);

        if (error.status === 404) {
            title = "Page Not Found";

            message = "Sorry, the page you are looking for does not exist.";
        } else {
            title = error.statusText || "Request Error";

            message = "There was a problem processing your request.";
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
                        Back Home
                    </Button>
                }
            />
        </div>
    );
}
