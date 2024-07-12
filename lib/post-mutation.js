"use server";

import { redirect } from "next/navigation";
import { storePost, updatePostLikeStatus } from "./posts";
import { uploadImage } from "./cloudinary";
import { revalidatePath } from "next/cache";

const checkData = (text) => {
  return text.trim() === "" || !text;
};

export const createPost = async (previousState, formData) => {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");
  // const postData = {
  //   title: formData.get("title"),
  //   imageUrl: "",
  //   content: formData.get("content"),
  //   userId: 1,
  // };

  let errors = [];

  if (checkData(title)) {
    errors.push({ title: "Title can't be empty" });
  }
  if (checkData(content)) {
    errors.push({ content: "Content can't be empty" });
  }
  if (!image || image.size === 0) {
    errors.push({ image: "Image is required" });
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;

  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error("Failed to upload image, try again later");
  }
  storePost({
    imageUrl: imageUrl,
    title,
    content,
    userId: 1,
  });

  revalidatePath("/feed");
  redirect("/feed");
};

export const togglePostStatus = async (postId) => {
  await updatePostLikeStatus(postId, 2);
  revalidatePath("/", "layout");
};
