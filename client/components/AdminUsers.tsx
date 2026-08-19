"use client";

import { Card, Table, Tag, Button, Popconfirm, Avatar, Space, message } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus, deleteUser } from "@/services/adminService";
import { getErrorMessage } from "@/utils/getErrorMessage";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "pending" | "approved" | "rejected";
};

const statusColors: Record<UserRow["status"], string> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
};

const roleColors: Record<UserRow["role"], string> = {
  admin: "purple",
  user: "blue",
};

const avatarColors: Record<UserRow["role"], string> = {
  admin: "#722ed1",
  user: "#1677ff",
};

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getUsers,
  });

  const statusMutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error, "Could not update user status"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error, "Could not delete user"));
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      render: (name: string, record: UserRow) => (
        <Space>
          <Avatar style={{ backgroundColor: avatarColors[record.role] }}>
            {name ? name.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <span className="font-medium">{name}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      align: "center" as const,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center" as const,
      render: (role: UserRow["role"]) => (
        <Tag color={roleColors[role]} className="uppercase">
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: UserRow["status"]) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      align: "center" as const,
      key: "action",
      render: (_: unknown, record: UserRow) => {
        if (record.role === "admin") {
          return null;
        }

        const approveBtn = (
          <Popconfirm
            title="Approve this user?"
            onConfirm={() => statusMutation.mutate({ id: record._id, status: "approved" })}
            okText="Approve"
          >
            <Button
              icon={<CheckOutlined />}
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                color: "#fff",
                width: 36,
                height: 36,
                borderRadius: 10,
              }}
              aria-label="Approve"
              loading={
                statusMutation.isPending &&
                statusMutation.variables?.id === record._id &&
                statusMutation.variables?.status === "approved"
              }
            />
          </Popconfirm>
        );

        const rejectBtn = (
          <Popconfirm
            title="Reject this user?"
            onConfirm={() => statusMutation.mutate({ id: record._id, status: "rejected" })}
            okText="Reject"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              icon={<CloseOutlined />}
              style={{ width: 36, height: 36, borderRadius: 10 }}
              aria-label="Reject"
              loading={
                statusMutation.isPending &&
                statusMutation.variables?.id === record._id &&
                statusMutation.variables?.status === "rejected"
              }
            />
          </Popconfirm>
        );

        const deleteBtn = (
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{ width: 36, height: 36, borderRadius: 10 }}
              aria-label="Delete"
              loading={deleteMutation.isPending && deleteMutation.variables === record._id}
            />
          </Popconfirm>
        );

        const statusBtn =
          record.status === "pending" ? (
            <>
              {approveBtn}
              {rejectBtn}
            </>
          ) : record.status === "rejected" ? (
            approveBtn
          ) : (
            rejectBtn
          );

        return (
          <Space>
            {statusBtn}
            {deleteBtn}
          </Space>
        );
      },
    },
  ];

  return (
    <Card title="Users">
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        className="w-full"
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}
