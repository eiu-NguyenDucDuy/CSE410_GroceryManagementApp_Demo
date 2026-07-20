import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Row,
    Select,
    Space,
    Switch,
    Tag,
    Typography,
} from "antd";
import {
    BellOutlined,
    CheckCircleOutlined,
    GlobalOutlined,
    LockOutlined,
    MoonOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import useLanguage from "../hooks/useLanguage";
import { languages, type Language } from "../config/languages";
import {
    areNotificationsEnabled,
    setNotificationsEnabled,
} from "../services/historyService";

const { Title, Text } = Typography;

export default function SettingsPage() {
    const { t } = useTranslation();
    const { state } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [notifications, setNotifications] = useState(
        areNotificationsEnabled(),
    );
    const [autoSave, setAutoSave] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setNotificationsEnabled(notifications);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            <Title level={2}>{t("settings.title")}</Title>
            <Text type="secondary">{t("settings.description")}</Text>

            {saved ? (
                <Alert
                    type="success"
                    showIcon
                    message={t("settings.saved")}
                    icon={<CheckCircleOutlined />}
                    style={{ marginTop: 16, marginBottom: 16 }}
                />
            ) : null}

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <Card
                        bordered={false}
                        title={
                            <Space>
                                <SettingOutlined />
                                <span>{t("settings.preferences")}</span>
                            </Space>
                        }
                    >
                        <Form layout="vertical">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label={t("settings.theme")}>
                                        <Card
                                            size="small"
                                            style={{
                                                background: darkMode
                                                    ? "#141414"
                                                    : "#f8f8f8",
                                            }}
                                        >
                                            <Space
                                                align="center"
                                                style={{
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <div>
                                                    <Text strong>
                                                        {darkMode
                                                            ? t(
                                                                  "settings.darkMode",
                                                              )
                                                            : t(
                                                                  "settings.lightMode",
                                                              )}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">
                                                        {t(
                                                            "settings.themeDescription",
                                                        )}
                                                    </Text>
                                                </div>
                                                <Switch
                                                    checked={darkMode}
                                                    onChange={toggleTheme}
                                                    checkedChildren={
                                                        <MoonOutlined />
                                                    }
                                                />
                                            </Space>
                                        </Card>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item label={t("settings.language")}>
                                        <Select
                                            value={language}
                                            style={{ width: "100%" }}
                                            options={Object.entries(
                                                languages,
                                            ).map(([value, config]) => ({
                                                value,
                                                label: config.label,
                                            }))}
                                            onChange={(value) =>
                                                setLanguage(value as Language)
                                            }
                                            prefix={<GlobalOutlined />}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={t("settings.notifications")}
                                    >
                                        <Card size="small">
                                            <Space
                                                align="center"
                                                style={{
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <div>
                                                    <Text strong>
                                                        {t(
                                                            "settings.notifications",
                                                        )}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">
                                                        {t(
                                                            "settings.notificationsDescription",
                                                        )}
                                                    </Text>
                                                </div>
                                                <Switch
                                                    checked={notifications}
                                                    onChange={(checked) => {
                                                        setNotifications(
                                                            checked,
                                                        );
                                                        setNotificationsEnabled(
                                                            checked,
                                                        );
                                                    }}
                                                    checkedChildren={
                                                        <BellOutlined />
                                                    }
                                                />
                                            </Space>
                                        </Card>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item label={t("settings.autoSave")}>
                                        <Card size="small">
                                            <Space
                                                align="center"
                                                style={{
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <div>
                                                    <Text strong>
                                                        {t("settings.autoSave")}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary">
                                                        {t(
                                                            "settings.autoSaveDescription",
                                                        )}
                                                    </Text>
                                                </div>
                                                <Switch
                                                    checked={autoSave}
                                                    onChange={setAutoSave}
                                                />
                                            </Space>
                                        </Card>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card bordered={false} title={t("settings.accountSummary")}>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{ width: "100%" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <Avatar
                                    size={56}
                                    src={state.user?.avatar}
                                    icon={<UserOutlined />}
                                />
                                <div>
                                    <Text strong>{state.user?.username}</Text>
                                    <br />
                                    <Tag
                                        color={
                                            state.user?.role === "admin"
                                                ? "gold"
                                                : "blue"
                                        }
                                    >
                                        {state.user?.role === "admin"
                                            ? t("common.Admin")
                                            : t("common.User")}
                                    </Tag>
                                </div>
                            </div>

                            <Divider />

                            <Space direction="vertical" size="small">
                                <Text type="secondary">
                                    {t("settings.username")}
                                </Text>
                                <Text strong>{state.user?.username}</Text>
                            </Space>

                            <Space direction="vertical" size="small">
                                <Text type="secondary">
                                    {t("settings.email")}
                                </Text>
                                <Text strong>{state.user?.email}</Text>
                            </Space>

                            <Space direction="vertical" size="small">
                                <Text type="secondary">
                                    {t("settings.security")}
                                </Text>
                                <Text>
                                    <LockOutlined />{" "}
                                    {t("settings.secureAccount")}
                                </Text>
                            </Space>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 24, textAlign: "right" }}>
                <Button type="primary" onClick={handleSave}>
                    {t("common.save")}
                </Button>
            </div>
        </div>
    );
}
