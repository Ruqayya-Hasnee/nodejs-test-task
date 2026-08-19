import { axios } from "@/utils/axios";

type PostValues = {
  title: string;
  content: string;
  status: "draft" | "pending";
};

export const createPost = async (values: PostValues) => {
  return await axios.post("/posts", values).then((res) => res.data);
};

export const getPosts = async () => {
  return await axios.get("/posts").then((res) => res.data);
};

export const updatePost = async ({
  id,
  values,
}: {
  id: string;
  values: Partial<PostValues>;
}) => {
  return await axios.patch(`/posts/${id}`, values).then((res) => res.data);
};
