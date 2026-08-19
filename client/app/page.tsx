"use client";

import { Card, Spin } from "antd";
import AdminUsers from "@/components/AdminUsers";
import AdminPosts from "@/components/AdminPosts";
import MyPosts from "@/components/MyPosts";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { role, checked } = useAuth();

  if (!checked) {
    return <Spin />;
  }

  if (role === "admin") {
    return (
      <div className="flex flex-col gap-6">
        <AdminUsers />
        <Card title="Posts">
          <AdminPosts />
        </Card>
      </div>
    );
  }

  if (role === "user") {
    return (
      <Card title="My Posts">
        <MyPosts />
      </Card>
    );
  }

  return (
    <Card title="Welcome">
      <p>This is the basic frontend for the test task.</p>
    </Card>
  );
}
