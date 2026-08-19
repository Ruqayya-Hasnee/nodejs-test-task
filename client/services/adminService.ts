import { axios } from "@/utils/axios";

type CreateUserValues = {
  name: string;
  email: string;
  password: string;
};

export const getUsers = async () => {
  return await axios.get("/admin/users").then((res) => res.data);
};

export const createUser = async (values: CreateUserValues) => {
  return await axios.post("/admin/users", values).then((res) => res.data);
};

export const updateUserStatus = async ({
  id,
  status,
}: {
  id: string;
  status: "approved" | "rejected";
}) => {
  return await axios.patch(`/admin/users/${id}/status`, { status }).then((res) => res.data);
};

export const deleteUser = async (id: string) => {
  return await axios.delete(`/admin/users/${id}`).then((res) => res.data);
};

export const approvePost = async (id: string) => {
  return await axios.patch(`/admin/posts/${id}/approve`).then((res) => res.data);
};
