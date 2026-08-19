import { Card } from "antd";
import Login from "@/components/Login";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <Card title="Login">
          <Login />
        </Card>
      </div>
    </div>
  );
}
