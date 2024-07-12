"use client";

import { useFormStatus } from "react-dom";
export const SubmitButton = () => {
  const { pending } = useFormStatus();

  if (pending) {
    return <p>Creating post</p>;
  }
  return (
    <>
      <button type="reset" disabled={pending}>
        Reset
      </button>
      <button disabled={pending}>{"Create Post"}</button>
    </>
  );
};
