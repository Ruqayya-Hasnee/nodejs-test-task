import { Card } from "antd";
import Signup from "@/components/Signup";

export default function SignupPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <Card title="Signup">
          <Signup />
        </Card>
      </div>
    </div>
  );
}
