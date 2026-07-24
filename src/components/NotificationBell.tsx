import {
    Badge,
    Dropdown,
    List,
    Typography,
    Space,
    Button,
    Tag,
    Empty,
    Tooltip,
    theme,
} from "antd";
import {
    ApartmentOutlined,
    AuditOutlined,
    BellOutlined,
    EyeOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    getAllHistoryLogs,
    toggleHistoryStarState,
    areNotificationsEnabled,
    toggleHistoryReadState,
} from "../services/historyService";
import type { HistoryLog, ActiveTab } from "../types/history";
import { colors } from "../config/colors";
import { useAuth } from "../hooks/useAuth";

const { Text } = Typography;

export default function NotificationBell() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { state } = useAuth();
    const { token } = theme.useToken();
    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>("system");
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        areNotificationsEnabled(),
    );

    useEffect(() => {
        const loadLogs = async () => {
            const data = await getAllHistoryLogs();
            setLogs(data);
            setNotificationsEnabled(areNotificationsEnabled());
        };

        loadLogs();
    }, []);

    const unreadCount = useMemo(
        () => logs.filter((log) => !log.isRead).length,
        [logs],
    );

    const filteredLogs = logs.filter((log) => {
        if (activeTab === "user") {
            return log.userId === state.user?.id;
        }

        return log.userId !== state.user?.id;
    });

    const handleOpenChange = async (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            return;
        }

        try {
            const data = await getAllHistoryLogs();
            setLogs(data);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        }
    };

    const handleToggleStar = async (id: number) => {
        try {
            await toggleHistoryStarState(id);

            const data = await getAllHistoryLogs();
            setLogs(data);
        } catch (error) {
            console.error("Failed to toggle star:", error);
        }
    };

    const handleToggleRead = async (id: number) => {
        try {
            await toggleHistoryReadState(id);

            const data = await getAllHistoryLogs();
            setLogs(data);
        } catch (error) {
            console.error("Failed to toggle read:", error);
        }
    };

    const handleGoToHistory = () => {
        navigate("/dashboard/history");
        setOpen(false);
    };

    const dropdownContent = (
        <div
            style={{
                width: 320,
                maxHeight: 480,
                overflow: "auto",
                padding: "8px 12px",
                background: token.colorBgBase,
                borderRadius: 8,
                boxShadow: `0 6px 16px ${token.colorBgMask}`,
                border: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <div
                style={{
                    padding: "8px 0",
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
            >
                <Space
                    style={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Text strong>{t("history.title")}</Text>

                    <Button size="small" onClick={handleGoToHistory}>
                        {t("common.viewAll")}
                    </Button>
                </Space>

                <div style={{ marginTop: 8 }}>
                    <Tooltip title={t("history.system")}>
                        <Button
                            type="primary"
                            color="orange"
                            variant="outlined"
                            size="small"
                            icon={<ApartmentOutlined />}
                            onClick={() => setActiveTab("system")}
                        ></Button>
                    </Tooltip>

                    <Tooltip title={t("history.user")}>
                        <Button
                            type="primary"
                            color="blue"
                            variant="outlined"
                            size="small"
                            icon={<AuditOutlined />}
                            style={{ marginLeft: 8 }}
                            onClick={() => setActiveTab("user")}
                        ></Button>
                    </Tooltip>
                </div>
            </div>

            {filteredLogs.length === 0 ? (
                <Empty
                    description={t("history.noLogs")}
                    style={{ padding: 24 }}
                />
            ) : (
                <List
                    dataSource={[...filteredLogs]
                        .sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime(),
                        )
                        .slice(0, 8)}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <Tooltip
                                    title={
                                        item.isStarred
                                            ? t("history.unmark")
                                            : t("history.mark")
                                    }
                                >
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={() =>
                                            handleToggleStar(item.id)
                                        }
                                    >
                                        {item.isStarred ? (
                                            <StarFilled
                                                style={{ color: colors.mark }}
                                            />
                                        ) : (
                                            <StarOutlined />
                                        )}
                                    </Button>
                                </Tooltip>,

                                <Tooltip
                                    title={
                                        item.isRead
                                            ? t("history.read")
                                            : t("history.unread")
                                    }
                                >
                                    <Button
                                        type="text"
                                        size="small"
                                        onClick={() =>
                                            handleToggleRead(item.id)
                                        }
                                    >
                                        {item.isRead ? (
                                            <EyeOutlined
                                                style={{ color: colors.read }}
                                            />
                                        ) : (
                                            <BellOutlined />
                                        )}
                                    </Button>
                                </Tooltip>,
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <Space>
                                        <Text strong>{item.objectName}</Text>
                                        <Tag
                                            color={
                                                activeTab === "system"
                                                    ? colors.management
                                                    : colors.profile
                                            }
                                        >
                                            {item.changeAction}
                                        </Tag>
                                    </Space>
                                }
                                description={
                                    <div>
                                        <div>{item.contentType}</div>
                                        <div
                                            style={{ color: "#8c8c8c" }}
                                        >{`${item.date} ${item.time} • ${item.userName}`}</div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );

    if (!notificationsEnabled) {
        return null;
    }

    return (
        <Dropdown
            open={open}
            onOpenChange={handleOpenChange}
            popupRender={() => dropdownContent}
            trigger={["click"]}
            placement="bottomRight"
        >
            <Badge count={unreadCount} size="small" overflowCount={99}>
                <BellOutlined style={{ fontSize: 18, cursor: "pointer" }} />
            </Badge>
        </Dropdown>
    );
}
