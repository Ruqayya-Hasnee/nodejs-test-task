"use client";

import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";

type SignupValues = {
  name: string;
  email: string;
  password: string;
};

export default function Signup() {
  const [form] = Form.useForm();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      message.success("Signup successful. Wait for admin approval before logging in.");
      form.resetFields();
      router.push("/login");
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error, "Signup failed"));
    },
  });

  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full"
      autoComplete="off"
      onFinish={(values: SignupValues) => mutation.mutate(values)}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input placeholder="Enter your name" />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input autoComplete="off" placeholder="Enter your email" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password autoComplete="new-password" placeholder="Enter your password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          Signup
        </Button>
      </Form.Item>
    </Form>
  );
}
