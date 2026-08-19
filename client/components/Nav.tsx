"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Button, Space, Popconfirm, Modal, Form, Input, message } from "antd";
import { LogoutOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createUser } from "@/services/adminService";
import { getErrorMessage } from "@/utils/getErrorMessage";

const baseItems = [
  { key: "/", label: <Link href="/">Home</Link> },
  { key: "/login", label: <Link href="/login">Login</Link> },
  { key: "/signup", label: <Link href="/signup">Signup</Link> },
];

const dashboardTitles: Record<"admin" | "user" | "guest", string> = {
  admin: "Admin Dashboard",
  user: "User Dashboard",
  guest: "Dashboard",
};

type CreateUserValues = {
  name: string;
  email: string;
  password: string;
};

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { role, logout } = useAuth();
  const [form] = Form.useForm();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success("User created.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      form.resetFields();
      setIsCreateOpen(false);
      router.push("/");
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error, "Could not create user"));
    },
  });

  const items = baseItems.filter((item) => {
    if ((item.key === "/login" || item.key === "/signup") && role) return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-medium tracking-tight text-gray-900 sm:text-lg"
        >
          {dashboardTitles[role ?? "guest"]}
        </Link>
        <div className="flex w-full items-center justify-between gap-3 sm:contents">
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={items}
            className="min-w-0 sm:flex-1 sm:justify-end"
            style={{ borderBottom: "none" }}
          />
          {role && (
            <Space size="small" wrap className="shrink-0 sm:gap-x-3">
              {role === "admin" && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create User
                </Button>
              )}
              {role === "user" && (
                <Link href="/posts/new">
                  <Button type="primary" icon={<PlusOutlined />}>
                    New Post
                  </Button>
                </Link>
              )}
              <Popconfirm
                title="Are you sure you want to logout?"
                onConfirm={handleLogout}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </Popconfirm>
            </Space>
          )}
        </div>
      </div>

      <Modal
        title="Create User"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        footer={null}
        destroyOnHidden
        centered
      >
        <Form
          form={form}
          layout="vertical"
          className="w-full"
          onFinish={(values: CreateUserValues) => createMutation.mutate(values)}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter user's name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input autoComplete="off" placeholder="Enter user's email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password autoComplete="new-password" placeholder="Enter a password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </header>
  );
}
