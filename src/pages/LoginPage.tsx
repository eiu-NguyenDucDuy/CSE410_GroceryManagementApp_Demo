import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/userService";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

type LoginFormData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const { dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();
    const handleLogin = async (values: LoginFormData) => {
        setLoading(true);
        setError("");

        try {
            const user = await login(values.email.trim(), values.password);

            if (!user) {
                setError(t("validation.userNotFound"));
                return;
            }

            dispatch({
                type: "LOGIN",
                payload: user,
            });

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : t("validation.connectedFailed"),
            );
        } finally {
            setLoading(false);
        }
    };

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
            <Card
                style={{
                    width: 400,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <Title
                    level={2}
                    style={{
                        textAlign: "center",
                        marginBottom: 30,
                    }}
                >
                    {t("login.title")}
                </Title>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{
                            marginBottom: 20,
                        }}
                    />
                )}

                <Form layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                        label={t("login.email")}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: t("validation.emailRequired"),
                            },
                            {
                                type: "email",
                                message: t("validation.emailInvalid"),
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder={t("login.emailPlaceholder")}
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t("login.password")}
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: t("validation.passwordRequired"),
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder={t("login.passwordPlaceholder")}
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            {loading ? t("login.loggingIn") : t("auth.login")}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
