import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useRequest from "../../hooks/useRequest";

export default function DetailsBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { request } = useRequest();

  const [book, setBook] = useState({
    _id: "",
    _ownerId: "",
    title: "",
    author: "",
    genre: "",
    date: "",
    imageUrl: "",
    summary: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await request(`/data/books/${bookId}`);
        setBook(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchBook();
  }, [bookId]);

  const isOwner = user?._id === book._ownerId;

  const onDeleteClick = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`);
    if (!confirmDelete) return;

    try {
      await request(`/data/books/${book._id}`, "DELETE", null, { accessToken: user.accessToken });
      navigate("/catalog");
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("de-DE");
  };

  const btnClass = `
    inline-block px-10 py-3 mx-4 
    text-lg font-bold bg-sky-200 text-sky-700 rounded-lg
    shadow-[3px_3px_6px_#3081ff,-3px_-3px_6px_#3081ff]
    transition-transform hover:scale-105 hover:bg-blue-500 hover:text-white
  `;

  return (
    <div className="max-w-6xl mx-auto m-10 p-10 bg-white rounded-2xl shadow-lg text-center">
      <h1 className="text-4xl font-bold underline decoration-blue-600 underline-offset-5 mt-5 mb-15">
        {book.title || "No Title"}
      </h1>

      <div className="flex flex-wrap justify-center gap-20 mb-5">
        <img
          src={book.imageUrl || "/images/book-no-image-available.jpg"}
          alt={book.title || "No Title"}
          className="w-64 h-96 object-cover rounded-xl shadow-lg"
        />

        <div className="p-6 w-120 flex flex-col justify-center gap-5 rounded-xl bg-gray-700 shadow-inner">
          <h2 className="text-3xl mb-10 text-white font-semibold text-center">Book Information</h2>

          <div className="flex justify-between border-b border-gray-500 py-2">
            <span className="font-bold text-blue-300">Author</span>
            <span className="text-white">{book.author || "-"}</span>
          </div>

          <div className="flex justify-between border-b border-gray-500 py-2">
            <span className="font-bold text-blue-300">Genre</span>
            <span className="text-white">{book.genre || "-"}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="font-bold text-blue-300">Publication Date</span>
            <span className="text-white">{formatDate(book.date)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Summary</h2>
        <p className="text-lg leading-relaxed">{book.summary || "-"}</p>
      </div>

      {isAuthenticated && (
        <div className="w-full text-center mt-12 pt-6 border-t border-gray-500">
          {isOwner ? (
            <>
              <button onClick={() => navigate(`/book/edit/${book._id}`)} className={btnClass}>
                Edit
              </button>
              <button onClick={onDeleteClick} className={btnClass}>
                Delete
              </button>
            </>
          ) : (
            <button className={btnClass}>
              Borrow Book
            </button>
          )}
        </div>
      )}
    </div>
  );
}