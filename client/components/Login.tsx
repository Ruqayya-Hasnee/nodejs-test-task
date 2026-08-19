"use client";

import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAuth } from "@/hooks/useAuth";

type LoginValues = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const { refresh } = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      message.success("Login successful.");
      refresh();
      router.push("/");
    },
    onError: (error: unknown) => {
      message.error(getErrorMessage(error, "Login failed"));
    },
  });

  return (
    <Form
      layout="vertical"
      className="w-full"
      onFinish={(values: LoginValues) => mutation.mutate(values)}
    >
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input placeholder="Enter your email" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password placeholder="Enter your password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
