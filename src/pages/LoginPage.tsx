import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/useAuth";
import { login } from "../services/userService";

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

    const handleLogin = async (values: LoginFormData) => {
        setLoading(true);
        setError("");

        try {
            const user = await login(values.email.trim(), values.password);

            if (!user) {
                setError("Invalid email or password.");

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
                    : "Unable to connect to the server.",
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
                    Account Login
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
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email",
                            },
                            {
                                type: "email",
                                message: "Invalid email format",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
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
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
