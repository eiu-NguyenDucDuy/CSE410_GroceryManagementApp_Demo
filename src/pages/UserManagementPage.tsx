import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Statistic,
    Table,
    Tag,
    Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser,
} from "../services/userService";
import { colors } from "../config/colors";
import { useHistoryLogger } from "../hooks/useHistoryLogger";
import { HistoryAction, HistoryContentType } from "../types/history";
import type { UserData, UserFormData } from "../types/user";

const { Search } = Input;
const { Option } = Select;

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [activeSearchKeyword, setActiveSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form] = Form.useForm<UserFormData>();
    const itemsPerPage = 10;
    const { state } = useAuth();
    const { logHistory } = useHistoryLogger();
    const isAdmin = state.user?.role === "admin";
    const { t } = useTranslation();

    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true);
                setError("");
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error(err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load users.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        form.resetFields();
    };

    const openAddModal = () => {
        setEditingUser(null);
        form.resetFields();
        setShowModal(true);
    };

    const handleEdit = (user: UserData) => {
        setEditingUser(user);
        form.setFieldsValue({
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
        });
        setShowModal(true);
    };

    const handleSubmit = async (values: UserFormData) => {
        setSaving(true);
        setError("");

        try {
            if (editingUser) {
                const updatedUser = await updateUser({
                    id: editingUser.id,
                    username: editingUser.username,
                    email: editingUser.email,
                    password: editingUser.password,
                    role: values.role,
                });

                await logHistory({
                    contentType: HistoryContentType.User,
                    objectName: updatedUser.username,
                    changeAction: HistoryAction.Update,
                });

                setUsers((prev) =>
                    prev.map((user) =>
                        user.id === updatedUser.id ? updatedUser : user,
                    ),
                );
            } else {
                const createdUser = await createUser({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                });

                await logHistory({
                    contentType: HistoryContentType.User,
                    objectName: createdUser.username,
                    changeAction: HistoryAction.Create,
                });

                setUsers((prev) => [...prev, createdUser]);
            }

            closeModal();
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Save failed.";
            setError(
                message === "Email already exists."
                    ? t("validation.emailExists")
                    : message,
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (id === state.user?.id) {
            setError(t("validation.cannotDeleteSelf"));
            return;
        }

        const user = users.find((u) => u.id === id);

        if (!user) return;

        const confirmDelete = window.confirm(t("validation.confirmDeleteUser"));
        if (!confirmDelete) return;

        try {
            await deleteUser(id);

            await logHistory({
                contentType: HistoryContentType.User,
                objectName: user.username,
                changeAction: HistoryAction.Delete,
            });

            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Delete failed.");
        }
    };

    const handleSearchSubmit = (keyword: string) => {
        setActiveSearchKeyword(keyword);
    };

    const filteredUsers = users.filter((user) => {
        const query = activeSearchKeyword.toLowerCase();
        return (
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    });

    const columns: ColumnsType<UserData> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70,
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: "ascend",
        },
        {
            title: t("user.username"),
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: t("user.email"),
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: t("user.role"),
            dataIndex: "role",
            key: "role",
            width: 120,
            sorter: (a, b) => a.role.localeCompare(b.role),
            render: (role: UserData["role"]) => (
                <Tag color={role === "admin" ? "gold" : "blue"}>
                    {role === "admin" ? t("common.Admin") : t("common.User")}
                </Tag>
            ),
        },
        ...(isAdmin
            ? [
                  {
                      title: t("common.actions"),
                      key: "actions",
                      width: 160,
                      fixed: "right" as const,
                      render: (_: unknown, record: UserData) => {
                          const isCurrentAccount = record.id === state.user?.id;

                          return (
                              <Space>
                                  <Tooltip title={t("common.edit")}>
                                      <Button
                                          type="text"
                                          color="primary"
                                          variant="outlined"
                                          icon={<EditOutlined />}
                                          onClick={() => handleEdit(record)}
                                      />
                                  </Tooltip>

                                  <Tooltip title={t("common.delete")}>
                                      <Button
                                          type="text"
                                          color="danger"
                                          variant="outlined"
                                          icon={<DeleteOutlined />}
                                          onClick={() =>
                                              handleDelete(record.id)
                                          }
                                          disabled={isCurrentAccount}
                                      />
                                  </Tooltip>
                              </Space>
                          );
                      },
                  },
              ]
            : []),
    ];

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <h2 style={{ color: colors.users }}>{t("user.userManagement")}</h2>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
            )}

            <Card style={{ marginBottom: 20, borderColor: colors.users }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic
                            title={t("user.totalUsers")}
                            value={users.length}
                            prefix={
                                <UserOutlined style={{ color: colors.users }} />
                            }
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title={t("user.adminUsers")}
                            value={
                                users.filter((user) => user.role === "admin")
                                    .length
                            }
                            valueStyle={{ color: "gold" }}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title={t("user.standardUsers")}
                            value={
                                users.filter((user) => user.role === "user")
                                    .length
                            }
                            valueStyle={{ color: "blue" }}
                        />
                    </Col>
                </Row>
            </Card>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    gap: 12,
                    flexWrap: "wrap",
                }}
            >
                {isAdmin && (
                    <Button
                        type="text"
                        color="cyan"
                        variant="outlined"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                    >
                        {t("user.addUser")}
                    </Button>
                )}

                <Search
                    placeholder={t("common.search")}
                    allowClear
                    enterButton
                    onSearch={handleSearchSubmit}
                    style={{ width: 350 }}
                />
            </div>

            <Table<UserData>
                rowKey="id"
                columns={columns}
                dataSource={filteredUsers}
                bordered
                size="middle"
                scroll={{ x: 1100 }}
                pagination={{
                    pageSize: itemsPerPage,
                    showQuickJumper: true,
                    showSizeChanger: false,
                }}
            />

            <Modal
                title={editingUser ? t("user.editUser") : t("user.addUser")}
                open={showModal}
                onCancel={closeModal}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: 16 }}
                >
                    {!editingUser && (
                        <>
                            <Form.Item
                                label={t("user.username")}
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "validation.usernameRequired",
                                        ),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t("user.usernamePlaceholder")}
                                />
                            </Form.Item>

                            <Form.Item
                                label={t("user.email")}
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
                                    placeholder={t("user.emailPlaceholder")}
                                />
                            </Form.Item>

                            <Form.Item
                                label={t("user.password")}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "validation.passwordRequired",
                                        ),
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder={t("user.passwordPlaceholder")}
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        label={t("user.role")}
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: t("validation.roleRequired"),
                            },
                        ]}
                    >
                        <Select placeholder={t("user.rolePlaceholder")}>
                            <Option value="admin">{t("common.Admin")}</Option>
                            <Option value="user">{t("common.User")}</Option>
                        </Select>
                    </Form.Item>

                    <div style={{ textAlign: "right" }}>
                        <Space>
                            <Button
                                type="primary"
                                color="green"
                                variant="solid"
                                htmlType="submit"
                                loading={saving}
                            >
                                {editingUser
                                    ? t("common.update")
                                    : t("common.save")}
                            </Button>
                            <Button
                                type="primary"
                                color="red"
                                variant="solid"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                {t("common.cancel")}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </>
    );
}
