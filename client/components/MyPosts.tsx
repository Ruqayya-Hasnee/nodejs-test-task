"use client";

import { useState } from "react";
import { Table, Tag, Button, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/postsService";
import { getDecodedToken } from "@/services/tokenService";
import NewPost from "@/components/NewPost";

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

export default function MyPosts() {
  const [editingPost, setEditingPost] = useState<PostRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const myId = getDecodedToken()?._id;
  const myPosts: PostRow[] = (data ?? []).filter(
    (post: PostRow) => post.author?._id === myId,
  );

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
        record.status === "draft" ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditingPost(record)}
          >
            Edit
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={myPosts}
        loading={isLoading}
        className="w-full"
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Edit Post"
        open={Boolean(editingPost)}
        onCancel={() => setEditingPost(null)}
        footer={null}
        destroyOnHidden
        centered
      >
        {editingPost && (
          <NewPost
            post={{
              _id: editingPost._id,
              title: editingPost.title,
              content: editingPost.content,
              status: "draft",
            }}
            onSuccess={() => setEditingPost(null)}
          />
        )}
      </Modal>
    </>
  );
}
