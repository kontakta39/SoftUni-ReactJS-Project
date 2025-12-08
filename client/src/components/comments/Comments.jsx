import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useRequest from "../../hooks/useRequest";

export default function Comments({ bookId, user, isOwner }) {
  const { isAuthenticated } = useAuth();
  const { request } = useRequest();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  {/* Load comments */}
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await request(`/data/comments?where=bookId%3D%22${bookId}%22`);
        setComments(data);
      } catch (err) {
        console.log("Failed to load comments:", err.message);
      }
    };
    fetchComments();
  }, [bookId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (!value.trim()) setError("Comment is required.");
    else setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Comment is required.");
      return;
    }

    if (!isAuthenticated) return;

    const newComment = {
      bookId,
      text,
      username: user.username,
    };

    try {
      const saved = await request("/data/comments", "POST", newComment, {
        accessToken: user.accessToken,
      });
      setComments((prev) => [...prev, saved]);
      setText("");
      setError("");
    } catch (err) {
      alert("Failed to post comment: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 space-y-10">
      <div className="bg-white shadow-xl rounded-3xl p-7 border border-gray-200 space-y-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-4">
          Comments
        </h2>

        {comments.length === 0 ? (
          <p className="text-xl text-gray-500 text-center italic mb-3">No comments yet...</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 transition-transform hover:scale-[1.01] hover:shadow-md">
              <p className="text-gray-900 leading-relaxed whitespace-pre-line text-lg">{c.text}</p>
              <div className="mt-6 flex items-center justify-end">
                <span className="text-sm text-gray-500 italic">{c.username}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment form */}
      {isAuthenticated && !isOwner && (
        <form
          onSubmit={submitHandler}
          className="shadow-xl rounded-3xl p-10 border bg-white border-gray-200 space-y-8 transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl mt-10"
        >
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-4">
            Add a Comment
          </h3>

          <div className="relative">
            <textarea
              name="comment"
              id="comment"
              rows="5"
              value={text}
              onChange={handleChange}
              placeholder=" "
              className={`peer w-full rounded-lg border px-4 py-3 placeholder-transparent bg-white text-black resize-none
                ${error ? "border-red-600" : "border-black"}
                hover:border-blue-600 focus:border-blue-600 focus:outline-none
              `}
            />
            <label
              htmlFor="comment"
              className={`absolute left-4 bg-white px-1 transition-all duration-200 top-3 text-black
                ${text ? "top-[-10px] text-black" : ""}
                peer-hover:text-blue-600 peer-focus:top-[-10px] peer-focus:text-blue-600 peer-focus:text-sm
              `}
            >
              Write your comment...
            </label>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
          <p className="text-xl text-sky-700 font-medium italic">Log in to post a comment.</p>
        </div>
      )}

      {isOwner && (
        <div className="shadow-xl rounded-3xl p-10 border bg-red-50 border-red-200 text-center mt-10">
          <p className="text-xl text-red-500 font-medium italic">You cannot comment on your own book.</p>
        </div>
      )}
    </div>
  );
}