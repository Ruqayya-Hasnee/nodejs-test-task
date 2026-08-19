"use client";

import { Form, Input, Select, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/services/postsService";
import { getErrorMessage } from "@/utils/getErrorMessage";

type PostValues = {
  title: string;
  content: string;
  status: "draft" | "pending";
};

type NewPostProps = {
  post?: { _id: string; title: string; content: string; status: "draft" | "pending" };
  onSuccess?: () => void;
};

export default function NewPost({ post, onSuccess }: NewPostProps) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isEdit = Boolean(post);

  const mutation = useMutation({
    mutationFn: (values: PostValues) =>
      isEdit ? updatePost({ id: post!._id, values }) : createPost(values),
    onSuccess: (_, values) => {
      message.success(
        isEdit && values.status === "pending" ? "Post submitted for review." : isEdit ? "Post updated." : "Post saved.",
      );
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (!isEdit) {
        form.resetFields();
        router.push("/");
      }
      onSuccess?.();
    },
    onError: (error: unknown) => {
      message.error(
        getErrorMessage(error, isEdit ? "Could not update post" : "Could not save post"),
      );
    },
  });

  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full"
      initialValues={
        post ? { title: post.title, content: post.content, status: post.status } : { status: "draft" }
      }
      onFinish={(values: PostValues) => mutation.mutate(values)}
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Enter post title" />
      </Form.Item>
      <Form.Item name="content" label="Content" rules={[{ required: true }]}>
        <Input.TextArea rows={6} placeholder="Enter post content" />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select
          options={[
            { value: "draft", label: "Draft" },
            { value: "pending", label: "Submit for review" },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {isEdit ? "Save Changes" : "Save Post"}
        </Button>
      </Form.Item>
    </Form>
  );
}
