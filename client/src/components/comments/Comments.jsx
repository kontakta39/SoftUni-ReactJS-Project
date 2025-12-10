import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useRequest from "../../hooks/useRequest";
import useForm from "../../hooks/useForm";

export default function Comments({ bookId, user, isOwner }) {
  const { isAuthenticated } = useAuth();
  const { request } = useRequest();
  const [comments, setComments] = useState([]);

  const initialValues = { comment: "" };

  const validateField = (field, values) => {
    if (field === "comment") {
      if (!values.comment.trim()) return "Comment is required.";
    }
    return "";
  };

  const onSubmit = async (values, resetForm) => {
    if (!isAuthenticated) return;

    const newComment = {
      bookId,
      text: values.comment,
      username: user.username,
    };

    try {
      const saved = await request("/data/comments", "POST", newComment, {
        accessToken: user.accessToken,
      });
      setComments((prev) => [...prev, saved]);
      resetForm();
    } catch (err) {
      alert("Failed to post comment: " + err.message);
    }
  };

  const { values, errors, touched, register, handleSubmit, resetForm } = useForm(
    initialValues,
    validateField,
    (vals) => onSubmit(vals, resetForm)
  );

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await request(
          `/data/comments?where=bookId%3D%22${bookId}%22`
        );
        setComments(data);
      } catch (err) {
        console.log("Failed to load comments:", err.message);
      }
    };
    fetchComments();
  }, [bookId]);

  const inputFieldClass = (field) =>
    `peer w-full rounded-lg border px-4 py-3 placeholder-transparent bg-white text-black resize-none ${
      touched[field] && errors[field] ? "border-red-600" : "border-black"
    } hover:border-blue-600 focus:border-blue-600 focus:outline-none`;

  const labelFieldClass = (field) =>
    `absolute left-4 bg-white px-1 transition-all duration-200 top-3 text-black ${
      values[field] ? "top-[-10px] text-black" : ""
    } peer-hover:text-blue-600 peer-focus:top-[-10px] peer-focus:text-blue-600 peer-focus:text-sm`;

  return (
    <div className="max-w-3xl mx-auto mt-16 space-y-10">
      <div className="bg-white shadow-xl rounded-3xl p-7 border border-gray-200 space-y-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-4">
          Comments
        </h2>

        {comments.length === 0 ? (
          <p className="text-xl text-gray-500 text-center italic mb-3">
            No comments yet...
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 transition-transform hover:scale-[1.01] hover:shadow-md"
            >
              <p className="text-gray-900 leading-relaxed whitespace-pre-line text-lg">
                {c.text}
              </p>
              <div className="mt-6 flex items-center justify-end">
                <span className="text-sm text-gray-500 italic">{c.username}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isAuthenticated && !isOwner && (
        <form
          onSubmit={handleSubmit}
          className="shadow-xl rounded-3xl p-10 border bg-white border-gray-200 space-y-8 transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl mt-10"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-4">
            Add a Comment
          </h3>

          <div className="relative">
            <textarea
              id="comment"
              placeholder=" "
              rows="5"
              className={inputFieldClass("comment")}
              {...register("comment")}
            />
            <label htmlFor="comment" className={labelFieldClass("comment")}>
              Write your comment...
            </label>
            {touched.comment && errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-12 py-3 text-lg bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            >
              Post Comment
            </button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <div className="shadow-xl rounded-3xl p-10 border bg-sky-200 border-blue-200 text-center mt-10">
          <p className="text-xl text-sky-700 font-medium italic">
            Log in to post a comment.
          </p>
        </div>
      )}

      {isOwner && (
        <div className="shadow-xl rounded-3xl p-10 border bg-red-50 border-red-200 text-center mt-10">
          <p className="text-xl text-red-500 font-medium italic">
            You cannot comment on your own book.
          </p>
        </div>
      )}
    </div>
  );
}