"use client";

import { Table, Tag, Button, Popconfirm, message } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts } from "@/services/postsService";
import { approvePost } from "@/services/adminService";
import { getErrorMessage } from "@/utils/getErrorMessage";

type PostRow = {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "pending" | "published";
  author: { _id: string; name: string; email: string };
};

const statusColors: Record<PostRow["status"], string> = {
  draft: "default",
  pending: "orange",
  published: "green",
};

export default function AdminPosts() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const approveMutation = useMutation({
    mutationFn: approvePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error, "Approve failed"));
    },
  });

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", align: "center" as const },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      align: "center" as const,
    },
    {
      title: "Author",
      key: "author",
      align: "center" as const,
      render: (_: unknown, record: PostRow) => record.author?.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: PostRow["status"]) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: unknown, record: PostRow) =>
        record.status === "pending" ? (
          <Popconfirm
            title="Approve this post?"
            onConfirm={() => approveMutation.mutate(record._id)}
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
              loading={approveMutation.isPending && approveMutation.variables === record._id}
            />
          </Popconfirm>
        ) : null,
    },
  ];

  // hide action btns for admin
  const visiblePosts: PostRow[] = (data ?? []).filter(
    (post: PostRow) => post.status !== "draft",
  );

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={visiblePosts}
      loading={isLoading}
      className="w-full"
      scroll={{ x: "max-content" }}
    />
  );
}
