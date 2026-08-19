import { Card } from "antd";
import NewPost from "@/components/NewPost";

export default function NewPostPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <Card title="New Post">
        <NewPost />
      </Card>
    </div>
  );
}
