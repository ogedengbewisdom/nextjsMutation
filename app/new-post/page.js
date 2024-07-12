"use client";

import { SubmitButton } from "@/components/submit-button";
import { createPost } from "@/lib/post-mutation";
// import { createPost } from "@/lib/format";
// import { storePost } from "@/lib/posts";
import { useFormState } from "react-dom";

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, {});

  return (
    <>
      <h1>Create a new post</h1>
      <form action={formAction}>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          {state.errors && (
            <ul className="form-errors">
              {state.errors.map((error, index) => {
                return <li key={index}>{error.title}</li>;
              })}
            </ul>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
          {state.errors && (
            <ul className="form-errors">
              {state.errors.map((error, index) => {
                return <li key={index}>{error.image}</li>;
              })}
            </ul>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
          {state.errors && (
            <ul className="form-errors">
              {state.errors.map((error, index) => {
                return <li key={index}>{error.content}</li>;
              })}
            </ul>
          )}
        </div>
        <div className="form-actions">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
