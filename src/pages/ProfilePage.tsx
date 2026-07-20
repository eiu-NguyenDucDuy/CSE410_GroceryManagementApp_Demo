import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { updateUser } from "../services/userService";
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Space,
    Typography,
    Upload,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload";
import { colors } from "../config/colors";

const { Text } = Typography;

export default function ProfilePage() {
    const { t } = useTranslation();
    const { state, dispatch } = useAuth();
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState<string | undefined>(
        state.user?.avatar,
    );
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (state.user) {
            form.setFieldsValue({
                username: state.user.username,
                email: state.user.email,
            });
        }
    }, [form, state.user]);

    const currentAvatar = avatar ?? state.user?.avatar;

    const handleUpload: UploadProps["beforeUpload"] = (file) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
                setAvatar(result);
            }
        };

        reader.readAsDataURL(file);
        return false;
    };

    const handleUploadChange: UploadProps["onChange"] = (info) => {
        const file = info.file?.originFileObj as File | undefined;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                if (typeof result === "string") {
                    setAvatar(result);
                }
            };
            reader.readAsDataURL(file);
        }

        setUploadFileList(info.fileList.slice(-1));
    };

    const handleFinish = async (values: {
        username: string;
        email: string;
        newPassword?: string;
        confirmPassword?: string;
    }) => {
        if (!state.user) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        if (
            values.newPassword &&
            values.newPassword !== values.confirmPassword
        ) {
            setError(t("profile.passwordsDoNotMatch"));
            setSaving(false);
            return;
        }

        // Check if any required fields are empty
        if (!values.username || !values.email) {
            setError(t("profile.missingFields"));
            setSaving(false);
            return;
        }

        if (
            (values.newPassword && !values.confirmPassword) ||
            (!values.newPassword && values.confirmPassword)
        ) {
            setError(t("profile.bothPasswordsRequired"));
            setSaving(false);
            return;
        }

        try {
            const updatedUser = await updateUser({
                ...state.user,
                username: values.username,
                email: values.email,
                password:
                    values.newPassword && values.confirmPassword
                        ? values.newPassword
                        : state.user.password,
                avatar: avatar ?? state.user.avatar,
            });

            // Check if any fields have changed
            if (
                values.username !== state.user.username ||
                values.email !== state.user.email ||
                (values.newPassword && values.confirmPassword)
            ) {
                dispatch({ type: "LOGIN", payload: updatedUser });
                form.setFieldsValue({
                    username: updatedUser.username,
                    email: updatedUser.email,
                });
                setAvatar(updatedUser.avatar);
                setSuccess(t("profile.updatedSuccessfully"));
            } else {
                setSuccess(t("profile.noChanges"));
            }
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update profile.",
            );
        } finally {
            setSaving(false);
        }
    };

    const uploadProps: UploadProps = {
        name: "avatar",
        listType: "picture-card",
        showUploadList: false,
        beforeUpload: handleUpload,
        onChange: handleUploadChange,
        fileList: uploadFileList,
        accept: "image/*",
    };

    return (
        <Card
            title={t("profile.title")}
            styles={{ header: { color: colors.profile } }}
        >
            {error ? (
                <Alert
                    message={error}
                    type="error"
                    style={{ marginBottom: 16 }}
                />
            ) : null}
            {success ? (
                <Alert
                    message={success}
                    type="success"
                    style={{ marginBottom: 16 }}
                />
            ) : null}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    username: state.user?.username,
                    email: state.user?.email,
                }}
            >
                <Form.Item label={t("profile.avatar")}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <Avatar
                            size={96}
                            src={currentAvatar}
                            icon={<UserOutlined />}
                        />
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>
                                {t("common.upload")}
                            </Button>
                        </Upload>
                    </div>
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label={t("profile.username")}
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: t("validation.usernameRequired"),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("profile.usernamePlaceholder")}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label={t("profile.email")}
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
                                placeholder={t("profile.emailPlaceholder")}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label={t("profile.newPassword")}
                            name="newPassword"
                            rules={[]}
                        >
                            <Input.Password
                                placeholder={t(
                                    "profile.newPasswordPlaceholder",
                                )}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label={t("profile.confirmPassword")}
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[]}
                        >
                            <Input.Password
                                placeholder={t(
                                    "profile.confirmPasswordPlaceholder",
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button
                        type="primary"
                        color="cyan"
                        variant="solid"
                        htmlType="submit"
                        loading={saving}
                    >
                        {t("profile.save")}
                    </Button>
                </Form.Item>

                <Space size="small">
                    <Text type="secondary">{t("profile.updateWarning")}</Text>
                </Space>
            </Form>
        </Card>
    );
}
