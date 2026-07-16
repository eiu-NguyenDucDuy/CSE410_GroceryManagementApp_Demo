import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Badge,
    Button,
    Card,
    Checkbox,
    Col,
    Input,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Tag,
    Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    ApartmentOutlined,
    AuditOutlined,
    BellOutlined,
    CheckOutlined,
    DeleteOutlined,
    SearchOutlined,
    StarFilled,
    StarOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import {
    getAllHistoryLogs,
    updateHistoryLog,
    deleteHistoryLog,
} from "../services/historyService";
import type {
    HistoryLog,
    HistorySearchField,
    HistoryTab,
} from "../types/history";
import { colors } from "../config/colors";

const { Title, Text } = Typography;

export default function HistoryPage() {
    const { t } = useTranslation();
    const { state } = useAuth();

    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<HistoryTab>("system");
    const [searchField, setSearchField] = useState<HistorySearchField>("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

    const isAdmin = state.user?.role === "admin";

    useEffect(() => {
        async function loadLogs() {
            try {
                setLoading(true);
                setError("");

                const historyData = await getAllHistoryLogs();

                setLogs(
                    historyData.sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                    ),
                );
            } catch (err) {
                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load history.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadLogs();
    }, []);

    const visibleLogs = useMemo(() => {
        const filtered = logs.filter((log) => log.tab === activeTab);

        const keyword = searchKeyword.trim().toLowerCase();

        if (!keyword) {
            return filtered;
        }

        return filtered.filter((log) => {
            const searchable = {
                all: `${log.userName} ${log.contentType} ${log.objectName} ${log.changeAction} ${log.date} ${log.time}`,
                contentType: log.contentType,
                objectName: log.objectName,
                changeAction: log.changeAction,
                userName: log.userName,
                date: log.date,
            }[searchField];

            return searchable.toLowerCase().includes(keyword);
        });
    }, [logs, activeTab, searchField, searchKeyword]);

    const unreadCount = logs.filter((log) => !log.isRead).length;
    const allSelected =
        visibleLogs.length > 0 &&
        visibleLogs.every((log) => selectedKeys.includes(log.id));

    const handleSelectAll = () => {
        const ids = visibleLogs.map((log) => log.id);

        const allSelected = visibleLogs.every((log) =>
            selectedKeys.includes(log.id),
        );

        setSelectedKeys(allSelected ? [] : ids);
    };

    const handleMarkAsRead = async () => {
        try {
            const updatedLogs = await Promise.all(
                logs.map(async (log) => {
                    if (selectedKeys.includes(log.id) && !log.isRead) {
                        return await updateHistoryLog({
                            ...log,
                            isRead: true,
                        });
                    }

                    return log;
                }),
            );

            setLogs(updatedLogs);
            setSelectedKeys([]);
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update history.",
            );
        }
    };

    const handleDeleteSelected = async () => {
        const confirmDelete = window.confirm(
            t("validation.confirmDeleteHistory"),
        );

        if (!confirmDelete) return;

        try {
            await Promise.all(selectedKeys.map((id) => deleteHistoryLog(id)));

            setLogs((prev) =>
                prev.filter((log) => !selectedKeys.includes(log.id)),
            );

            setSelectedKeys([]);
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete history.",
            );
        }
    };

    const handleToggleRead = async (record: HistoryLog) => {
        try {
            setError("");

            const updated = await updateHistoryLog({
                ...record,
                isRead: !record.isRead,
            });

            setLogs((prev) =>
                prev.map((log) => (log.id === updated.id ? updated : log)),
            );
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update history.",
            );
        }
    };

    const handleToggleStar = async (record: HistoryLog) => {
        try {
            const updated = await updateHistoryLog({
                ...record,
                isStarred: !record.isStarred,
            });

            setLogs((prev) =>
                prev.map((log) => (log.id === updated.id ? updated : log)),
            );
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to update history.",
            );
        }
    };

    const columns: ColumnsType<HistoryLog> = [
        {
            title: "",
            key: "select",
            width: 46,
            render: (_value, record) => (
                <Checkbox
                    checked={selectedKeys.includes(record.id)}
                    onChange={() =>
                        setSelectedKeys((prev) =>
                            prev.includes(record.id)
                                ? prev.filter((id) => id !== record.id)
                                : [...prev, record.id],
                        )
                    }
                />
            ),
        },
        {
            title: t("history.date"),
            dataIndex: "date",
            key: "date",
            width: 110,
        },
        {
            title: t("history.time"),
            dataIndex: "time",
            key: "time",
            width: 90,
        },
        ...(activeTab === "system"
            ? [
                  {
                      title: t("history.user"),
                      dataIndex: "userName",
                      key: "userName",
                      width: 120,
                  },
              ]
            : []),
        {
            title: t("history.contentType"),
            dataIndex: "contentType",
            key: "contentType",
            width: 120,
        },
        {
            title: t("history.object"),
            dataIndex: "objectName",
            key: "objectName",
            width: 160,
        },
        {
            title: t("history.changeAction"),
            dataIndex: "changeAction",
            key: "changeAction",
            width: 120,
            render: (value: string) => <Tag color="violet">{value}</Tag>,
        },
        {
            title: t("common.actions"),
            key: "actions",
            width: 110,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        size="small"
                        onClick={() => handleToggleStar(record)}
                    >
                        {record.isStarred ? (
                            <StarFilled style={{ color: "#fadb14" }} />
                        ) : (
                            <StarOutlined />
                        )}
                    </Button>

                    <Button
                        type="text"
                        size="small"
                        onClick={() => handleToggleRead(record)}
                    >
                        <BellOutlined />
                    </Button>
                </Space>
            ),
        },
    ];

    if (loading) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: 50,
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Title level={2} style={{ color: colors.history }}>
                {t("history.title")}
            </Title>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{
                        marginTop: 16,
                        marginBottom: 16,
                    }}
                />
            )}

            <Text type="secondary">{t("history.description")}</Text>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as HistoryTab)}
                items={[
                    {
                        key: "system",
                        label: (
                            <span>
                                <ApartmentOutlined
                                    style={{ color: colors.management }}
                                />
                                <Badge
                                    count={
                                        logs.filter(
                                            (log) =>
                                                log.tab === "system" &&
                                                !log.isRead,
                                        ).length
                                    }
                                    size="small"
                                >
                                    {t("history.system")}
                                </Badge>
                            </span>
                        ),
                    },
                    {
                        key: "user",
                        label: (
                            <span>
                                <AuditOutlined
                                    style={{ color: colors.profile }}
                                />
                                <Badge
                                    count={
                                        logs.filter(
                                            (log) =>
                                                log.tab === "user" &&
                                                !log.isRead,
                                        ).length
                                    }
                                    size="small"
                                >
                                    {t("history.user")}
                                </Badge>
                            </span>
                        ),
                    },
                ]}
            />

            <Card style={{ marginTop: 16, borderColor: colors.history }}>
                <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                    <Col xs={24} md={12} lg={8}>
                        <Input
                            placeholder={t("common.search")}
                            prefix={<SearchOutlined />}
                            value={searchKeyword}
                            onChange={(event) =>
                                setSearchKeyword(event.target.value)
                            }
                        />
                    </Col>
                    <Col xs={24} md={12} lg={6}>
                        <Select
                            value={searchField}
                            style={{ width: "100%" }}
                            onChange={(value) =>
                                setSearchField(value as HistorySearchField)
                            }
                            options={[
                                { value: "all", label: t("history.searchAll") },
                                {
                                    value: "contentType",
                                    label: t("history.contentType"),
                                },
                                {
                                    value: "objectName",
                                    label: t("history.object"),
                                },
                                {
                                    value: "changeAction",
                                    label: t("history.changeAction"),
                                },
                                { value: "userName", label: t("history.user") },
                                { value: "date", label: t("history.date") },
                            ]}
                        />
                    </Col>
                    <Col xs={24} md={24} lg={10}>
                        <Space wrap>
                            <Button onClick={handleSelectAll}>
                                {allSelected
                                    ? t("history.clearSelection")
                                    : t("history.selectAll")}
                            </Button>

                            <Button
                                type="primary"
                                color="cyan"
                                variant="outlined"
                                icon={<CheckOutlined />}
                                onClick={handleMarkAsRead}
                                disabled={!selectedKeys.length}
                            >
                                {t("history.read")}
                            </Button>

                            {isAdmin && (
                                <Button
                                    type="primary"
                                    color="red"
                                    variant="outlined"
                                    icon={<DeleteOutlined />}
                                    onClick={handleDeleteSelected}
                                    disabled={!selectedKeys.length}
                                >
                                    {t("common.delete")}
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>

                <Alert
                    type="info"
                    showIcon
                    message={`${t("history.unread")}: ${unreadCount}`}
                    style={{ marginBottom: 16 }}
                />

                <Table<HistoryLog>
                    rowKey="id"
                    columns={columns}
                    dataSource={visibleLogs}
                    pagination={{ pageSize: 8 }}
                    size="middle"
                    bordered
                    scroll={{ x: 900 }}
                />
            </Card>
        </div>
    );
}
